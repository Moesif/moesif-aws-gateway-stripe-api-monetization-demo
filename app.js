const express = require('express')
const path = require("path");
require('dotenv').config()
var bodyParser = require('body-parser')
const moesif = require('moesif-nodejs');
const Stripe = require('stripe');
// npm i --save node-fetch@2.6.5
const fetch = require('node-fetch');
// npm install @aws-sdk/client-api-gateway
const { APIGatewayClient, CreateApiKeyCommand, CreateUsagePlanKeyCommand } = require("@aws-sdk/client-api-gateway");


const app = express();
app.use(express.static(path.join(__dirname)));
const port = 3000;
const stripe = Stripe(process.env.STRIPE_KEY);
var jsonParser = bodyParser.json();
// a client can be shared by different commands.
config = {
  invokeUrl: process.env.AWS_INVOKE_URL,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
}
const client = new APIGatewayClient(config);

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID
});

app.use(moesifMiddleware);

app.post('/register', jsonParser,
 async (req, res) => {
    console.log(req.body);

    // Generate API key
    const params = {
      name: req.body.email,
      enabled: true,
    };
    const command = new CreateApiKeyCommand(params);
    const response = await client.send(command);
    const awsApiKeyId = response.id;
    const awsApiKey = response.value;
    console.log(response);

    // Associate the API key with a usage plan
    const usageKeyCommand = new CreateUsagePlanKeyCommand({
  keyId: response.id,
  keyType: process.env.AWS_USAGE_PLAN_KEY_TYPE,
  usagePlanId: process.env.AWS_USAGE_PLAN_ID
    });
    const usageKeyResponse = await client.send(usageKeyCommand);
    console.log(usageKeyResponse);

    // create Stripe customer
    console.log('create stripe customer');
    const customer = await stripe.customers.create({
      email: req.body.email,
      name: `${req.body.firstname} ${req.body.lastname}`,
      description: 'Customer created through /register endpoint',
      metadata: {
        'awsAPIKeyId': awsApiKeyId,
      }
    });
    console.log('stripe customer created');

    // create Stripe subscription
    console.log('create stripe subscription');
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        { price: process.env.STRIPE_PRICE_KEY },
      ],
    });
    console.log('stripe subscription created: ' + subscription.id);

    // create user, company, and subscription in Moesif
    var company = { companyId: customer.id };
    moesifMiddleware.updateCompany(company);

    var user = {
      userId: customer.id,
      companyId: customer.id,
      metadata: {
        email: req.body.email,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
      }
    };
    moesifMiddleware.updateUser(user);

    var subscription = {
      subscriptionId: subscription.id,
      companyId: customer.id,
      status: "active",
    }
    moesifMiddleware.updateSubscription(subscription).then((result) => { 
      console.log("subscription updated successfully");
    }).catch((err) => {
      console.error("Error updating subscription", err);
    } );

    res.status(200)
    res.send({ apikey: awsApiKey });
 }
)

app.get("/", function (_req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
  res.sendFile(path.join(__dirname, "index.js"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

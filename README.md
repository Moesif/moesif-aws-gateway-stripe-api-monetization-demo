# moesif-AWS-gateway-stripe-api-monetization-demo

This project was created to show a simple but end-to-end solution for monetizing APIs with AWS Gateway, Stripe, and Moesif.

To see an end-to-end detailed example of this in action and a line-by-line explanation of the code and steps involved, check out our [complete guide](https://www.moesif.com/blog/technical/stripe/aws-api-gateway/End-To-End-API-Monetization-With-AWS-API-Gateway-Stripe-And-Moesif/).

## Prerequisites
To run this project you must have __Node and npm installed__.

You must also have:
- an active instance of AWS API gateway up and running with at least one API proxied through it
- Your log config needs to have the "user" field set to: "user": "$context.identity.apiKeyId". this will map the API Key to the Moesif UserId.
- Your endpoints in AWS Gateway should be protected by __API Key__
- an active Stripe account with at least one __Product__ and __Price__ created
- Have an active __Stripe integration__ and __billing meter__ in Moesif which includes the endpoints you want to monetize. To set one up, check out our guide on it [here](https://www.moesif.com/docs/guides/guide-on-creating-a-billing-meter-with-stripe/).

## Installation

After you cloned your repo, in the root folder of the repo, to set up your environment and install dependencies, run `npm install`.

## Deployment

In the `.env` file, you will need to plug in a few details in order to make this work.

__STRIPE_KEY__ will contain the key to access the Stripe APIs.

__STRIPE_PRICE_KEY__ will contain the key to your Product's Price in Stripe

__MOESIF_APPLICATION_ID__ will contain your Moesif Application ID.

__AWS_INVOKE_URL__ This will be the URL of your AWS API Gateway. This can be found by navigating to your API in the AWS API Gateway Console, navigating to Stages, selecting your stage, and copying the Invoke URL on the screen.

__AWS_REGION__ This value will be based on the AWS region where you have your AWS API Gateway running. An example value would be “us-east-2”.

__AWS_ACCESS_KEY_ID__ Info on this and the Secret Access Key mentioned below can be found [here](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html).

__AWS_SECRET_ACCESS_KEY__ This will be your AWS Secret Access Key. You will likely need to generate a new one and can check out the instructions from the AWS team [here](https://aws.amazon.com/blogs/security/wheres-my-secret-access-key/) on how to do it.

__AWS_USAGE_PLAN_KEY_TYPE__ AWS allows for multiple usage plan key types but for our purposes we will use API_KEY as the value here.

__AWS_USAGE_PLAN_ID__ This value can be accessed by going to your Usage Plan in the AWS API Gateway console. You can navigate here by going to your API in the AWS console, clicking Usage Plans, selecting your plan, and copying the ID.

To run the project, run `node app.js`. This will bring up the backend and frontend for the project.

The backend endpoint can be reached at http://localhost:3000/register. The frontend can be accessed through http://localhost:3000.

## How to use

In the frontend, you can add in an email, first name, and last name into the fields on the screen. Then click __Register__ to generate an API key.

IF you want to use the backend directly, you will need to create a request to the http://localhost:3000/register and include a JSON request body. It will look like this:

``` javascript
{
    email: "myemail@email.com",
    firstname: "firstname",
    lastname: "lastname",
}

```

Once sent, the response brought back from the __/register__ endpoint will contain an API key.

The API key can then be used to send requests to your __API Key__ protected APIs in AWS Gateway.

## Confirming the flow

Once you have registered a user using the __/register__ endpoint, you should see:

- A new API Key created in AWS API Gateway which contains the email sent to the registration endpoint.
- A new Customer in Stripe with the name and customer metadata containing the AWS API Key ID you see in AWS API Gateway

Once you have sent a request to a protected API in AWS API Gateway, you should see the request in Moesif. The request should contain:

- The route information
- Stripe metadata (you'll need to inspect the request to see this)
- The User ID in Moesif will be the AWS API Key ID
- The Company ID in Moesif will be the Stripe Subscription_ID

Usage will be available in Stripe in a few hours. If data still isn't in Stripe after a few hours, reach out to Moesif support for help with your configuration.

## How to Contribute

For all changes and contributions we use the Github Pull request process as our workflow. Please see detailed instructions in notion on how to create branch and create pull requests.

https://www.notion.so/moesif/Github-Flow-583da5aaa9b54d118bea1dd4db17b97f

Most articles are written in markdown. Quick guide here: https://www.markdownguide.org/cheat-sheet/

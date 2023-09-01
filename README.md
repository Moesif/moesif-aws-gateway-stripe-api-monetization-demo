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

* STRIPE_KEY="<stripe_key>"
*     To find this value, in Stripe, on the Developers screen, choose API keys in the left-side menu. In the center pane, copy the value for Secret key and replace the <stripe_key> value. 
* STRIPE_PRICE_KEY="<tsripe_price_key>"
*     To find this value, in Stripe, go to the Products tab and choose the My API product you created in step A. In the center pane, under Pricing in the API ID column, copy the API ID. Replace the <stripe_key> with this value.
* MOESIF_APPLICATION_ID="<Moesif_app_id>”
*     To find this value, in Moesif at the bottom left, choose your name. The settings menu will appear. In the menu, choose API Keys. On your API Keys page under Your Collector Application Id, copy the Id and replace <Moesif_app_id> with the value.
* AWS_INVOKE_URL=”<aws_invoke_url>”
*     This is the URL of your API Gateway. Find this by going to the API Gateway console, navigating to your API, and in the left menu, choosing Stages. Select the stage that you want to integrate, and at the top of the main pane, copy the Invoke URL. An example would be “https://your-aws-api-gateway.execute-api.region.amazonaws.com”. Replace the <aws_invoke_url> with your own URL value in your code.
* AWS_REGION="<aws_region>"
*     This value will be based on the AWS Region where you have your API Gateway running. Replace the <aws_region> with the AWS region you are using. An example value would be us-east-2.
* AWS_ACCESS_KEY_ID="<aws_access_key_id>"
*     To find this and the secret access key mentioned next, follow the guide for Accessing AWS using your AWS credentials. Replace the <aws_access_key_id> with the value for your secret access key.
* AWS_SECRET_ACCESS_KEY="<aws_secret_access_key>"
*     This will be your AWS secret access key. I highly recommend you create a new key by following the instructions listed in the AWS Security blog post, Where's My Secret Access Key? For security reasons,  the newly created AWS Access Key should follow the least privileges principle. Replace the <aws_secret_access_key> with your secret access key.
* AWS_USAGE_PLAN_KEY_TYPE="API_KEY"
*     Make sure the value for this is set to the word API_KEY.
* AWS_USAGE_PLAN_ID=”<usage_plan>"
*     To find this value, in the API Gateway console left menu, select Usage Plans. Then select your plan and copy the ID at the top of the center pane. Paste that ID into the value for <usage_plan>.
![image](https://github.com/Moesif/moesif-aws-gateway-stripe-api-monetization-demo/assets/17327354/531a5a0e-e6ab-427e-8b9f-8b0ab0fdf591)


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

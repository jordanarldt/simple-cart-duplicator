# Simple BigCommerce Cart Duplicator
This is a simple NodeJS Express server that accepts a Storefront Cart ID, re-creates the cart through the Server-to-Server API, generates a Cart Redirect URL, and then redirects you to that URL.

This is a way to workaround the BigCommerce functionality where you cannot create redirect urls for carts created on the storefront.

## Setup
1. Run `npm ci` in the project directory
2. Run `cp .env-example .env` to create the .env file
3. Set your store API credentials in `.env`

## Use
1. Run `node app` in the project directory to start the server.
2. Go to your BigCommerce storefront and add any product to your cart.
3. On your BigCommerce storefront, browse to `your-store-url.com/api/storefront/carts` and copy the `"id"` value from the response
4. Either browse to `http://localhost:8080` and submit the form, or go to `http://localhost:8080/redirect?cart={your-storefront-cart-id}` - the `cart` query needs to be supplied with the storefront cart ID you copied from the previous step.

Viola! A new cart will be created with the S2S API and you'll be redirected accordingly.

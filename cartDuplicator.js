const BigCommerce = require("node-bigcommerce");

const bcApi = new BigCommerce({
  accessToken: process.env.ACCESS_TOKEN,
  clientId: process.env.CLIENT_ID,
  storeHash: process.env.STORE_HASH,
  apiVersion: "v3",
});

async function duplicateCart(storefrontCartId) {
  try {
    const { data: storefrontCartData } = await bcApi.get(`/carts/${storefrontCartId}`);

    // Cart creation "line_items" only applies to digital and physical items.
    // Consolidate physical and digital items into one single array
    const lineItems = (function() {
      const physicalItems = storefrontCartData.line_items.physical_items.map(item => {
        const { product_id, variant_id, parent_id, quantity } = item;
        return { product_id, variant_id, parent_id, quantity };
      });

      const digitalItems = storefrontCartData.line_items.digital_items.map(item => {
        const { product_id, variant_id, parent_id, quantity } = item;
        return { product_id, variant_id, parent_id, quantity };
      });

      return { line_items: [...physicalItems, ...digitalItems] };
    }());

    const giftCertificates = {
      gift_certificates: storefrontCartData.line_items.gift_certificates.map(item => {
        const { name, theme, amount, quantity, sender, recipient, message } = item;
        return { name, theme, amount, quantity, sender, recipient, message };
      }),
    };

    const customItems = {
      custom_items: storefrontCartData.line_items.custom_items.map(item => {
        const { name, sku, quantity, list_price } = item;
        return { name, sku, quantity, list_price };
      }),
    };

    // Above, the data is split into several objects because when making a POST, the gift certs
    // and custom_items are contained in their own object, outside of the "line_items"

    // Create the request body for the POST request
    const newCartPayload = {
      customer_id: 0,
      channel_id: 1,
      email: "",
      ...lineItems,
      ...giftCertificates,
      ...customItems,
    };

    // Send the POST request to create the new cart
    const { data: newCartData } = await bcApi.post("/carts?include=redirect_urls", newCartPayload);
    console.log("New Cart ID:", newCartData.id);
    console.log("New Cart Redirect URL:", newCartData.redirect_urls.cart_url);

    return newCartData.redirect_urls.cart_url;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  duplicateCart,
};

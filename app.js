require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/redirect", async (req, res) => {
  const { duplicateCart } = require("./cartDuplicator");

  try {
    const redirectUrl = await duplicateCart(req.query.cart);
    setTimeout(() => {
      res.redirect(redirectUrl);
    }, Number(req.query.delay));
  } catch (e) {
    console.log("Error occurred:", e);
    res.status(500).send("Server Error: Failed to duplicate cart.");
  }
});

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log("Server started on port " + listener.address().port);
});

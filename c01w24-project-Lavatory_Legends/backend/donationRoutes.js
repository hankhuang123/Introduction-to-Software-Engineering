import express from "express";
import Stripe from "stripe";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import { addSponsor, updateSponsor, check_is_sponsor } from "./sponsorRoutes.js"; 

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);
const router = express.Router();

router.get("/config", (req, res) => {
    res.status(200).json({publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,});

});

// router.post("/create-donate-intent", async (req, res) => {
//   try {
//     const donateIntent = await stripe.paymentIntents.create({
//       currency: "CAD",
//       amount: 2000,
//       automatic_payment_methods: { enabled: true },
//     });

//     // Send publishable key and DonateIntent details to client
//     res.json({ clientSecret: donateIntent.client_secret });
//   } catch (e) {
//     return res.status(400).send({
//       error: {
//         message: e.message,
//       },
//     });
//   }
// });

// POST endpoint to create a payment intent for donation
router.post("/createDonation", express.json(), async (req, res) => {
  const { amount } = req.body; // Expect amount to be in cents and passed in the request body

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ errorMessage: "Invalid donation amount." });
  }

  try {
    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "CAD",
      description: "Donation",
      // Additional Stripe parameters as needed
    });

    return res.json({ clientSecret: paymentIntent.client_secret, paymentIntent });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).send({ errorMessage: error.message });
  }
});

router.post("/confirmDonation",express.json(), async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId, amount } = req.body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount." });
    }
    if(!paymentIntentId && !paymentMethodId){
      return res.status(404).json({error: "requires both paymentIntendId and paymentMethodId"});
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret-key", async (err, decoded) => {
    if(err){
      return res.status(401).send("Unauthorized.");
    }
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      { 
        payment_method: paymentMethodId,
        return_url: "https://google.com"
      }
    );
    if(paymentIntent.status !== "succeeded"){
      return res.status(400).json({error: "Payment failed"});
    }
    //add a sponsor
    const name = decoded.username;
    const isSponsor = await check_is_sponsor(name);
    if(isSponsor){
        return updateSponsor(name,amount,res);
    }
    else{
        return addSponsor(name,amount,res);
    }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
}
});

export default router;
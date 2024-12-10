import React from "react";
import { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useStripe, useElements, PaymentElement, CardElement } from "@stripe/react-stripe-js";
import { LOCALHOST } from "../../Constants";

const DonateForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const [donationAmount, setDonationAmount] = useState(0);

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const userToken = localStorage.getItem("userToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
      return;
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      // Here you would call your backend to create the payment intent
      // and finalize the payment process
    }

    try {
      const amount = Math.round(donationAmount * 100);
      const response = await fetch(`${LOCALHOST}/donate/createDonation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        console.error("Error:", response);
        return;
      }

      const { clientSecret, paymentIntent } = await response.json();
      
      const result = await fetch(`${LOCALHOST}/donate/confirmDonation`, {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ userToken }`
          },
          body: JSON.stringify(
            {
              paymentIntentId: paymentIntent.id,
              paymentMethodId: paymentMethod.id,
              amount
            }),
      });
      const resultRes = await result.json();
      if (result.status !== 200) {
        console.error("Payment failed:", resultRes.error);
      } else {
        console.log("Payment successful!");
          // Redirect the user to completion page
          history.push('/completion');
      }
    } catch (error) {
      console.error("Error:", error);
    }

    
    // Additional handling (e.g., displaying a success message) goes here
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number"
        placeholder="Enter donation amount in CAD"
        value={donationAmount} 
        onChange={e => setDonationAmount(e.target.value)} />
      <CardElement/>
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Donate"}
        </span>
      </button>
    </form>
  );
}

export default DonateForm;
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import DonateForm from "./DonateForm";
import { LOCALHOST } from "../../Constants";
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';

const DonationPage = () => {
  const [stripePromise, setStripePromise] = useState(null);
  // const [clientSecret, setClientSecret] = useState("");
  // const [donationAmount, setDonationAmount] = useState(0);

  useEffect(() => {
    fetch(`${LOCALHOST}/donate/config`).then(async (res) => {
      const response = await res.json();
      // console.log(res.status);
      console.log(response);
      setStripePromise(loadStripe(response.publishableKey));
    });
  }, []);

  return (
    <div className="App">
      <div className="signup-form" style={{ maxWidth: "430px" }}>
      <BackButton />
        <h2>Donate For Us</h2>
        { stripePromise && (
          <Elements stripe={stripePromise}>
            <DonateForm />
          </Elements>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default DonationPage;

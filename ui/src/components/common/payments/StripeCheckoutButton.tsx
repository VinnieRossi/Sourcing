import { useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants";
import axios from "axios";
import { Button } from "@material-ui/core";

const StripeCheckoutButton = (): JSX.Element => {
  const stripe = useStripe();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    axios
      .post(`${API_BASE_URL}/create-checkout-session`)
      .then((result) => {
        // console.log("", result);
        setSessionId(result.data.id);
      })
      .catch((error) => {
        console.log("", error);
      });
  }, []);

  const handleClick = async (event) => {
    const result = await stripe!.redirectToCheckout({
      sessionId: sessionId,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      console.log(result.error.message);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Checkout
    </Button>
  );
};

export default StripeCheckoutButton;

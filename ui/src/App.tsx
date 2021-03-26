import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Auth0ProviderWithHistory from "./auth/Auth0ProviderWithHistory";
import AuthProtectedRoute from "./auth/AuthProtectedRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import About from "./components/About";
import { STRIPE_PK } from "./components/common/constants";
import Landing from "./components/common/landing/Landing";

const stripePromise = loadStripe(STRIPE_PK as string);

// axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const App = (): JSX.Element => {
  return (
    <>
      <Router>
        {/* <Auth0ProviderWithHistory> */}
        <Elements stripe={stripePromise}>
          <main>
            <Switch>
              <ProtectedRoute path="/test" exact component={About} />
              {/* <AuthProtectedRoute path="/auth" exact component={About} /> */}
              <Route path="/about" exact component={About} />
              <Route path="/" component={Landing} />
            </Switch>
          </main>
        </Elements>
        {/* </Auth0ProviderWithHistory> */}
      </Router>
    </>
  );
};

export default App;

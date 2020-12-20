import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import About from "./components/About";
import { STRIPE_PK } from "./components/common/constants";
import Landing from "./components/common/landing/Landing";

const stripePromise = loadStripe(STRIPE_PK as string);

const App = (): JSX.Element => {
  return (
    <>
      <Router>
        <Elements stripe={stripePromise}>
          <main>
            <Switch>
              <ProtectedRoute path="/test" component={About} />
              <Route path="/about" exact component={About} />
              <Route path="/" component={Landing} />
            </Switch>
          </main>
        </Elements>
      </Router>
    </>
  );
};

export default App;

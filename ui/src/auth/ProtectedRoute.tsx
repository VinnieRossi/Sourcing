import React from "react";
import { Route, RouteProps } from "react-router-dom";
import { withAuthentication } from "react-aad-msal";
import { authProvider } from "./AuthProvider";

const ProtectedRoute = ({ path, component }: RouteProps): JSX.Element => {
  return <Route path={path} exact component={component} />;
};

// Force login is defaulting to true here
export default withAuthentication(ProtectedRoute, {
  provider: authProvider,
});

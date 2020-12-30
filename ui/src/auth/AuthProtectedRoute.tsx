import React from "react";
import { Route, RouteProps } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

const AuthProtectedRoute = ({ path, component }: RouteProps): JSX.Element => {
  return <Route path={path} exact component={component} />;
};

export default withAuthenticationRequired(AuthProtectedRoute, {
  onRedirecting: () => <h1>LOADING</h1>,
});

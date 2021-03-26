import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AzureAD, {
  AuthenticationState,
  IAzureADFunctionProps,
} from "react-aad-msal";
import {
  authProvider,
  resetPasswordAuthority,
  signInAuthority,
} from "../../../auth/AuthProvider";
import { User } from "../api/apiModels";
import { API_BASE_URL } from "../constants";
import StripeCheckoutButton from "../payments/StripeCheckoutButton";
import { landingStyles } from "./LandingStyles";

const Landing = (): JSX.Element => {
  // TODO: Create custom hook to handle error, loading, data
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // const {
  //   loginWithRedirect,
  //   logout,
  //   user,
  //   isAuthenticated,
  //   isLoading,
  //   getAccessTokenSilently,
  // } = useAuth0();
  const styles = landingStyles();

  useEffect(() => {
    const retrieveUsers = async () => {
      // const token = await getAccessTokenSilently();
      axios
        .get<User[]>(`${API_BASE_URL}/users`, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        })
        .then((result) => {
          setIsLoaded(true);
          setUsers(result.data);
        })
        .catch((error) => {
          setIsLoaded(true);
          setError(error);
        });
    };
    retrieveUsers();
  }, []);

  return (
    <div className={styles.root}>
      <Typography variant="h1" className={styles.title}>
        Landing Page
      </Typography>
      <Link href="/about">About</Link>
      {error && <span>error: {error}</span>}
      {isLoaded && users && (
        <List>
          {users.map((user: any) => (
            <ListItem key={user.id}>
              <ListItemText>User Id: {user.id}</ListItemText>
            </ListItem>
          ))}
        </List>
      )}

      {/* Goal today: Login page via Auth0: https://auth0.com/docs/universal-login/universal-login-page-customization */}
      {/* Additional goal: Forcing redirect on protected URLs to login page if not logged in */}
      {/* Additional goal: Hiding/showing depending on login status */}
      {/* TODO: Set global axios config so all requests have token */}

      {/* <button
        onClick={() => {
          loginWithRedirect();
        }}
      >
        Log in
      </button>

      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>

      {isLoading && <div>loading...</div>}

      {isAuthenticated && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )} */}

      {true && (
        <AzureAD provider={authProvider}>
          {({
            login,
            logout,
            authenticationState,
            accountInfo,
            error,
          }: IAzureADFunctionProps) => {
            const isInProgress =
              authenticationState === AuthenticationState.InProgress;
            const isAuthenticated =
              authenticationState === AuthenticationState.Authenticated;
            const isUnauthenticated =
              authenticationState === AuthenticationState.Unauthenticated;

            if (error) {
              // console.error('', error);
              authProvider.authority = signInAuthority;

              if (error.errorMessage.indexOf("AADB2C90118") > -1) {
                // Need to update authority to use the reset password flow
                authProvider.authority = resetPasswordAuthority;
                login();
              }
            }

            if (isAuthenticated) {
              return (
                <React.Fragment>
                  <p>You're logged in as "{accountInfo?.account.name}"</p>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </React.Fragment>
              );
            } else if (isUnauthenticated || isInProgress) {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={login}
                  disabled={isInProgress}
                >
                  Login
                </Button>
              );
            }
          }}
        </AzureAD>
      )}

      {false && <StripeCheckoutButton />}
    </div>
  );
};

export default Landing;

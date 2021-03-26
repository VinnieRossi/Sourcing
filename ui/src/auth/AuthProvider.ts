import { MsalAuthProvider, LoginType } from "react-aad-msal";
import { LogLevel, Logger } from "msal";

const logger = new Logger(
  (logLevel, message, containsPii) => {
    console.log("[MSAL]", message);
  },
  {
    level: LogLevel.Verbose,
    piiLoggingEnabled: false,
  }
);

const tenant = "betterfrosting.onmicrosoft.com";
const signInPolicy = "B2C_1_sourcing_signup";
const clientId = "6d7e71b1-698f-4d6e-89c5-c4d1206cc845";
const tenantSubdomain = tenant.split(".")[0];
const instance = `https://${tenantSubdomain}.b2clogin.com/tfp/`;

export const signInAuthority = `${instance}${tenant}/${signInPolicy}`;
export const resetPasswordAuthority = `${instance}${tenant}/${"B2C_1_sourcing_reset"}`;

// The auth provider should be a singleton. Best practice is to only have it ever instantiated once.
// Avoid creating an instance inside the component it will be recreated on each render.
// If two providers are created on the same page it will cause authentication errors.
export const authProvider = new MsalAuthProvider(
  {
    auth: {
      authority: signInAuthority, //"https://login.microsoftonline.com/common",
      clientId: clientId,
      postLogoutRedirectUri: window.location.origin,
      redirectUri: window.location.origin,
      // Needs to be false for custom authority
      validateAuthority: false,

      // After being redirected to the "redirectUri" page, should user
      // be redirected back to the Url where their login originated from?
      navigateToLoginRequestUrl: false,
    },
    // Enable logging of MSAL events for easier troubleshooting.
    // This should be disabled in production builds.
    system: {
      logger: logger as any,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  },
  {
    scopes: ["openid"],
  },
  {
    // loginType: LoginType.Popup,
    loginType: LoginType.Redirect,
    // When a token is refreshed it will be done by loading a page in an iframe.
    // Rather than reloading the same page, we can point to an empty html file which will prevent
    // site resources from being loaded twice.
    tokenRefreshUri: window.location.origin + "/auth.html",
  }
);

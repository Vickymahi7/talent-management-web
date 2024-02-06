import { LogLevel, PublicClientApplication } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: "87949e6c-5588-40fa-b848-e2effb48eb36",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "/", // Must be registered as a SPA redirectURI on your app registration
    postLogoutRedirectUri: "/", // Must be registered as a SPA redirectURI on your app registration
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false, 
  },
  // system: {
  //   loggerOptions: {
  //     loggerCallback: (
  //       level: LogLevel,
  //       message: string,
  //       containsPii: boolean
  //     ) => {
  //       if (containsPii) {
  //         return;
  //       }
  //       switch (level) {
  //         case LogLevel.Error:
  //           console.error(message);
  //           return;
  //         case LogLevel.Info:
  //           console.info(message);
  //           return;
  //         case LogLevel.Verbose:
  //           console.debug(message);
  //           return;
  //         case LogLevel.Warning:
  //           console.warn(message);
  //           return;
  //         default:
  //           return;
  //       }
  //     },
  //     logLevel: LogLevel.Verbose,
  //   },
  // },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphGetUsersEndpoint: "https://graph.microsoft.com/v1.0/users",
};

function extractSkipTokenFromUrl(url) {
  const urlObject = new URL(url);
  const skipToken = urlObject.searchParams.get("$skiptoken");
  return skipToken;
}

export async function callMsGraph(
  accessToken: string,
  skipToken?: string,
  searchText?: string
) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("ConsistencyLevel", 'eventual');

  const options = {
    method: "GET",
    headers: headers,
  };

  skipToken = skipToken
    ? `&$skiptoken=${extractSkipTokenFromUrl(skipToken)}`
    : "";
  const filter = searchText ? `&$filter=startswith(displayName,'${searchText}')` : "";
  // $orderby=displayName not working in some cases
  return fetch(
    `${graphConfig.graphGetUsersEndpoint}?$top=20&${filter}&$select=displayName,mail${skipToken}`,
    options
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

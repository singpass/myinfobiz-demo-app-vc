import { APP_CONFIG, ENVIRONMENT } from "@/config/app";

export const MYINFO_CONNECTOR_CONFIG = {
  CLIENT_ID: APP_CONFIG.DEMO_APP_CLIENT_ID,
  CLIENT_PRIVATE_SIGNING_KEY: "./cert/your-sample-app-signing-private-key.pem",
  CLIENT_PRIVATE_ENCRYPTION_KEY:
    "./cert/your-sample-app-encryption-private-key.pem",

  REDIRECT_URL: APP_CONFIG.DEMO_APP_CALLBACK_URL,
  AUTHORIZE_JWKS_URL: `https://${ENVIRONMENT.toLowerCase()}authorise.singpass.gov.sg/.well-known/keys.json`,
  MYINFO_JWKS_URL: `https://${ENVIRONMENT.toLowerCase()}authorise.singpass.gov.sg/.well-known/keys.json`,
  TOKEN_URL: `https://${ENVIRONMENT.toLowerCase()}api.myinfo.gov.sg/biz/v3/token`,
  CODE_CHALLENGE_URL: `https://${ENVIRONMENT.toLowerCase()}api.myinfo.gov.sg/biz/v3/codechallenge/request/`,
  GET_CREDENTIAL_URL: `https://${ENVIRONMENT.toLowerCase()}api.myinfo.gov.sg/biz/v3/credentials/request/`,
  SCOPE: APP_CONFIG.DEMO_APP_SCOPES,
  ENVIRONMENT: ENVIRONMENT.toUpperCase(),
  USE_PROXY: "N",
  PROXY_TOKEN_URL: "",
  PROXY_PERSON_URL: "",
  DEBUG_LEVEL: "debug",
  REALM: "biz",
};

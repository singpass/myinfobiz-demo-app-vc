import { APP_CONFIG, ENVIRONMENT } from "@/config/app";

export type MyInfoConnectorConfig = {
  CLIENT_ID: string;
  CLIENT_PRIVATE_SIGNING_KEY: string;
  CLIENT_PRIVATE_ENCRYPTION_KEY: string;
  REDIRECT_URL: string;
  AUTHORIZE_JWKS_URL: string;
  MYINFO_JWKS_URL: string;
  TOKEN_URL: string;
  CODE_CHALLENGE_URL: string;
  GET_CREDENTIAL_URL: string;
  SCOPE: string;
  ENVIRONMENT: string;
  USE_PROXY: string;
  PROXY_TOKEN_URL: string;
  PROXY_PERSON_URL: string;
  DEBUG_LEVEL: string;
  REALM: string;
  VC_ETHEREUM_PRIVATE_KEY: string;
  VC_ETHEREUM_WALLET_ADDRESS: string;
};

export const MYINFO_CONNECTOR_CONFIG: MyInfoConnectorConfig = {
  CLIENT_ID: APP_CONFIG.DEMO_APP_CLIENT_ID,
  CLIENT_PRIVATE_SIGNING_KEY: process.env.CLIENT_PRIVATE_SIGNING_KEY,
  CLIENT_PRIVATE_ENCRYPTION_KEY: process.env.CLIENT_PRIVATE_ENCRYPTION_KEY,
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
  VC_ETHEREUM_PRIVATE_KEY: process.env.VC_ETHEREUM_PRIVATE_KEY,
  VC_ETHEREUM_WALLET_ADDRESS: process.env.VC_ETHEREUM_WALLET_ADDRESS,
};

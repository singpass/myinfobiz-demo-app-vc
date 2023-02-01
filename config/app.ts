export const ENVIRONMENT = "test.";

export const APP_CONFIG = {
  DEMO_APP_CLIENT_ID: "STG2-MYINFO-SELF-TEST", //need to update to demo app for roll out
  DEMO_APP_CALLBACK_URL: "http://localhost:3001/callback",
  DEMO_APP_PURPOSE_ID: "demonstration",
  MYINFO_API_AUTHORIZE: `https://${ENVIRONMENT.toLowerCase()}api.myinfo.gov.sg/biz/v3/authorize`,
  DEMO_APP_SCOPES: "corporatebasiccredential",
  DEMO_APP_CODE_CHALLENGE_METHOD: "S256",
};

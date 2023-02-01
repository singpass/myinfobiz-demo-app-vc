const fs = require("fs");
const querystring = require("querystring");
const constant = require("@/lib/common/constant");
const requestHandler = require("@/lib/requestHandler.js");
var CONFIG = require("@/lib//common/config");
const log4js = require("log4js");
const logger = log4js.getLogger("MyInfoNodeJSConnector");
import MyInfoVcVerifier from "@/lib/myinfo-vc-verifier";

// ####################
// Exporting the Module
// ####################

/**
 * MyInfoConnector Constructor
 *
 * This is a constructor to validate and initialize all the config variables
 *
 * @param {{
 * CLIENT_PRIVATE_KEY : string,
 * CLIENT_ID : string,
 * REDIRECT_URL : string,
 * SCOPE : string,
 * AUTHORIZE_JWKS_URL : string,
 * MYINFO_JWKS_URL : string,
 * TOKEN_URL : string,
 * PERSON_URL : string,
 * USE_PROXY : string,
 * PROXY_TOKEN_URL : string,
 * PROXY_PERSON_URL : string
 * }}
 */
export default class MyInfoConnector {
  isInitialized = false;
  // take in another param to toggle between security helpers and load
  constructor(config) {
    try {
      this.load(config);
      this.isInitialized = true;
      this.securityHelper = require("../securityHelper");
    } catch (error) {
      logger.error("Error (Library Init): ", error);
      this.isInitialized = false;
      throw error;
    }
  }

  load = function (config) {
    CONFIG = config;
    if (!config.CLIENT_PRIVATE_SIGNING_KEY) {
      throw new Error(
        constant.ERROR_CONFIGURATION_CLIENT_PRIVATE_SIGNING_KEY_NOT_FOUND
      );
    } else {
      CONFIG.CLIENT_PRIVATE_SIGNING_KEY = fs.readFileSync(
        config.CLIENT_PRIVATE_SIGNING_KEY,
        "utf8"
      );
    }
    if (!config.CLIENT_PRIVATE_ENCRYPTION_KEY) {
      throw new Error(
        constant.ERROR_CONFIGURATION_CLIENT_PRIVATE_ENCRYPTION_KEY_NOT_FOUND
      );
    } else {
      CONFIG.CLIENT_PRIVATE_ENCRYPTION_KEY = fs.readFileSync(
        config.CLIENT_PRIVATE_ENCRYPTION_KEY,
        "utf8"
      );
    }
    logger.level = CONFIG.DEBUG_LEVEL;
  };

  /**
   * This method generates the code verifier and code challenge for the PKCE flow.
   *
   * @returns {Object} - Returns an object consisting of the code verifier and the code challenge
   */
  generatePKCECodePair = function () {
    try {
      // let codeVerifier = crypto.randomBytes(32).toString('hex');
      let codeVerifier = "_uyOSvwLL7HOXbpQ9jRz1dDL6lmSAQUN55m58imTNMY";
      let codeChallenge = this.securityHelper.base64URLEncode(
        this.securityHelper.sha256(codeVerifier)
      );
      return {
        codeVerifier: codeVerifier,
        codeChallenge: codeChallenge,
      };
    } catch (error) {
      logger.error("generateCodeChallenge - Error: ", error);
      throw error;
    }
  };

  /**
   * Get MyInfo Person Data (MyInfo Token + Person API)
   *
   * This method takes in all the required variables, invoke the following APIs.
   * - Get Access Token (Token API) - to get Access Token by using the Auth Code
   * - Get Person Data (Person API) - to get Person Data by using the Access Token
   *
   * @param {string} authCode - Authorization Code from Authorize API
   * @returns {Promise} - Returns the Person Data (Payload decrypted + Signature validated)
   */
  getMyInfoPersonData = async function (authCode, codeVerifier) {
    if (!this.isInitialized) {
      throw constant.ERROR_UNKNOWN_NOT_INIT;
    }

    try {
      let sessionPopKeyPair =
        await this.securityHelper.generateSessionKeyPair();

      let createTokenResult = await this.getAccessToken(
        authCode,
        codeVerifier,
        sessionPopKeyPair
      );

      let accessToken = createTokenResult.access_token;
      let personData = await this.getPersonData(accessToken, sessionPopKeyPair);
      return personData;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Get Access Token from MyInfo Token API
   *
   * This method calls the Token API and obtain an "access token",
   * which can be used to call the Person API for the actual data.
   * Your application needs to provide a valid "authorisation code"
   * from the authorize API in exchange for the "access token".
   *
   * @param {string} authCode - Authorization Code from authorize API
   * @returns {Promise} - Returns the Access Token
   */
  getAccessToken = async function (authCode, codeVerifier, sessionPopKeyPair) {
    if (!this.isInitialized) {
      throw constant.ERROR_UNKNOWN_NOT_INIT;
    }

    try {
      let privateSigningKey = CONFIG.CLIENT_PRIVATE_SIGNING_KEY;

      let tokenResult = await this.callTokenAPI(
        authCode,
        privateSigningKey,
        codeVerifier,
        sessionPopKeyPair
      );
      let token = tokenResult;
      logger.debug("Access Token: ", token);

      return token;
    } catch (error) {
      logger.error("getAccessToken - Error: ", error);
      throw error;
    }
  };

  /**
   * Get Person Data from MyInfo Person API
   *
   * This method calls the Person API and returns a JSON response with the
   * personal data that was requested. Your application needs to provide a
   * valid "access token" in exchange for the JSON data. Once your application
   * receives this JSON data, you can use this data to populate the online
   * form on your application.
   *
   * @param {string} accessToken - Access token from Token API
   * @returns {Promise} Returns the Person Data (Payload decrypted + Signature validated)
   */
  getPersonData = async function (accessToken, sessionPopKeyPair) {
    if (!this.isInitialized) {
      throw constant.ERROR_UNKNOWN_NOT_INIT;
    }

    try {
      let callPersonRequestResult = await this.getPersonDataWithToken(
        accessToken,
        sessionPopKeyPair
      );

      return callPersonRequestResult;
    } catch (error) {
      logger.error("getPersonData - Error: ", error);
      throw error;
    }
  };

  /**
   * Call (Access) Token API
   *
   * This method will generate the Token request
   * and call the Token API to retrieve access Token
   *
   * @param {string} authCode - Authorization Code from authorize API
   * @param {File} privateKey - The Client Private Key in PEM format
   * @returns {Promise} - Returns the Access Token
   */
  callTokenAPI = async function (
    authCode,
    privateSigningKey,
    codeVerifier,
    sessionPopKeyPair
  ) {
    let cacheCtl = "no-cache";
    let contentType = "application/x-www-form-urlencoded";
    let method = constant.HTTP_METHOD.POST;
    let clientAssertionType =
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
    let jktThumbprint = await this.securityHelper.generateJwkThumbprint(
      sessionPopKeyPair.publicKey
    );
    let strParams;
    // assemble params for Token API
    strParams =
      `grant_type=authorization_code` +
      "&code=" +
      authCode +
      "&redirect_uri=" +
      CONFIG.REDIRECT_URL +
      "&client_id=" +
      CONFIG.CLIENT_ID +
      "&code_verifier=" +
      codeVerifier +
      "&client_assertion_type=" +
      clientAssertionType +
      "&client_assertion=" +
      (await this.securityHelper.generateClientAssertion(
        CONFIG.TOKEN_URL,
        CONFIG.CLIENT_ID,
        privateSigningKey,
        jktThumbprint
      ));

    let params = querystring.parse(strParams);
    let dPoP = await this.securityHelper.generateDpop(
      CONFIG.TOKEN_URL,
      null,
      null,
      constant.HTTP_METHOD.POST,
      sessionPopKeyPair
    );

    // assemble headers for Token API
    let strHeaders = `Content-Type=${contentType}&Cache-Control=${cacheCtl}&DPoP=${dPoP}`;
    let headers = querystring.parse(strHeaders);

    // invoke Token API
    let tokenURL =
      CONFIG.USE_PROXY && CONFIG.USE_PROXY == "Y"
        ? CONFIG.PROXY_TOKEN_URL
        : CONFIG.TOKEN_URL;
    let accessToken = await requestHandler.getHttpsResponse(
      method,
      tokenURL,
      headers,
      strParams,
      null
    );

    return accessToken.data;
  };

  callCorporateVcAPI = async function (sub, accessToken, sessionPopKeyPair) {
    // Call get Corporate VC Code Challenge
    let ethereumWalletAddress = CONFIG.VC_ETHEREUM_WALLET_ADDRESS;
    let privateKey = CONFIG.VC_ETHEREUM_PRIVATE_KEY;
    // let stubbedCodeChallenge = "testing123";
    // let stubbedSignedCodeChallenge =
    //   "b780d685dad7be3436b9e11445dd1daadbc33038ba522cb401d2b09ea69ab2b4783f3db267b11ab13daeae8e173ed88e9ec864bde679882efab5a3db69325b671b";

    let codeChallengeResult = await this.callCorporateVcCodeChallengeAPI(
      ethereumWalletAddress,
      accessToken,
      sessionPopKeyPair
    );

    let codeChallenge = codeChallengeResult.codeChallenge;
    let signedCodeChallenge = MyInfoVcVerifier.ethereumSign(
      privateKey,
      codeChallenge
    );

    let urlLink = CONFIG.GET_CREDENTIAL_URL;
    let cacheCtl = "no-cache";
    let method = constant.HTTP_METHOD.POST;

    // assemble headers for Person API
    let strHeaders = "Cache-Control=" + cacheCtl;
    let headers = querystring.parse(strHeaders);

    let decodedToken = await this.securityHelper.verifyJWS(
      accessToken,
      CONFIG.AUTHORIZE_JWKS_URL
    );
    let ath = this.securityHelper.base64URLEncode(
      this.securityHelper.sha256(accessToken)
    );
    let dpopToken = await this.securityHelper.generateDpop(
      urlLink,
      decodedToken.cnf.nonce,
      ath,
      method,
      sessionPopKeyPair
    );
    headers["dpop"] = dpopToken;

    headers["Authorization"] = "Dpop " + accessToken;
    headers["Content-Type"] = "application/json";

    logger.info(
      "Authorization Header for Corporate VC Get Credential API: ",
      JSON.stringify(headers)
    );

    //invoking https to do GET call
    let body = {
      sub: sub,
      scope: CONFIG.SCOPE,
      ethereumWalletAddress: ethereumWalletAddress,
      codeChallenge: codeChallenge,
      signedCodeChallenge: signedCodeChallenge,
    };
    body = JSON.stringify(body);

    logger.info(
      "Body for Corporate VC Get Credential API:",
      JSON.stringify(body)
    );

    let credentialData = await requestHandler.getHttpsResponse(
      method,
      urlLink,
      headers,
      body,
      null
    );

    return credentialData.data;
  };

  callCorporateVcCodeChallengeAPI = async function (
    ethereumWalletAddress,
    accessToken,
    sessionPopKeyPair
  ) {
    let urlLink = CONFIG.CODE_CHALLENGE_URL;
    let cacheCtl = "no-cache";
    let method = constant.HTTP_METHOD.POST;

    // assemble headers for Person API
    let strHeaders = "Cache-Control=" + cacheCtl;
    let headers = querystring.parse(strHeaders);

    let decodedToken = await this.securityHelper.verifyJWS(
      accessToken,
      CONFIG.AUTHORIZE_JWKS_URL
    );
    let ath = this.securityHelper.base64URLEncode(
      this.securityHelper.sha256(accessToken)
    );
    let dpopToken = await this.securityHelper.generateDpop(
      urlLink,
      decodedToken.cnf.nonce,
      ath,
      method,
      sessionPopKeyPair
    );
    headers["dpop"] = dpopToken;

    headers["Authorization"] = "Dpop " + accessToken;
    headers["Content-Type"] = "application/json";

    logger.info(
      "Authorization Header for Corporate VC Code Challenge API: ",
      JSON.stringify(headers)
    );

    let body = {
      ethereumWalletAddress: ethereumWalletAddress,
      scope: CONFIG.SCOPE,
    };

    body = JSON.stringify(body);

    let result = await requestHandler.getHttpsResponse(
      method,
      urlLink,
      headers,
      body,
      null
    );
    let codeChallengeResult = result.data;
    logger.debug(
      "Corporate VC Code Challenge API Response (JWS): ",
      codeChallengeResult
    );

    let decodedData = await this.securityHelper.verifyJWS(
      codeChallengeResult,
      CONFIG.MYINFO_JWKS_URL
    );
    // successful. return data back to frontend
    logger.debug(
      "Corporate VC Code Challenge Data (JWS Verified): ",
      JSON.stringify(decodedData)
    );

    return decodedData;
  };

  /**
   * Get Person Data
   *
   * This method will take in the accessToken from Token API and decode it
   * to get the sub(eg either uinfin or uuid). It will call the Person API using the token and sub.
   * It will verify the Person API data's signature and decrypt the result.
   *
   * @param {string} accessToken - The token that has been verified from Token API
   * @returns {Promise} Returns decrypted result from calling Person API
   */
  getPersonDataWithToken = async function (accessToken, sessionPopKeyPair) {
    try {
      let decodedToken = await this.securityHelper.verifyJWS(
        accessToken,
        CONFIG.AUTHORIZE_JWKS_URL
      );
      logger.debug(
        "Decoded Access Token (from MyInfo Token API): ",
        decodedToken
      );
      if (!decodedToken) {
        logger.error("Error: ", constant.ERROR_INVALID_TOKEN);
        throw constant.ERROR_INVALID_TOKEN;
      }

      let sub = decodedToken.sub;
      if (!sub) {
        logger.error("Error: ", constant.ERROR_UINFIN_NOT_FOUND);
        throw constant.ERROR_UINFIN_NOT_FOUND;
      }
      let personResult;
      personResult = await this.callCorporateVcAPI(
        sub,
        accessToken,
        sessionPopKeyPair
      );

      let decryptedResponse;
      if (personResult) {
        logger.debug("MyInfo PersonAPI Response (JWE+JWS): ", personResult);
        let jws = await this.securityHelper.decryptJWEWithKey(
          personResult,
          CONFIG.CLIENT_PRIVATE_ENCRYPTION_KEY
        );
        logger.debug("Decrypted JWE: ", jws);
        decryptedResponse = jws;
      } else {
        logger.error("Error: ", constant.ERROR);
        throw constant.ERROR;
      }

      let decodedData;

      if (!decryptedResponse) {
        logger.error("Error: ", constant.ERROR_INVALID_DATA_OR_SIGNATURE);
        throw constant.ERROR_INVALID_DATA_OR_SIGNATURE;
      }

      decodedData = await this.securityHelper.verifyJWS(
        decryptedResponse,
        CONFIG.MYINFO_JWKS_URL
      );
      // successful. return data back to frontend
      logger.debug(
        "Person Data (JWE Decrypted + JWS Verified): ",
        JSON.stringify(decodedData)
      );

      return decodedData;
    } catch (error) {
      throw error;
    }
  };
}

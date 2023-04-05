// Nextjs API Snippet
import type { NextApiRequest, NextApiResponse } from "next";

import { default as constant } from "@/lib/common/constant";
import {
  decryptJWEWithKey,
  verifyJWS,
  generateDpop,
  base64URLEncode,
  sha256,
} from "@/lib/securityHelper";
import { MYINFO_CONNECTOR_CONFIG } from "@/config/myinfo";
import { getHttpsResponse } from "@/lib/requestHandler";
import { MyInfoConnector } from "@/lib/myinfo-connector";

export type VerifiableCredentialsResponse = {
  credentialData?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifiableCredentialsResponse>
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method Not Allowed",
    });
    return;
  }
  const accessToken = req.body.accessToken;
  const sessionPopKeyPair = req.body.sessionPopKeyPair;
  const codeChallenge = req.body.codeChallenge;
  const signedCodeChallenge = req.body.signedCodeChallenge;

  const decodedToken = await verifyJWS(
    accessToken,
    MYINFO_CONNECTOR_CONFIG.AUTHORIZE_JWKS_URL
  );
  const sub = decodedToken.sub;

  const urlLink = MYINFO_CONNECTOR_CONFIG.GET_CREDENTIAL_URL;
  const method = constant.HTTP_METHOD.POST;

  // assemble headers for Person API
  const ath = base64URLEncode(sha256(accessToken));
  const dpopToken = await generateDpop(
    urlLink,
    decodedToken.cnf.nonce,
    ath,
    method,
    sessionPopKeyPair
  );

  const headers = {
    "Cache-Control": "no-cache",
    dpop: dpopToken,
    Authorization: "Dpop " + accessToken,
    "Content-Type": "application/json",
  };
  const headersObj = JSON.parse(JSON.stringify(headers));

  //invoking https to do GET call
  const body = {
    sub: sub,
    scope: MYINFO_CONNECTOR_CONFIG.SCOPE,
    did: MYINFO_CONNECTOR_CONFIG.VC_WALLET_ADDRESS,
    codeChallenge: codeChallenge,
    signedCodeChallenge: signedCodeChallenge,
  };
  const bodyStr = JSON.parse(JSON.stringify(body));

  const credentialRes = await getHttpsResponse(
    method,
    urlLink,
    headersObj,
    bodyStr
  );
  console.log("credentialRes", credentialRes);
  if (!credentialRes.data) {
    res.status(500).json({ error: constant.ERROR_PERSON_DATA_NOT_FOUND });
  }
  let decryptedResponse = await decryptJWEWithKey(
    credentialRes.data,
    MyInfoConnector.CLIENT_PRIVATE_ENCRYPTION_KEY
  );
  console.log("decryptedResponse", decryptedResponse);

  if (!decryptedResponse) {
    res.status(500).json({ error: constant.ERROR_INVALID_DATA_OR_SIGNATURE });
  }
  const credentialData = await verifyJWS(
    decryptedResponse,
    MYINFO_CONNECTOR_CONFIG.MYINFO_JWKS_URL
  );
  console.log("credentialData", credentialData);
  // successful. return data back to frontend
  res.status(200).json({ credentialData: credentialData });
}

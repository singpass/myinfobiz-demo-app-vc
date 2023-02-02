// Nextjs API Snippet
import type { NextApiRequest, NextApiResponse } from "next";

import { default as constant } from "@/lib/common/constant";
import {
  verifyJWS,
  generateDpop,
  base64URLEncode,
  sha256,
} from "@/lib/securityHelper";
import { MYINFO_CONNECTOR_CONFIG } from "@/config/myinfo";
import { getHttpsResponse } from "@/lib/requestHandler";

type VerifiableCredentialsResponse = {
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
  const headers = new Headers();
  headers.append("Cache-Control", "no-cache");
  headers.append("dpop", dpopToken);
  headers.append("Authorization", "Dpop " + accessToken);
  headers.append("Content-Type", dpopToken);
  const headersObj = JSON.parse(JSON.stringify(headers));

  //invoking https to do GET call
  const body = {
    sub: sub,
    scope: MYINFO_CONNECTOR_CONFIG.SCOPE,
    ethereumWalletAddress: MYINFO_CONNECTOR_CONFIG.VC_ETHEREUM_WALLET_ADDRESS,
    codeChallenge: codeChallenge,
    signedCodeChallenge: signedCodeChallenge,
  };
  const bodyStr = JSON.parse(JSON.stringify(body));

  const credentialData = await getHttpsResponse(
    method,
    urlLink,
    headersObj,
    bodyStr
  );
  res.status(200).json({ credentialData: credentialData });
}

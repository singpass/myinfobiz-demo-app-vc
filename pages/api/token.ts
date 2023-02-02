// Nextjs API Snippet
import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";

import { MyInfoConnector } from "@/lib/myinfo-connector";

type TokenResponse = {
  accessToken?: string;
  sessionPopKeyPair?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenResponse>
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method Not Allowed",
    });
    return;
  }
  let createTokenResult;
  let accessToken;
  let sessionPopKeyPair;
  try {
    const codeVerifier = getCookie("codeVerifier", { req, res }) as string;
    sessionPopKeyPair =
      await MyInfoConnector.securityHelper.generateSessionKeyPair();
    createTokenResult = await MyInfoConnector.getAccessToken(
      req.body.authCode,
      codeVerifier,
      sessionPopKeyPair
    );
    accessToken = createTokenResult.access_token;
  } catch (error) {
    throw error;
  }
  res.status(200).json({
    accessToken: accessToken,
    sessionPopKeyPair: sessionPopKeyPair,
  });
}

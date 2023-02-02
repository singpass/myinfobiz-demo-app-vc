// Nextjs API Snippet
import type { NextApiRequest, NextApiResponse } from "next";

import { MYINFO_CONNECTOR_CONFIG } from "@/config/myinfo";
import { MyInfoConnector } from "@/lib/myinfo-connector";

export type CodeChallengeResponse = {
  codeChallenge?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CodeChallengeResponse>
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method Not Allowed",
    });
    return;
  }
  const ethereumWalletAddress =
    MYINFO_CONNECTOR_CONFIG.VC_ETHEREUM_WALLET_ADDRESS;
  const accessToken = req.body.accessToken;
  const sessionPopKeyPair = req.body.sessionPopKeyPair;

  const codeChallengeApiResponse =
    await MyInfoConnector.callCorporateVcCodeChallengeAPI(
      ethereumWalletAddress,
      accessToken,
      sessionPopKeyPair
    );
  const codeChallenge = codeChallengeApiResponse.codeChallenge;
  res.status(200).json({ codeChallenge: codeChallenge });
}

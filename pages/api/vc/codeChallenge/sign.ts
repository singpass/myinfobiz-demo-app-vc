// Nextjs API Snippet
import type { NextApiRequest, NextApiResponse } from "next";

import { MYINFO_CONNECTOR_CONFIG } from "@/config/myinfo";
import MyInfoVcVerifier from "@/lib/myinfo-vc-verifier";

export type SignedResponse = {
  signedCodeChallenge?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignedResponse>
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method Not Allowed",
    });
    return;
  }

  const codeChallenge = req.body.codeChallenge;
  const privateKey = MYINFO_CONNECTOR_CONFIG.VC_ETHEREUM_PRIVATE_KEY;
  const signedCodeChallenge = MyInfoVcVerifier.ethereumSign(
    privateKey,
    codeChallenge
  );
  res.status(200).json({
    signedCodeChallenge: signedCodeChallenge,
  });
}

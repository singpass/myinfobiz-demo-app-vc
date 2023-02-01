import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";

import { MyInfoConnector } from "@/lib/myinfo-connector";

export type CodeChallengeResponseData = {
  codeChallenge?: string;
  error?: string;
};

type PkceCodePair = any & {
  codeChallenge: string;
  codeVerifier: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CodeChallengeResponseData>
) {
  try {
    let pkceCodePair: PkceCodePair = MyInfoConnector.generatePKCECodePair();
    setCookie("codeVerifier", pkceCodePair.codeVerifier, { req, res });
    res.status(200).send({ codeChallenge: pkceCodePair.codeChallenge });
  } catch (_e) {
    let error = _e as Error;
    console.log("Error", error);
    res.status(500).send({
      error: error.message,
    });
  }
}

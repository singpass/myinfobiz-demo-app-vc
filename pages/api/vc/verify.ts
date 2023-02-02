import type { NextApiRequest, NextApiResponse } from "next";

import MyInfoVcVerifier from "@/lib/myinfo-vc-verifier";

interface VerifyVcApiRequest extends NextApiRequest {
  body: {
    vcData: string; // Verifiable Credential data in format of JSON string
  };
}

type VerifyVCResponseData = {
  error?: string;
  verificationResult?: any;
};

export default async function handler(
  req: VerifyVcApiRequest,
  res: NextApiResponse<VerifyVCResponseData>
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method Not Allowed",
    });
    return;
  }

  try {
    const vcData = JSON.parse(req.body.vcData);
    // Verify Verifiable Credential
    console.log("Verifying Corporate Verifiable Credential...");
    const verificationResult = await MyInfoVcVerifier.verify(vcData);
    console.log(
      "Corporate Verifiable Credential verification result:",
      verificationResult
    );
    res.status(200).send({
      verificationResult: verificationResult,
    });
  } catch (_e) {
    let error = _e as Error;
    console.log("Error", error);
    res.status(500).send({
      error: error.message,
    });
  }
}

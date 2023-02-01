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
  revokeStatus?: any;
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
    let vcData = JSON.parse(req.body.vcData);
    // Verify Verifiable Credential
    console.log("Verifying Corporate Verifiable Credential...");
    let verificationResult = await MyInfoVcVerifier.verify(vcData);
    console.log(
      "Corporate Verifiable Credential verification result:",
      verificationResult
    );
    // Check Verifiable Credential Revoke status
    console.log("Retrieving Corporate Verifiable Credential revoke status...");
    let revokeStatus = await MyInfoVcVerifier.getRevokeStatus(vcData);
    console.log("Corporate Verifiable Credential revoke status:", revokeStatus);
    res.status(200).send({
      verificationResult: verificationResult,
      revokeStatus: revokeStatus,
    });
  } catch (_e) {
    let error = _e as Error;
    console.log("Error", error);
    res.status(500).send({
      error: error.message,
    });
  }
}

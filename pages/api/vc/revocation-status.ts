import type { NextApiRequest, NextApiResponse } from "next";

import MyInfoVcVerifier from "@/lib/myinfo-vc-verifier";

interface RevokeStatusVcApiRequest extends NextApiRequest {
  body: {
    vcData: string; // Verifiable Credential data in format of JSON string
  };
}

type RevokeStatusResponseData = {
  error?: string;
  revokeStatus?: any;
};

export default async function handler(
  req: RevokeStatusVcApiRequest,
  res: NextApiResponse<RevokeStatusResponseData>
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method Not Allowed",
    });
    return;
  }

  try {
    const vcData = JSON.parse(req.body.vcData);

    // Check Verifiable Credential Revoke status
    console.log("Retrieving Corporate Verifiable Credential revoke status...");
    let revokeStatus = await MyInfoVcVerifier.getRevokeStatus(vcData);
    console.log("Corporate Verifiable Credential revoke status:", revokeStatus);
    res.status(200).send({
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

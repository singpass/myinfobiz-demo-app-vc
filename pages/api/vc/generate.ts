import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";

import { MyInfoConnector } from "@/lib/myinfo-connector";

interface GenerateVcApiRequest extends NextApiRequest {
  body: {
    authCode: string;
  };
  cookies: {
    sid: string;
  };
}

type GenerateVCResponseData = {
  error?: string;
  [key: string]: any; // allow any key to be added to the object [key: string
};

export default async function handler(
  req: GenerateVcApiRequest,
  res: NextApiResponse<GenerateVCResponseData>
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method Not Allowed",
    });
    return;
  }

  try {
    const codeVerifier = getCookie("codeVerifier", { req, res }) as string;
    // get variables from frontend
    const authCode = req.body.authCode;
    console.log("GENERATE - codeVerifier", codeVerifier);
    console.log("Calling MyInfo NodeJs Library...");

    let vcData = await MyInfoConnector.getMyInfoPersonData(
      authCode,
      codeVerifier
    );
    /* 
      P/s: Your logic to handle the person data ...
    */
    console.log(
      "--- Sending Person Data From Your-Server (Backend) to Your-Client (Frontend)---:"
    );
    console.log(JSON.stringify(vcData)); // log the data for demonstration purpose only
    res.status(200).send(vcData); //return personData
  } catch (_e) {
    let error = _e as Error;
    console.log("---MyInfo NodeJs Library Error---");
    console.log(error);
    res.status(500).send({
      error: error.message,
    });
  }
}

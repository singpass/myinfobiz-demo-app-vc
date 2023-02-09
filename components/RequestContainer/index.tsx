import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { APP_CONFIG } from "@/config/app";
import locale from "@/config/locale";
import { SHOWN_CONFIG } from "@/config/shown";
import type { Status } from "@/utils/types";
import type { CodeChallengeResponseData } from "@/pages/api/codeChallenge";
import type { CodeChallengeResponse as VcCodeChallengeResponse } from "@/pages/api/vc/codeChallenge";
import type { SignedResponse as SignedCodeChallengeResponse } from "@/pages/api/vc/codeChallenge/sign";
import ProgressDialog from "components/common/ProgressDialog";
import TopContainer from "./TopContainer";
import BottomContainer from "./BottomContainer";
import { VerifiableCredentialsResponse } from "@/pages/api/vc/credentials";

const Wrapper = styled.div`
  position: relative;
  z-index: 5;

  background: white;
  border-radius: 0px 10px 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 40px;

  display: flex;
  flex-direction: column;
  gap: 35px;

  h3 {
    font-weight: 600;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: #5b5b5b;
`;

export default () => {
  /**
   * Hooks
   */
  const router = useRouter();
  const configPlainFormat = useMemo(() => {
    return Object.entries(SHOWN_CONFIG)
      .map(([k, v]) => {
        let _v: string | number | boolean = v;
        if (typeof v === "string") {
          _v = `"${v}"`;
        }
        return `${k}: ${_v}`;
      })
      .join(",\n");
  }, []);
  const [resValue, setResValue] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [data, setData] = useState<CodeChallengeResponseData>({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (router.query.code && router.query.loaded !== "") {
      setDialogVisible(true);
      router.replace({
        query: { ...router.query, loaded: "" },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.code]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/codeChallenge")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  /**
   * Not hook
   */
  const handleAction = async (update: (s: Status) => void) => {
    try {
      // Step 1
      const res1 = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authCode: router.query.code,
        }),
      });
      if (!res1.ok) {
        throw new Error(locale.request.response.failed.verifyEthereumAddress);
      }
      const { accessToken, sessionPopKeyPair } = await res1.json();
      update("success");

      // Step 2
      const res2 = await fetch("/api/vc/codeChallenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: accessToken,
          sessionPopKeyPair: sessionPopKeyPair,
        }),
      });
      if (!res2.ok) {
        throw new Error(locale.request.response.failed.codeChallenge);
      }
      const codeChallengeRes: VcCodeChallengeResponse = await res2.json();
      const codeChallenge = codeChallengeRes.codeChallenge;
      update("success");

      // Step 3
      const res3 = await fetch("/api/vc/codeChallenge/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codeChallenge: codeChallenge,
        }),
      });
      if (!res3.ok) {
        throw new Error(locale.request.response.failed.verifyCodeChallenge);
      }
      const signedCodeChallengeRes: SignedCodeChallengeResponse =
        await res3.json();
      const signedCodeChallenge = signedCodeChallengeRes.signedCodeChallenge;
      update("success");

      // Step 4
      const res4 = await fetch("/api/vc/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: accessToken,
          sessionPopKeyPair: sessionPopKeyPair,
          codeChallenge: codeChallenge,
          signedCodeChallenge: signedCodeChallenge,
        }),
      });
      if (!res4.ok) {
        throw new Error(locale.request.response.failed.getVc);
      }
      const resp: VerifiableCredentialsResponse = await res4.json();
      const vc = resp.credentialData;
      update("success");
      setResValue(JSON.stringify(vc, null, 4));
    } catch (e: unknown) {
      update("failed");
      // Error message will be shown in the dialog
      throw e;
    }
  };

  const handleSubmit = () => {
    console.log(SHOWN_CONFIG); // VC Config value
    const url = new URL(APP_CONFIG.MYINFO_API_AUTHORIZE);
    url.searchParams.append("client_id", APP_CONFIG.DEMO_APP_CLIENT_ID!);
    url.searchParams.append("scope", APP_CONFIG.DEMO_APP_SCOPES!);
    url.searchParams.append("purpose_id", APP_CONFIG.DEMO_APP_PURPOSE_ID!);
    url.searchParams.append("code_challenge", data.codeChallenge!);
    url.searchParams.append(
      "code_challenge_method",
      APP_CONFIG.DEMO_APP_CODE_CHALLENGE_METHOD
    );
    url.searchParams.append("redirect_uri", APP_CONFIG.DEMO_APP_CALLBACK_URL!);
    window.location.replace(url.toString());
  };

  const handleReset = () => {
    setResValue("");
  };

  /**
   * Render
   */
  return (
    <Wrapper>
      <TopContainer
        textareaValue={configPlainFormat}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />

      {resValue && <Divider />}

      {resValue && (
        <BottomContainer textareaValue={resValue} onReset={handleReset} />
      )}

      <ProgressDialog
        loadingText={locale.dialog.title.request}
        tasks={{
          titles: [
            locale.request.step1,
            locale.request.step2,
            locale.request.step3,
            locale.request.step4,
          ],
          action: handleAction,
        }}
        visible={dialogVisible}
        setVisible={setDialogVisible}
      />
    </Wrapper>
  );
};

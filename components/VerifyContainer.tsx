import { useEffect, useState } from "react";
import styled from "styled-components";

import locale from "@/config/locale";
import { mockPromise } from "@/utils";
import type { Status } from "@/utils/types";
import Button from "components/common/Button";
import TextArea from "components/common/TextArea";
import ProgressDialog from "components/common/ProgressDialog";
import StatusBanner from "components/common/StatusBanner";

const Wrapper = styled.div`
  position: relative;
  z-index: 5;

  background: white;
  border-radius: 10px;
  padding: 40px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  h3 {
    font-weight: 600;
  }
  & > button {
    align-self: start;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default () => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [resStatus, setResStatus] = useState<Status | undefined>();
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    console.log(textAreaValue);
  }, [textAreaValue]);

  const handleAction = async (update: (s: Status) => void) => {
    try {
      // Step 1
      await mockPromise({ ms: 50, resolve: true, response: "" });
      update("success");

      // Step 2
      const res = await fetch("/api/vc/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vcData: textAreaValue,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to verify VC");
      }
      const verifyResponse = await res.json();
      if (verifyResponse.verificationResult.error) {
        throw new Error(
          verifyResponse.verificationResult.error.errors[0].message
        );
      }
      update("success");

      // Step 3
      await mockPromise({ ms: 50, resolve: true, response: "" });
      update("success");

      // Step 4
      if (
        !verifyResponse.verificationResult.verified ||
        verifyResponse.revokeStatus
      ) {
        throw new Error("Failed to verify revocation status");
      }
      update("success");

      setResStatus("success");
    } catch (e: unknown) {
      update("failed");
      setResStatus("failed");
      throw e;
    }
  };

  const handleSubmit = () => {
    setDialogVisible(true);
  };

  const handleReset = () => {
    setTextAreaValue("");
    setResStatus(undefined);
  };

  return (
    <Wrapper>
      <div>
        <h3>{locale.verify.title}</h3>
        <p>{locale.verify.subtitle}</p>
      </div>

      <Content>
        {resStatus === "success" && (
          <StatusBanner status="success">
            {locale.verify.response.successBanner}
          </StatusBanner>
        )}

        {resStatus === "failed" && (
          <StatusBanner status="failed">
            {locale.verify.response.failedBanner}
          </StatusBanner>
        )}

        <TextArea
          status={resStatus || undefined}
          rows={8}
          value={textAreaValue}
          readOnly={resStatus !== undefined}
          onChange={(e) => setTextAreaValue(e.target.value)}
        />
      </Content>

      {resStatus === undefined && (
        <Button.Classic disabled={!textAreaValue} onClick={handleSubmit}>
          {locale.button.verify}
        </Button.Classic>
      )}

      {resStatus !== undefined && (
        <Button.Classic disabled={!textAreaValue} onClick={handleReset}>
          {locale.button.resetVerify}
        </Button.Classic>
      )}

      <ProgressDialog
        loadingText={locale.dialog.title.request}
        tasks={{
          titles: [
            locale.verify.step1,
            locale.verify.step2,
            locale.verify.step3,
            locale.verify.step4,
          ],
          action: handleAction,
        }}
        visible={dialogVisible}
        setVisible={setDialogVisible}
      />
    </Wrapper>
  );
};

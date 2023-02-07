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
  border-radius: 0px 10px 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
      await mockPromise({ ms: 100, resolve: true, response: "" });
      update("success");

      // Step 2
      const res2 = await fetch("/api/vc/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vcData: textAreaValue,
        }),
      });
      if (!res2.ok) {
        throw new Error("Failed to verify VC");
      }
      const verifyResponse = await res2.json();
      if (verifyResponse.verificationResult.error) {
        throw new Error(
          verifyResponse.verificationResult.error.errors[0].message
        );
      }
      update("success");

      // Step 3
      await mockPromise({ ms: 100, resolve: true, response: "" });
      update("success");

      // Step 4
      const res4 = await fetch("/api/vc/revocationStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vcData: textAreaValue,
        }),
      });
      if (!res4.ok) {
        throw new Error("Failed to verify VC");
      }
      const revokeStatusResponse = await res4.json();
      if (revokeStatusResponse.revokeStatus) {
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
        <h3 data-testid="verify-corporate-vc-response-title">
          {locale.verify.title}
        </h3>
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
          data-testid="verify-corporate-vc-textarea"
        />
      </Content>

      {resStatus === undefined && (
        <Button.Classic
          disabled={!textAreaValue}
          onClick={handleSubmit}
          data-testid="verify-btn"
        >
          {locale.button.verify}
        </Button.Classic>
      )}

      {resStatus !== undefined && (
        <Button.Classic
          disabled={!textAreaValue}
          onClick={handleReset}
          data-testid="verify-reset-btn"
        >
          {locale.button.resetVerify}
        </Button.Classic>
      )}

      <ProgressDialog
        loadingText={locale.dialog.title.verify}
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

import { useEffect, useState } from "react";
import styled from "styled-components";

import locale from "@/config/locale";
import { mockPromise } from "@/utils";
import { Status } from "@/utils/types";
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

const Footer = styled.div`
  display: flex;
  align-items: end;
  gap: 10px;

  p {
    font-size: 14px;
  }
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
      update(Status.SUCCESS);

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
      update(Status.SUCCESS);

      // Step 3
      await mockPromise({ ms: 100, resolve: true, response: "" });
      update(Status.SUCCESS);

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
      update(Status.SUCCESS);

      setResStatus(Status.SUCCESS);
    } catch (e: unknown) {
      update(Status.FAILED);
      setResStatus(Status.FAILED);
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
        {resStatus === Status.SUCCESS && (
          <StatusBanner status={Status.SUCCESS}>
            {locale.verify.response.successBanner}
          </StatusBanner>
        )}

        {resStatus === Status.FAILED && (
          <StatusBanner status={Status.FAILED}>
            {locale.verify.response.failedBanner}
          </StatusBanner>
        )}

        <TextArea
          status={resStatus || undefined}
          rows={8}
          value={textAreaValue}
          readOnly={dialogVisible}
          onChange={(e) => setTextAreaValue(e.target.value)}
          data-testid="verify-corporate-vc-textarea"
        />
      </Content>

      <Footer>
        <Button.Classic
          disabled={!textAreaValue}
          onClick={handleSubmit}
          data-testid="verify-btn"
        >
          {locale.button.verify}
        </Button.Classic>
        <Button.Secondary
          onClick={handleReset}
          disabled={!textAreaValue}
          style={{
            visibility: resStatus !== undefined ? "visible" : "hidden",
            padding: "10px 24px",
          }}
          data-testid="reset-btn"
        >
          {locale.button.resetVerify}
        </Button.Secondary>
      </Footer>

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

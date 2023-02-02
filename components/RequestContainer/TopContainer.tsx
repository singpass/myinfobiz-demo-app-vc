import styled from "styled-components";

import locale from "@/config/locale";
import Button from "components/common/Button";
import TextArea from "components/common/TextArea";
import StatusBanner from "components/common/StatusBanner";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Footer = styled.div`
  display: flex;
  align-items: end;
  gap: 10px;

  p {
    font-size: 14px;
  }
`;

export default ({
  textareaValue,
  isLoading,
  isCodeChallengeReceived,
  onSubmit,
}: {
  textareaValue: string;
  isLoading: boolean;
  isCodeChallengeReceived: boolean;
  onSubmit: () => void;
}) => {
  if (isLoading) {
    return (
      <Wrapper>
        <h3>{locale.request.title}</h3>

        <TextArea rows={8} value={textareaValue} readOnly />

        <Footer>
          <Button.Classic disabled={true}>
            {locale.button.loading}
          </Button.Classic>

          <p>{locale.request.notice}</p>
        </Footer>
      </Wrapper>
    );
  }

  if (!isCodeChallengeReceived) {
    return (
      <Wrapper>
        <h3>{locale.request.title}</h3>

        <StatusBanner status="failed">
          {locale.request.response.failed.codeChallenge}
        </StatusBanner>

        <TextArea rows={8} value={textareaValue} readOnly />

        <Footer>
          <Button.Classic disabled={true}>
            {locale.button.request}
          </Button.Classic>

          <p>{locale.request.notice}</p>
        </Footer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h3>{locale.request.title}</h3>

      <TextArea rows={8} value={textareaValue} readOnly />

      <Footer>
        <Button.Classic
          disabled={!textareaValue}
          onClick={onSubmit}
          data-testid="request-btn"
        >
          {locale.button.request}
        </Button.Classic>

        <p>{locale.request.notice}</p>
      </Footer>
    </Wrapper>
  );
};

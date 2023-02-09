import styled from "styled-components";

import locale from "@/config/locale";
import Button from "components/common/Button";
import TextArea from "components/common/TextArea";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  p {
    font-size: 14px;
  }
`;

export default ({
  textareaValue,
  isLoading,
  onSubmit,
}: {
  textareaValue: string;
  isLoading: boolean;
  onSubmit: () => void;
}) => {
  return (
    <Wrapper>
      <div>
        <h3>{locale.request.title}</h3>
        <p>{locale.request.subtitle}</p>
      </div>

      <TextArea rows={8} value={textareaValue} readOnly />

      <Footer>
        {isLoading ? (
          <Button.Classic disabled={true}>
            {locale.button.loading}
          </Button.Classic>
        ) : (
          <Button.Classic
            disabled={!textareaValue}
            onClick={onSubmit}
            data-testid="request-btn"
          >
            {locale.button.request}
          </Button.Classic>
        )}

        <p>{locale.request.notice}</p>
      </Footer>
    </Wrapper>
  );
};

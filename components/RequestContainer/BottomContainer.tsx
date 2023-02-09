import styled from "styled-components";
import locale from "@/config/locale";

import TextArea, { Wrapper as $TextArea } from "components/common/TextArea";
import StatusBanner from "components/common/StatusBanner";
import { Status } from "@/utils/types";

const Wrapper = styled.div`
  h3 {
    padding-bottom: 20px;
  }

  ${$TextArea} {
    margin: 10px 0;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    color: #4c7aae;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default ({
  textareaValue,
  onReset,
}: {
  textareaValue: string;
  onReset: () => void;
}) => {
  /**
   * Not hook
   */
  const footer = locale.request.response.reset
    .split("{{ link }}")
    .map((v, i) => <p key={i}>{v}</p>);

  footer.splice(
    1,
    0,
    <span key={footer.length} onClick={onReset}>
      {locale.request.response.link}
    </span>
  );

  /**
   * Render
   */
  return (
    <Wrapper>
      <h3 data-testid="request-corporate-vc-response-title">
        {locale.request.response.title}
      </h3>

      <StatusBanner status={Status.SUCCESS}>
        {locale.request.response.successBanner}
      </StatusBanner>

      <TextArea
        rows={22}
        copyable
        value={textareaValue}
        copyText={textareaValue}
        status={Status.SUCCESS}
        readOnly
        data-testid="request-corporate-vc-textarea"
      />

      <Footer>{footer}</Footer>
    </Wrapper>
  );
};

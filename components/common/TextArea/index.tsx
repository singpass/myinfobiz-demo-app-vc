import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import locale from "@/config/locale";
import type { Status } from "@/utils/types";
import { applyStyleIf } from "@/utils";
import Button, { Wrapper as $Button } from "./Button";
import CheckCircle from "components/svg/CheckCircle";

export const Wrapper = styled.div`
  position: relative;
  border-radius: 8px;

  ${$Button} {
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

const TextArea = styled.textarea(
  ({ $status, $shadow = false }: { $status?: Status; $shadow?: boolean }) => `
  padding: 15px;
  width: 100%;
  background: #F8F8FE;
  outline: 0;
  border: 0;
  border-radius: 8px;
  border: 1.5px solid transparent;
  resize: vertical;

  font-size: 16px;
  line-height: 18px;
  font-weight: 500;

  ${applyStyleIf(
    $status === "success",
    `
  border-color: #438F0E;
  `
  )}

  ${applyStyleIf(
    $status === "failed",
    `
  border-color: #8F0E0E;
  `
  )}

  ${applyStyleIf(
    $shadow,
    `
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    opacity: 0;
  `
  )}
`
);

export default ({
  copyable = false,
  status,
  copyText,
  ...props
}: {
  copyable?: boolean;
  status?: Status;
  copyText?: string;
} & Omit<JSX.IntrinsicElements["textarea"], "ref">) => {
  const lit = useRef<HTMLTextAreaElement>(null);
  const shadow = useRef<HTMLTextAreaElement>(null);

  const [checkVisible, setCheckVisible] = useState(false);

  useEffect(() => {
    if (!lit.current) return;
    if (!shadow.current) return;

    shadow.current.style.height = "0";
    const height = Math.max(200, shadow.current.scrollHeight + 4);

    shadow.current.style.height = `${height}px`;
    lit.current.style.height = `${height}px`;
  }, [props.value]);

  const handleCopy = async () => {
    if (!copyText) return;

    await navigator.clipboard.writeText(copyText);
    setCheckVisible(true);
    setTimeout(() => setCheckVisible(false), 3000);
  };

  return (
    <Wrapper>
      <TextArea ref={lit} {...props} $status={status} />
      <TextArea ref={shadow} {...props} $shadow />

      {copyable && (
        <Button onClick={handleCopy}>
          {locale.button.copy}
          {checkVisible && <CheckCircle />}
        </Button>
      )}
    </Wrapper>
  );
};

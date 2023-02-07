import styled from "styled-components";

import { Status } from "@/utils/types";
import CrossCircle from "components/svg/CrossCircle";
import CheckCircle from "components/svg/CheckCircle";
import { applyStyleIf } from "@/utils";

const Wrapper = styled.div(
  ({ $status }: { $status: Status }) => `
  width: 100%;
  padding: 8px 0;

  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  
  p { color: #222222 }
  
  svg { height: 20px }
  
  ${applyStyleIf(
    $status === "success",
    `
    background: #D2ECC0;
  `
  )}

  ${applyStyleIf(
    $status === "failed",
    `
    background:#FFCFCF;
  `
  )}
`
);

export default ({ children, status }: { children: string; status: Status }) => (
  <Wrapper $status={status}>
    {status === "success" && <CheckCircle />}
    {status === "failed" && <CrossCircle />}

    <p data-testid="container-status-banner-text">{children}</p>
  </Wrapper>
);

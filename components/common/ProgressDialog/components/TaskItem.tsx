import styled from "styled-components";

import type { TaskState } from "../types";
import { applyStyleIf } from "@/utils";
import CheckCircle from "components/svg/CheckCircle";
import CrossCircle from "components/svg/CrossCircle";

const Wrapper = styled.div`
  --font-size: 14px;

  display: flex;
  flex: none;
  align-items: center;
  gap: 10px;

  svg {
    height: 25px;
  }
`;

const Number = styled.div(
  ({ $state }: { $state: TaskState }) => `
  border-radius: 50%;
  aspect-ratio: 1/1;
  height: 25px;
  width: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #E3EEFF;
  opacity: 1;
  color: #222222;
  font-weight: 600;
  font-size: var(--font-size);

  ${applyStyleIf(
    $state === "inactive",
    `
    opacity: 0.4
  `
  )}
`
);

const Text = styled.p(
  ({ $state }: { $state: TaskState }) => `
  font-size: var(--font-size);
  color: #222222;
  opacity: 1;

  ${applyStyleIf(
    $state === "inactive",
    `
    opacity: 0.4;
  `
  )}

  ${applyStyleIf(
    $state === "success",
    `
    color: #438F0E;
  `
  )}

  ${applyStyleIf(
    $state === "failed",
    `
    color: #8F0E0E;
  `
  )}
`
);

export default ({
  children,
  order,
  state,
}: {
  children: string;
  order: string | number;
  state: TaskState;
}) => {
  const mapStateJSX = () => {
    switch (state) {
      case "in-progress":
      case "inactive":
        return <Number $state={state}>{order}</Number>;
      case "success":
        return <CheckCircle />;
      case "failed":
        return <CrossCircle />;
    }
  };

  return (
    <Wrapper>
      {mapStateJSX()}

      <Text $state={state}>{children}</Text>
    </Wrapper>
  );
};

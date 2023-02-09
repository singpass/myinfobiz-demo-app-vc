import styled from "styled-components";

import { ProgressState } from "../types";
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
  ({ $state }: { $state: ProgressState }) => `
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
    $state === ProgressState.INACTIVE,
    `
    opacity: 0.4
  `
  )}
`
);

const Text = styled.p(
  ({ $state }: { $state: ProgressState }) => `
  font-size: var(--font-size);
  color: #222222;
  opacity: 1;
  flex-shrink: 1;

  ${applyStyleIf(
    $state === ProgressState.INACTIVE,
    `
    opacity: 0.4;
  `
  )}

  ${applyStyleIf(
    $state === ProgressState.SUCCESS,
    `
    color: #438F0E;
  `
  )}

  ${applyStyleIf(
    $state === ProgressState.FAILED,
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
  state: ProgressState;
}) => {
  const mapStateJSX = () => {
    switch (state) {
      case ProgressState.PROGRESS:
      case ProgressState.INACTIVE:
        return <Number $state={state}>{order}</Number>;
      case ProgressState.SUCCESS:
        return <CheckCircle />;
      case ProgressState.FAILED:
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

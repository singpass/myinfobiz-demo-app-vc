import styled from "styled-components";
import { applyStyleIf } from "@/utils";

export const Wrapper = styled.button(
  ({ $active }: { $active: boolean }) => `
  position: relative;
  z-index: 2;
  background: rgba(239, 231, 236, 0.4);
  padding: 15px;
  width: 280px;

  border: 0;
  outline: 0;
  border-radius: 8px 8px 0 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  color: #5E5E5E;
  font-weight: 500;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: transparent;
  }

  ${applyStyleIf(
    $active,
    `
    background: white;
    z-index: 3;

    &::before {
      background: #4C7AAE;
    }
  `
  )}
`
);

export default ({
  children,
  active = false,
  ...props
}: {
  children: string;
  active?: boolean;
} & Omit<JSX.IntrinsicElements["button"], "ref">) => (
  <Wrapper {...props} $active={active}>
    {children}
  </Wrapper>
);

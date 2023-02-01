import styled from "styled-components";

export const Wrapper = styled.button`
  padding: 10px 24px;
  background: #4c7aae;
  color: white;
  border: 0;
  outline: 0;
  border-radius: 8px;
  cursor: pointer;

  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.2px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export default ({
  children,
  ...props
}: {
  children: string;
} & Omit<JSX.IntrinsicElements["button"], "ref">) => (
  <Wrapper {...props}>{children}</Wrapper>
);

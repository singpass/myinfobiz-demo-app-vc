import styled from "styled-components";

export const Wrapper = styled.button`
  background: #e9ecef;
  border: 0;
  outline: 0;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;

  letter-spacing: 0.2px;
  font-size: 14px;
  font-weight: 600;

  display: flex;
  align-items: center;
  gap: 5px;

  svg {
    height: 16px;
  }
`;

export default ({
  children,
  ...props
}: {
  children: Array<JSX.Element | string | boolean>;
} & Omit<JSX.IntrinsicElements["button"], "ref">) => (
  <Wrapper {...props}>{children}</Wrapper>
);

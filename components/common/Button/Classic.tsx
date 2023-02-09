import styled from "styled-components";

export const Wrapper = styled.button`
  --primary-color: #4c7aae;

  padding: 10px 24px;
  background: #4c7aae;
  color: white;
  border-radius: 8px;
  border: 1px solid var(--primary-color);
  cursor: pointer;

  font-weight: 600;

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

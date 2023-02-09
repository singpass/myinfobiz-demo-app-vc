import styled from "styled-components";

const Wrapper = styled.button`
  --primary-color: #0d4c92;

  padding: 10px 24px;
  background: #f8f8fe;
  color: var(--primary-color);
  border-radius: 8px;
  border: 1px solid var(--primary-color);
  cursor: pointer;

  font-weight: 600;
`;

export default ({
  children,
  ...props
}: {
  children: string;
} & Omit<JSX.IntrinsicElements["button"], "ref">) => (
  <Wrapper {...props}>{children}</Wrapper>
);

import styled from "styled-components";
import locale from "@/config/locale";

const Wrapper = styled.button`
  --primary-color: #0d4c92;

  font-weight: 600;
  width: 120px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;

  background: #f8f8fe;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
`;

export default (props: Omit<JSX.IntrinsicElements["button"], "ref">) => (
  <Wrapper {...props}>{locale.button.ok}</Wrapper>
);

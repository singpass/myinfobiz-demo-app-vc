import styled from "styled-components";

import locale from "@/config/locale";
import Merlion from "./svg/Merlion";

const Wrapper = styled.header`
  position: relative;
  height: auto;
  padding: 6px 0;
  z-index: 2;
  font-size: 14px;
  background-color: #f0f0f0;
`;

const Container = styled.div`
  gap: 4px;
  color: #484848;
  display: flex;
  align-items: center;
  margin-left: 30px;
`;

const Text = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #484848;
`;

export default () => (
  <Wrapper>
    <Container>
      <Merlion />

      <Text>{locale.header}</Text>
    </Container>
  </Wrapper>
);

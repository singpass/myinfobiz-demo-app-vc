import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";

import locale from "config/locale";
import { Mode } from "@/utils/types";
import Header from "components/Header";
import Button from "components/common/Button";
import RequestContainer from "components/RequestContainer";
import VerifyContainer from "components/VerifyContainer";

const Wrapper = styled.main`
  min-height: 100vh;

  display: flex;
  flex-direction: column;
`;

const OuterSection = styled.section`
  flex-grow: 1;
  background: linear-gradient(
    270deg,
    rgba(240, 231, 234, 0.85) 0%,
    rgba(248, 247, 254, 0.85) 55.21%
  );
`;

const Section = styled.div`
  padding: 40px var(--padding-h);
  max-width: var(--max-width);
  margin: 0 auto;

  display: flex;
  position: relative;
  flex-direction: column;
  gap: 40px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: left;
  margin-top: 24px;
  margin-bottom: 76px;

  & > * {
    text-align: left;
  }
`;

const Title = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  max-width: 560px;
  margin-bottom: 16px;
`;

const Subtitle = styled.div`
  font-size: 1.2rem;
  font-weight: 100;
  max-width: 420px;
`;

const TabGroup = styled.div`
  display: flex;
  justify-content: left;
`;

export default () => {
  const [mode, setMode] = useState<Mode>(Mode.REQUEST);
  return (
    <Wrapper>
      <Header />
      <OuterSection>
        <Section>
          <Image
            src={"/Graphics.svg"}
            width={860}
            height={540}
            alt="background"
            style={{ position: "absolute", top: -10, right: 0, zIndex: 0 }}
          />
          <TitleContainer>
            <Title>{locale.title}</Title>
            <Subtitle>{locale.subtitle}</Subtitle>
          </TitleContainer>
          <Container>
            <TabGroup>
              <Button.Mode
                active={mode === Mode.REQUEST}
                onClick={() => setMode(Mode.REQUEST)}
                data-testid="request-corporate-vc-btn-tab"
              >
                {locale.request.tabButton}
              </Button.Mode>

              <Button.Mode
                active={mode === Mode.VERIFY}
                onClick={() => setMode(Mode.VERIFY)}
                data-testid="verify-corporate-vc-btn-tab"
              >
                {locale.verify.tabButton}
              </Button.Mode>
            </TabGroup>

            {mode === Mode.REQUEST && <RequestContainer />}
            {mode === Mode.VERIFY && <VerifyContainer />}
          </Container>
        </Section>
      </OuterSection>
    </Wrapper>
  );
};

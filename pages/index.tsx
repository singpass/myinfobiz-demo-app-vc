import { useState } from "react";
import styled from "styled-components";

import locale from "config/locale";
import type { Mode } from "@/utils/types";
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
  flex-direction: column;
  gap: 40px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  & > * {
    text-align: center;
  }
`;

const TabGroup = styled.div`
  display: flex;
  justify-content: center;
`;

export default () => {
  const [mode, setMode] = useState<Mode>("request");
  return (
    <Wrapper>
      <Header />

      <OuterSection>
        <Section>
          <Title>
            <h1>{locale.title}</h1>
            <p>{locale.subtitle}</p>
          </Title>

          <Container>
            <TabGroup>
              <Button.Mode
                active={mode === "request"}
                onClick={() => setMode("request")}
                data-testid="request-corporate-vc-btn-tab"
              >
                {locale.request.tabButton}
              </Button.Mode>

              <Button.Mode
                active={mode === "verify"}
                onClick={() => setMode("verify")}
                data-testid="verify-corporate-vc-btn-tab"
              >
                {locale.verify.tabButton}
              </Button.Mode>
            </TabGroup>

            {mode === "request" && <RequestContainer />}
            {mode === "verify" && <VerifyContainer />}
          </Container>
        </Section>
      </OuterSection>
    </Wrapper>
  );
};

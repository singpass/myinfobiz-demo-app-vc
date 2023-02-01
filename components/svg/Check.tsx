import styled from "styled-components";

export const Wrapper = styled.svg`
  aspect-ratio: 40/27;
  height: auto;
  width: auto;
  display: block;
`;

export default () => (
  <Wrapper
    width={40}
    height={27}
    viewBox="0 0 40 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 13.25L14 24.5L38 2"
      stroke="#438F0E"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Wrapper>
);

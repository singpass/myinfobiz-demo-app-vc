import styled from "styled-components";

export const Wrapper = styled.svg`
  aspect-ratio: 1/1;
  height: auto;
  width: auto;
  display: block;
  flex: none;
`;

export default () => (
  <Wrapper
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="https://www.w3.org/TR/2018/CR-SVG2-20181004/"
  >
    <path
      d="M13 0.5C6.09625 0.5 0.5 6.09625 0.5 13C0.5 19.9037 6.09625 25.5 13 25.5C19.9037 25.5 25.5 19.9037 25.5 13C25.5 6.09625 19.9037 0.5 13 0.5ZM10.5 19.7675L4.61625 13.8837L6.38375 12.1163L10.5 16.2325L19.6162 7.11625L21.3838 8.88375L10.5 19.7675Z"
      fill="#438F0E"
    />
  </Wrapper>
);

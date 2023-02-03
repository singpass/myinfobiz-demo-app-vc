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
      d="M13 0.5C6.0875 0.5 0.5 6.0875 0.5 13C0.5 19.9125 6.0875 25.5 13 25.5C19.9125 25.5 25.5 19.9125 25.5 13C25.5 6.0875 19.9125 0.5 13 0.5ZM19.25 17.4875L17.4875 19.25L13 14.7625L8.5125 19.25L6.75 17.4875L11.2375 13L6.75 8.5125L8.5125 6.75L13 11.2375L17.4875 6.75L19.25 8.5125L14.7625 13L19.25 17.4875Z"
      fill="#8F0E0E"
    />
  </Wrapper>
);

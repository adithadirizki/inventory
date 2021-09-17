import styled, { keyframes } from "styled-components";

const keyframeRotator = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }`;
const keyframeColors = keyframes`
  0% { stroke: #4285F4; }
  25% { stroke: #DE3E35; }
  50% { stroke: #F7C223; }
  75% { stroke: #1B9A59; }
  100% { stroke: #4285F4; }`;
const keyframeDash = keyframes`
  0% { stroke-dashoffset: 187; }
  50% {
    stroke-dashoffset: 46.75;
    transform:rotate(135deg);
  }
  100% {
    stroke-dashoffset: 187;
    transform:rotate(450deg);
  }`;
const Loader = styled.svg.attrs((props) => ({
  width: props.width || "65px",
  height: props.width || "65px",
  viewBox: "0 0 66 66",
  xlmns: "http://www.w3.org/2000/svg",
}))`
  margin: auto;
  animation: ${keyframeRotator} 1.4s linear infinite;
`;
const CircleLoader = styled.circle.attrs({
  fill: "none",
  strokeWidth: "2",
  strokeLinecap: "round",
  cx: "33",
  cy: "33",
  r: "30",
})`
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: ${keyframeDash} 1.4s ease-in-out infinite,
    ${keyframeColors} 5.6s ease-in-out infinite;
`;

const Loading = ({ children, width, height }) => {
  return (
    <>
      <Loader width={width} height={height}>
        <CircleLoader />
      </Loader>
      {children}
    </>
  );
};

export default Loading;

import styled, {css, keyframes} from 'styled-components';

export const LoadingSpinnerWrap = styled.div`
  width: 100%;
  padding: 50px 0;
`;

const UpAndDown = keyframes`
  0% { opacity: 0; transform: translateY(0); }
  25% { opacity: 1; transform: translateY(-10px); }
  75% { opacity: 1; transform: translateY(-10px); }
  100% { opacity: 0; transform: translateY(0); }
`;

export const LoadingSpinnerSVG = styled.svg`
  display: block;
  margin: 0 auto;
  fill: #000;
  circle {
    animation-name: ${UpAndDown};
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(.05, .2, .35, 1);
    animation-iteration-count: infinite;
    
    &:nth-child(2) {
      animation-delay: .18s;
    }

    &:nth-child(3) {
      animation-delay: .36s;
    }
  }
`;

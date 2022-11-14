import { createGlobalStyle } from 'styled-components';
import BackgroundImage from '../assets/background.svg';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
    box-sizing: border-box;
  }

  body {
    width: 100vw;
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.05rem;
    background: url(${BackgroundImage});
    background-position: center;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  button {
    outline: none;
    cursor: pointer;
  }

  input {
    outline: none;
  }
`;

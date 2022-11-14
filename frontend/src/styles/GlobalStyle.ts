import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Sniglet:wght@400;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
    font-family:  'Noto Sans KR', sans-serif;
    box-sizing: border-box;
  }

  body {
    width: 100vw;
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.05rem;
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

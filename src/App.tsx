import React from 'react';

import GlobalStyle from './syles/global';

import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <>
      <SignIn />
      <GlobalStyle />
    </>
  );
};

export default App;

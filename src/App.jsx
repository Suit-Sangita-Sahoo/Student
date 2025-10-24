import React from 'react';
import './index.css';
import Routing from './Routing/Routing';
import GlobalContext from './CreateContext/GlobalContext';

const App = () => {
  return (
    <GlobalContext>
      <Routing />
    </GlobalContext>
  );
};

export default App;

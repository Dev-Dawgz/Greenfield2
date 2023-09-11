import React from 'react';
import {BrowserRouter as Router, Routes, Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import User from './User.jsx';
import Text from './Text.jsx';


function App () {
  return (
    <div className='wrapper'>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/user" element={<User/>} />
          <Route path="/user/text" element={<Text/>} />
        </Routes>
      </Router>
    </div>
    )
};
export default App
import { useEffect } from 'react';
import { AuthProvider } from './AuthContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import Login from './Login.jsx'
import User from './User.jsx';
import Post from './Post.jsx';
import Register from './Register.jsx';




function App () {

  // useEffect(() => {
  //   const storedUserId = sessionStorage.getItem('user_id');
  //   const storedUserName = sessionStorage.getItem('user_name');

  //   if (storedUserId && storedUserName) {
  //     // User data found in sessionStorage, set the user state
  //     setUser({
  //       id: storedUserId,
  //       username: storedUserName,
  //     });
  //   }
  // }, []);

  return (
    <AuthProvider>
      <div className='wrapper'>
        <Router>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/home" element={<Homepage/>} />
            <Route exact path="/user" element={<User/>} />
            <Route path="/text/id" element={<Post/>} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
    )
};
export default App
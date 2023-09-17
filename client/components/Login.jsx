import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/auth/login', { username, password });
      if (response.data.message === 'Login successful.') {
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('user_name', response.data.user_name);

        //after setting state, clear localstorage

        // Redirect to a protected route upon successful login
        window.location.href = '/home';
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <Link to='/register'>
      <button>
        register
      </button>
      </Link>
    </div>
  );
};

export default Login;
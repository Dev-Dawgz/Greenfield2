import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const Login = () => {
  const { login } = useAuth(); // Access login function from AuthContext
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/auth/login', { username, password });
      if (response.data.message === 'Login successful.') {
          const userData = {
          id: response.data.user_id,
          username: response.data.user_name
        };
      console.log(userData);
      login(userData);
      navigate({ pathname: '/home' })
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
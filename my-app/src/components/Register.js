import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      const { username: userUsername, email: userEmail, token } = response.data;
      localStorage.setItem('username', userUsername);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Error registering. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Register;
//Importation des modules nécessaires
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//React, useState (pour gérer l'état local),
// axios (pour effectuer des requêtes HTTP) 
// useNavigate (pour naviguer entre les pages)
function Login() {
  //pour gérer l'état local de l'email, du mot de passe et du message d'erreur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  //useNavigate pour accéder à la fonction de navigation
  const navigate = useNavigate();
  //requête POST à l'API pour se connecter 
  //avec l'email et le mot de passe fournis. Si la requête réussit, 
  //j'ai stocker le nom d'utilisateur, l'email et le jeton 
  //d'authentification dans le localStorage et naviguons vers 
  //la page d'accueil. Si la requête échoue, nous affichons 
  //un message d'erreur.
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });
      setMessage(response.data.message);
      const { username, email: userEmail, token } = response.data;
      localStorage.setItem('username', username);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Error logging in. Please try again.');
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <div>
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
        <button onClick={handleLogin}>Login</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Login;
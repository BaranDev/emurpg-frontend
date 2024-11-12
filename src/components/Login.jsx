import React, { useState } from 'react';
import { sha256 } from 'js-sha256';
import config from '../config';
import Navbar from './Navbar';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [backendUrl] = useState(config.backendUrl); //http://localhost:8000 or https://api.emurpg.com
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const hashedPassword = sha256(password);

      const response = await fetch(`${backendUrl}/api/admin/checkcredentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ username, hashedPassword }),
      });

      const result = await response.json();

      if (response.ok && result.message === 'Credentials are correct') {
        const expirationTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now
        localStorage.setItem('login', JSON.stringify({ username, expirationTime }));
        localStorage.setItem('apiKey', JSON.stringify({ apiKey }));
        onLogin();
      } else {
        setErrorMessage('Invalid credentials or API key');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="h-screen flex items-center justify-center w-screen px-5">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex items-center justify-center">
          <button
            className={`bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
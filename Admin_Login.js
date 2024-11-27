import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/Admin_Login.css";

const LoginPage = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Fetch admin data from db.json
      const response = await fetch('http://localhost:3500/users'); // Update to your actual db.json endpoint
      if (!response.ok) throw new Error('Failed to fetch user data');

      const users = await response.json();

      // Check if the entered credentials match any user in db.json
      const userExists = users.some(
        (user) => user.adminId === adminId && user.password === password
      );

      if (userExists) {
        // Prepare the login data
        const loginData = {
          adminId,
          password,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        };

        // Save login data to login_user.json
        const loginResponse = await fetch('http://localhost:3600/login-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        if (!loginResponse.ok) throw new Error('Failed to log the login data');

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid Admin ID or Password. Please re-check.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="adminId">Admin ID</label>
          <input
            type="text"
            id="adminId"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} className="link">
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

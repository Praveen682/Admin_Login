import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/Admin_Signup.css";

const SignupPage = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State to show success message
  const [users, setUsers] = useState([]); // State to store fetched users
  const navigate = useNavigate();

  // Fetch users from the server when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3500/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Check if adminId already exists
    const existingUser = users.find(user => user.adminId === adminId);
    if (existingUser) {
      setError('Admin ID already exists. Please choose another.');
      return;
    }

    // Prepare new user object with date and time
    const newUser = {
      adminId,
      password,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    try {
      // Post the new user to the server
      const response = await fetch('http://localhost:3500/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setError('');
        setSuccess('Signed up successfully! Redirecting to login page...');
        console.log('User added successfully:', newUser);

        // Optionally, update the local users state with the new user
        setUsers(prevUsers => [...prevUsers, newUser]);

        // Redirect to the login page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('Failed to sign up. Please try again.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('An error occurred while signing up. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Sign Up</h2>
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
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" className="btn">Sign Up</button>
        <p>
          Already have an account? <span onClick={() => navigate('/')} className="link">Login</span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
  
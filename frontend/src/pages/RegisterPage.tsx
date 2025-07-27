import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import FontAwesome icons

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prev) => !prev);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role: 3 }), // Default role: student (3)
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Registration Successful!', {
        position: 'top-center',
        autoClose: 5000,
        icon: <i className="fas fa-check-circle text-green-500"></i>,
      });
      navigate('/login'); // Redirect to login after successful registration
    } else {
      setError(data.message || 'Registration failed');
      toast.error('Registration Failed!', {
        position: 'top-center',
        autoClose: 5000,
        icon: <i className="fas fa-times-circle text-red-500"></i>,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1 className="h4 font-weight-bold text-primary">AppName</h1>
          <p className="text-muted">Create a new account</p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="username" className="form-label text-dark">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="form-label text-dark">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-dark">Password</label>
            <div className="input-group">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="btn btn-outline-secondary"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label text-dark">Confirm Password</label>
            <div className="input-group">
              <input
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-control"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="btn btn-outline-secondary"
              >
                {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 mt-4">
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted">
            Already have an account?{' '}
            <a href="/login" className="text-primary">
              Log in here
            </a>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RegisterPage;

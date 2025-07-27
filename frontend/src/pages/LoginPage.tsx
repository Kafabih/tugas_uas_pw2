import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/main');
    }
  }, [navigate]);

  // Email validation regex
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Password validation - minimum 8 characters
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email and password validation
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email!');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }

    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Response:', data); // Log the response

    if (response.ok) {
      localStorage.setItem('token', data.token); // Store JWT token
      localStorage.setItem('role', data.role); // Store JWT token
      localStorage.setItem('username', data.username); // Store JWT token
      
      toast.success("Login Successful!", {
        position: "top-center",
        autoClose: 5000,
        icon: <i className="fas fa-check-circle text-green-500"></i>,  // Font Awesome success icon
      });
      navigate('/main'); // Redirect to dashboard
    } else {
      setError(data.message || 'Login failed');
      toast.error("Login Failed!", {
        position: "top-center",
        autoClose: 5000,
        icon: <i className="fas fa-times-circle text-red-500"></i>,  // Font Awesome error icon
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1 className="h4 font-weight-bold text-primary">AppName</h1>
          <p className="text-muted">Please log in to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
              <button
                type="button"
                className="input-group-text"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 mt-4">
            Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted">
            Don't have an account?{' '}
            <a href="/register" className="text-primary">
              Register now
            </a>
          </p>
        </div>
      </div>

      {/* Add ToastContainer here */}
      <ToastContainer />
    </div>
  );
};

export default Login;

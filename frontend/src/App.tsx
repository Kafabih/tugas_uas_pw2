import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import Dashboardpage from './pages/dashboardPage';
import CreatePostPage from './pages/createPostPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to main page */}
        <Route path="/" element={<Navigate to="/main" replace />} />
        
        {/* Main page accessible to everyone */}
        <Route path="/main" element={<MainPage />} />
        
        {/* Login and Register pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboardpage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-post" 
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

// Protected route component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
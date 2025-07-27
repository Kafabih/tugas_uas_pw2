import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment, faBook, faPlus,
  faArrowRight, faPaperPlane, faUser,
  faFilePdf, faFileWord, faFileExcel,
  faFileImage, faFileAlt, faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [userRole, setUserRole] = useState(3);
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPostingEnabled, setIsPostingEnabled] = useState<boolean>(false);
  const [literature, setLiterature] = useState<any[]>([]);
  const [comments, setComments] = useState<{ [key: number]: any[] }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [userMap, setUserMap] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');

    if (token) {
      setIsAuthenticated(true);

      if (storedRole) {
        const role = parseInt(storedRole);
        setUserRole(role);
        if (role === 1 || role === 2) {
          setIsPostingEnabled(true);
        }
      }

      setUsername(storedUsername || 'User');
      setUserId(parseInt(storedUserId || '0'));

      // Fetch data for authenticated users
      fetchLiterature();
      fetchUsers();
    } else {
      // Guests can still view literature
      fetchLiterature();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 401) {
        localStorage.clear();
        setIsAuthenticated(false);
        return;
      }

      const data = await response.json();

      // Create a user map for quick lookup
      const map: { [key: number]: string } = {};
      data.forEach((user: any) => {
        map[user.id] = user.username;
      });

      setUserMap(map);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchLiterature = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/literature/get_all');

      if (response.status === 401) {
        // Handle unauthorized access gracefully
        return;
      }

      const data = await response.json();
      setLiterature(data);

      // Initialize comments
      const commentsObj: { [key: number]: any[] } = {};
      data.forEach((lit: any) => {
        commentsObj[lit.id] = [];
        // if (isAuthenticated) {
        fetchComments(lit.id);
        // }
      });

      setComments(commentsObj);
    } catch (error) {
      toast.error('Failed to fetch literature');
    }
  };

  const fetchComments = async (literatureId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/comments/get_comment_literature/${literatureId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const data = await response.json();

        // Map user_id to username using our userMap
        const commentsWithUsernames = data.map((comment: any) => ({
          ...comment,
          username: comment.username || "User"
        }));

        setComments(prev => ({ ...prev, [literatureId]: commentsWithUsernames }));
      }
    } catch (error) {
      toast.error('Failed to fetch comments');
    }
  };

  const handlePostLiterature = () => {
    if (isPostingEnabled) {
      navigate('/create-post');
    } else {
      toast.error('You do not have permission to post literature');
    }
  };

  const handlePostComment = async (literatureId: number) => {
    const commentText = newComment[literatureId]?.trim();
    if (!commentText) return;

    try {
      const response = await fetch('http://localhost:8000/api/comments/create_comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          literature_id: literatureId,
          comment: commentText,
          username: username
        })
      });

      if (response.ok) {
        toast.success('Comment posted successfully');
        setNewComment(prev => ({ ...prev, [literatureId]: '' }));
        fetchComments(literatureId);
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      toast.error('Error posting comment');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setIsPostingEnabled(false);
    setUsername('');
    setUserId(0);
    toast.success('Logged out successfully');
    navigate('/main');
  };

  const getFileIcon = (fileUrl: string) => {
    if (!fileUrl) return faFileAlt;

    const extension = fileUrl.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf': return faFilePdf;
      case 'doc': case 'docx': return faFileWord;
      case 'xls': case 'xlsx': return faFileExcel;
      case 'jpg': case 'jpeg': case 'png': case 'gif': return faFileImage;
      default: return faFileAlt;
    }
  };

  const getFileName = (fileUrl: string) => {
    if (!fileUrl) return 'Document';
    return fileUrl.split('/').pop() || 'Document';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container-fluid px-0 bg-light min-vh-100">
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center py-3 bg-primary text-white w-100 shadow-sm">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            {/* Left side */}
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faBook} className="fs-4 me-2" />
              <h1 className="h4 mb-0 me-3">LitHub</h1>
              {isAuthenticated && (
                <span className="d-none d-md-block">Hello, {username}</span>
              )}
            </div>

            {/* Right side */}
            <div>
              {isAuthenticated ? (
                <>
                  {userRole === 1 && (
                    <button
                      className="btn btn-light me-2"
                      onClick={() => navigate('/dashboard')}
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-outline-light"
                  onClick={handleLogin}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12 col-lg-8">
            {/* Post Section - Only visible for authenticated users with permission */}
            {isAuthenticated && isPostingEnabled && (
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Create New Literature</h5>
                    <button
                      className="btn btn-primary d-flex align-items-center"
                      onClick={handlePostLiterature}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Post Literature
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Literature List */}
            <div className="mb-4">
              <h3 className="mb-4 border-bottom pb-2">Latest Literature</h3>
              {literature.length === 0 ? (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faBook} size="3x" className="text-muted mb-3" />
                  <h4>No literature available</h4>
                  <p className="text-muted">Check back later for new posts</p>
                </div>
              ) : (
                literature.map((lit) => (
                  <div key={lit.id} className="card mb-4 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title">{lit.title}</h5>
                          <p className="text-muted small">
                            By {lit.created_by_name} • {formatDate(lit.created_at)}
                          </p>
                        </div>
                      </div>

                      <p className="card-text mt-3">{lit.description}</p>

                      {/* File Attachment Card */}
                      {lit.file_url && (
                        <div className="card border-0 bg-light mt-3">
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary p-3 rounded-circle me-3">
                                <FontAwesomeIcon
                                  icon={getFileIcon(lit.file_url)}
                                  className="text-white fs-4"
                                />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">Attached File</h6>
                                <p className="mb-0 text-truncate" style={{ maxWidth: '300px' }}>
                                  {getFileName(lit.file_url)}
                                </p>
                              </div>
                              <div>
                                <a
                                  href={lit.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary"
                                >
                                  View File
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Comment Count */}
                      <div className="d-flex gap-3 mt-3">
                        <button className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                          <FontAwesomeIcon icon={faComment} className="me-1" />
                          {comments[lit.id]?.length || 0} comments
                        </button>
                      </div>
                    </div>

                    {/* Comment Section */}
                    <div className="card-footer bg-white">
                      <div className="mb-3">
                        <h6 className="mb-3">Comments</h6>

                        {/* Comments list */}
                        {comments[lit.id]?.length > 0 ? (
                          <div className="mb-3">
                            {comments[lit.id].map((comment) => (
                              <div key={comment.id} className="mb-3">
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <div
                                      className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                      style={{ width: '36px', height: '36px' }}
                                    >
                                      {/* Option 1: Keep the user icon */}
                                      <FontAwesomeIcon icon={faUser} />

                                      {/* Option 2: Use username initial instead (uncomment if you prefer) */}
                                      {/* {comment.username ? comment.username.charAt(0).toUpperCase() : 'U'} */}
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between">
                                      {/* Fix: Show full username or "Unknown" */}
                                      <h6 className="mb-0">{comment.username || 'Unknown'}</h6>
                                      <small className="text-muted">{formatDate(comment.created_at)}</small>
                                    </div>
                                    <p className="mb-0">{comment.comment}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted">No comments yet.</p>
                        )}

                        {/* Add comment form - Only for authenticated users */}
                        {isAuthenticated ? (
                          <div className="d-flex mt-3">
                            <input
                              type="text"
                              className="form-control me-2"
                              placeholder="Add a comment..."
                              value={newComment[lit.id] || ''}
                              onChange={(e) => setNewComment(prev => ({
                                ...prev,
                                [lit.id]: e.target.value
                              }))}
                              onKeyPress={(e) => e.key === 'Enter' && handlePostComment(lit.id)}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => handlePostComment(lit.id)}
                              disabled={!newComment[lit.id]?.trim()}
                            >
                              <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                          </div>
                        ) : (
                          <div className="alert alert-info mt-3">
                            <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                            Please <button className="btn btn-link p-0" onClick={handleLogin}>login</button> to comment
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center">
                  <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
                  Quick Actions
                </h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center py-3">
                    <FontAwesomeIcon icon={faArrowRight} className="me-3 text-muted" />
                    <span>Browse Literature</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center py-3">
                    <FontAwesomeIcon icon={faArrowRight} className="me-3 text-muted" />
                    <span>Your Reading List</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center py-3">
                    <FontAwesomeIcon icon={faArrowRight} className="me-3 text-muted" />
                    <span>Popular Topics</span>
                  </li>
                </ul>
              </div>
            </div>

            {isAuthenticated && Object.keys(userMap).length > 0 && (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Recent Commenters</h5>
                  {Object.values(userMap).slice(0, 5).map((username, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                        style={{ width: '40px', height: '40px' }}>
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div>
                        <h6 className="mb-0">{username}</h6>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Home;
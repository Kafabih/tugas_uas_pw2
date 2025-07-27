import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LiteratureManagement from './dashboard/literature';
import UserManagement from './dashboard/user';
import CommentsManagement from './dashboard/comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt, faTachometerAlt, faUsers, faBook,
  faComments, faCog, faArrowLeft, faChartBar, faHome
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button, Form, Badge, Card } from 'react-bootstrap';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [literature, setLiterature] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedLiterature, setSelectedLiterature] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showLitModal, setShowLitModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState('');

  // Form states
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 3
  });

  const [litFormData, setLitFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    approved: 0 // 0 means pending, 1 means approved
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Fetch initial data for dashboard
      fetchUsers();
      fetchLiterature();
      fetchComments();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.status === 401) {
        toast.error('Invalid token');
        handleInvalidToken();
        return;
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchLiterature = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/literature/all', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.status === 401) {
        toast.error('Invalid token');
        handleInvalidToken();
        return;
      }
      const data = await response.json();
      setLiterature(data);
    } catch (error) {
      toast.error('Failed to fetch literature');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/comments/get_all', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.status === 401) {
        toast.error('Invalid token');
        handleInvalidToken();
        return;
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      toast.error('Failed to fetch comments');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleGoToMain = () => {
    navigate('/main');
  };

  const handleOpenUserModal = (user: any = null) => {
    if (user) {
      setUserFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role
      });
      setSelectedUser(user);
    } else {
      setUserFormData({ username: '', email: '', password: '', role: 3 });
      setSelectedUser(null);
    }
    setShowUserModal(true);
  };

  const handleOpenLitModal = (lit: any = null) => {
    if (lit) {
      setLitFormData({
        title: lit.title,
        description: lit.description,
        file_url: lit.file_url,
        approved: lit.approved
      });
      setSelectedLiterature(lit); // CRITICAL FIX: Set selected literature
    } else {
      setLitFormData({ title: '', description: '', file_url: '', approved: 0 });
      setSelectedLiterature(null);
    }
    setShowLitModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setUserFormData({ username: '', email: '', password: '', role: 3 });
    setSelectedUser(null);
  };

  const handleCloseLitModal = () => {
    setShowLitModal(false);
    setLitFormData({ title: '', description: '', file_url: '', approved: 0 });
    setSelectedLiterature(null);
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a new object without 'password' if updating and password is empty
      const dataToSend = selectedUser && !userFormData.password
        ? {
          username: userFormData.username,
          email: userFormData.email,
          role: userFormData.role
        }
        : { ...userFormData };

      const response = await fetch(
        selectedUser
          ? `http://localhost:8000/api/users/${selectedUser.id}`
          : 'http://localhost:8000/api/users/register',
        {
          method: selectedUser ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(dataToSend)
        }
      );

      if (response.ok) {
        fetchUsers();
        toast.success(selectedUser ? 'User updated successfully!' : 'User added successfully!');
        handleCloseUserModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save user!');
      }
    } catch (error) {
      toast.error('Error saving user');
    }
  };

  const handleLitFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        selectedLiterature
          ? `http://localhost:8000/api/literature/edit/${selectedLiterature.id}`
          : 'http://localhost:8000/api/literature',
        {
          method: selectedLiterature ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(litFormData)
        }
      );

      if (response.ok) {
        fetchLiterature();
        toast.success(selectedLiterature ? 'Literature updated successfully!' : 'Literature added successfully!');
        handleCloseLitModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save literature!');
      }
    } catch (error) {
      toast.error('Error saving literature');
    }
  };

  const confirmDelete = (item: any, type: string) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      let endpoint = '';
      switch (deleteType) {
        case 'user':
          endpoint = `http://localhost:8000/api/users/${itemToDelete.id}`;
          break;
        case 'literature':
          endpoint = `http://localhost:8000/api/literature/${itemToDelete.id}`;
          break;
        case 'comment':
          endpoint = `http://localhost:8000/api/comments/delete_comment/${itemToDelete.id}`;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        switch (deleteType) {
          case 'user':
            fetchUsers();
            break;
          case 'literature':
            fetchLiterature();
            break;
          case 'comment':
            fetchComments();
            break;
        }
        toast.success(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully!`);
      } else {
        toast.error(`Failed to delete ${deleteType}.`);
      }
    } catch (error) {
      toast.error(`Error deleting ${deleteType}`);
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const getRoleBadge = (role: number) => {
    const roleMap: any = {
      1: { text: 'Super Admin', variant: 'danger' },
      2: { text: 'Teacher', variant: 'primary' },
      3: { text: 'Student', variant: 'success' }
    };

    const roleInfo = roleMap[role] || { text: 'Unknown', variant: 'secondary' };
    return <Badge bg={roleInfo.variant} className="fs-6 py-2 px-3">{roleInfo.text}</Badge>;
  };

  // Fixed: Accepts number instead of boolean
  const getApprovalBadge = (approved: number) => {
    return approved === 1 ? ( // Check against number 1
      <Badge bg="success" className="d-flex align-items-center fs-6 py-2">
        Approved
      </Badge>
    ) : (
      <Badge bg="warning" className="d-flex align-items-center fs-6 py-2">
        Pending
      </Badge>
    );
  };

  // Mock dashboard stats
  const dashboardStats = [
    { title: 'Total Users', value: users.length, icon: faUsers, color: 'primary' },
    { title: 'Literature Items', value: literature.length, icon: faBook, color: 'success' },
    {
      title: 'Pending Literature',
      value: literature.filter((c: any) => c.approved !== 1).length, // Fixed: Use !== 1
      icon: faBook,
      color: 'warning'
    },
    { title: 'Active Today', value: '16', icon: faChartBar, color: 'info' },
  ];

  const handleInvalidToken = () => {
    // Clear all local storage data and redirect to login
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="sidebar p-3 bg-dark text-white" style={{ width: '250px' }}>
        <div className="d-flex align-items-center mb-4">
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <FontAwesomeIcon icon={faTachometerAlt} className="fs-5" />
          </div>
          <h4 className="ms-3 mb-0">LitManager</h4>
        </div>

        <ul className="list-unstyled">
          <li className="mb-2">
            <button
              className={`w-100 text-start d-flex align-items-center p-2 rounded text-decoration-none ${activeTab === 'dashboard'
                  ? 'bg-primary text-white'
                  : 'text-white bg-transparent opacity-75 hover-opacity-100 hover-bg-gray'
                }`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="me-3" /> Dashboard
            </button>
          </li>
          <li className="mb-2">
            <button
              className={`w-100 text-start d-flex align-items-center p-2 rounded text-decoration-none ${activeTab === 'literature'
                  ? 'bg-primary text-white'
                  : 'text-white bg-transparent opacity-75 hover-opacity-100 hover-bg-gray'
                }`}
              onClick={() => setActiveTab('literature')}
            >
              <FontAwesomeIcon icon={faBook} className="me-3" /> Manage Literature
            </button>
          </li>
          <li className="mb-2">
            <button
              className={`w-100 text-start d-flex align-items-center p-2 rounded text-decoration-none ${activeTab === 'users'
                  ? 'bg-primary text-white'
                  : 'text-white bg-transparent opacity-75 hover-opacity-100 hover-bg-gray'
                }`}
              onClick={() => setActiveTab('users')}
            >
              <FontAwesomeIcon icon={faUsers} className="me-3" /> Manage Users
            </button>
          </li>
          <li className="mb-2">
            <button
              className={`w-100 text-start d-flex align-items-center p-2 rounded text-decoration-none ${activeTab === 'comments'
                  ? 'bg-primary text-white'
                  : 'text-white bg-transparent opacity-75 hover-opacity-100 hover-bg-gray'
                }`}
              onClick={() => setActiveTab('comments')}
            >
              <FontAwesomeIcon icon={faComments} className="me-3" /> Manage Comments
            </button>
          </li>
        </ul>

        <div className="mt-auto">
          <button
            onClick={handleGoToMain}
            className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center mb-2"
          >
            <FontAwesomeIcon icon={faHome} className="me-2" /> Back to Main Page
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content p-4 bg-light" style={{ flex: 1 }}>
        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'literature' && 'Literature Management'}
              {activeTab === 'comments' && 'Comments Management'}
            </h2>
            <p className="text-muted mb-0">
              {activeTab === 'dashboard' && 'Overview of your literature system'}
              {activeTab === 'users' && 'Manage all system users'}
              {activeTab === 'literature' && 'Manage literary resources'}
              {activeTab === 'comments' && 'Manage user comments'}
            </p>
          </div>
          <div className="d-flex">
            {activeTab !== 'dashboard' && (
              <button
                className="btn btn-outline-primary me-2 d-flex align-items-center"
                onClick={() => setActiveTab('dashboard')}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to Dashboard
              </button>
            )}
            {activeTab === 'users' && (
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={() => handleOpenUserModal()}
              >
                Add User
              </button>
            )}
            {activeTab === 'literature' && (
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={() => handleOpenLitModal()}
              >
                Add Literature
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="row mb-4">
              {dashboardStats.map((stat, index) => (
                <div className="col-md-3 col-sm-6 mb-3" key={index}>
                  <Card className={`border-0 bg-${stat.color}-subtle shadow-sm h-100`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="text-muted">{stat.title}</h5>
                          <h2 className="mb-0">{stat.value}</h2>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="row mb-4">
              <div className="col-12">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Quick Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex gap-3">
                      <Button
                        variant="primary"
                        className="d-flex flex-column align-items-center py-3 px-4"
                        onClick={() => setActiveTab('users')}
                      >
                        <FontAwesomeIcon icon={faUsers} size="2x" className="mb-2" />
                        <span>Manage Users</span>
                      </Button>
                      <Button
                        variant="success"
                        className="d-flex flex-column align-items-center py-3 px-4"
                        onClick={() => setActiveTab('literature')}
                      >
                        <FontAwesomeIcon icon={faBook} size="2x" className="mb-2" />
                        <span>Manage Literature</span>
                      </Button>
                      <Button
                        variant="info"
                        className="d-flex flex-column align-items-center py-3 px-4"
                        onClick={() => setActiveTab('comments')}
                      >
                        <FontAwesomeIcon icon={faComments} size="2x" className="mb-2" />
                        <span>Manage Comments</span>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Recent Literature</h5>
                  </Card.Header>
                  <Card.Body>
                    {literature.slice(0, 5).map((lit: any) => (
                      <div key={lit.id} className="border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-1">{lit.title}</h6>
                          {getApprovalBadge(lit.approved)} {/* Pass number directly */}
                        </div>
                        <p className="text-muted mb-1">{lit.description?.substring(0, 80)}...</p>
                        <small className="text-muted">Uploaded: {new Date(lit.created_at).toLocaleDateString()}</small>
                      </div>
                    ))}
                    <Button variant="outline-primary" onClick={() => setActiveTab('literature')}>
                      View All Literature
                    </Button>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-6 mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Recent Comments</h5>
                  </Card.Header>
                  <Card.Body>
                    {comments.slice(0, 5).map((comment: any) => (
                      <div key={comment.id} className="border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-1">Comment on Literature #{comment.literature_id}</h6>
                          <Badge bg="info">By User #{comment.user_id}</Badge>
                        </div>
                        <p className="mb-1">{comment.comment?.substring(0, 100)}...</p>
                        <small className="text-muted">Posted: {new Date(comment.created_at).toLocaleDateString()}</small>
                      </div>
                    ))}
                    <Button variant="outline-primary" onClick={() => setActiveTab('comments')}>
                      View All Comments
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Management Sections */}
        {activeTab === 'users' && (
          <UserManagement
            users={users}
            handleOpenUserModal={handleOpenUserModal}
            confirmDelete={confirmDelete}
            getRoleBadge={getRoleBadge}
          />
        )}

        {activeTab === 'literature' && (
          <LiteratureManagement
            literature={literature}
            handleOpenLitModal={handleOpenLitModal}
            confirmDelete={confirmDelete}
            getApprovalBadge={getApprovalBadge}
          />
        )}

        {activeTab === 'comments' && (
          <CommentsManagement
            comments={comments}
            confirmDelete={confirmDelete}
          />
        )}
      </div>

      {/* Add/Edit User Modal */}
      <Modal show={showUserModal} onHide={handleCloseUserModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>{selectedUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={userFormData.username}
                onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                required
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                required
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Password {selectedUser && <span className="text-muted">(Leave blank to keep current)</span>}
              </Form.Label>
              <Form.Control
                type="password"
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                required={!selectedUser}
                placeholder="Enter password"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={userFormData.role}
                onChange={(e) => setUserFormData({ ...userFormData, role: parseInt(e.target.value) })}
              >
                <option value={1}>Super Admin</option>
                <option value={2}>Teacher</option>
                <option value={3}>Student</option>
              </Form.Control>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="outline-secondary" onClick={handleCloseUserModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add/Edit Literature Modal */}
      <Modal show={showLitModal} onHide={handleCloseLitModal} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>{selectedLiterature ? 'Edit Literature' : 'Add New Literature'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLitFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={litFormData.title}
                onChange={(e) => setLitFormData({ ...litFormData, title: e.target.value })}
                required
                placeholder="Enter title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={litFormData.description}
                onChange={(e) => setLitFormData({ ...litFormData, description: e.target.value })}
                required
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File URL</Form.Label>
              <Form.Control
                type="text"
                value={litFormData.file_url}
                onChange={(e) => setLitFormData({ ...litFormData, file_url: e.target.value })}
                placeholder="Enter file URL"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Check
                type="switch"
                id="approval-switch"
                label="Approved"
                checked={litFormData.approved === 1} // Fixed: Compare to number 1
                onChange={(e) => setLitFormData({
                  ...litFormData,
                  approved: e.target.checked ? 1 : 0 // Set to 1 or 0
                })}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="outline-secondary" onClick={handleCloseLitModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedLiterature ? 'Update Literature' : 'Create Literature'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this {deleteType}?</p>
          <p className="fw-medium">
            {deleteType === 'user' && itemToDelete?.username}
            {deleteType === 'literature' && itemToDelete?.title}
            {deleteType === 'comment' && `Comment #${itemToDelete?.id}`}
          </p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteItem}>
            Delete {deleteType.charAt(0).toUpperCase() + deleteType.slice(1)}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
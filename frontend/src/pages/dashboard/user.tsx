import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const UserManagement = ({ users, handleOpenUserModal, confirmDelete, getRoleBadge }: any) => {
  return (
    <div className="border-0 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded">
        <h5 className="mb-0">User Management</h5>
        <div>
          <input 
            type="text" 
            className="form-control me-2 d-inline-block" 
            placeholder="Search users..."
            style={{ width: '200px' }}
          />
          <Button variant="success" onClick={() => handleOpenUserModal()}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add User
          </Button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" style={{ width: '36px', height: '36px' }}>
                      {user.username.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-medium">{user.username}</div>
                      <small className="text-muted">ID: {user.id}</small>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleOpenUserModal(user)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => confirmDelete(user, 'user')}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const LiteratureManagement = ({ literature, handleOpenLitModal, confirmDelete, getApprovalBadge }: any) => {
  return (
    <div className="border-0 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded">
        <h5 className="mb-0">Literature Management</h5>
        <div>
          <input 
            type="text" 
            className="form-control me-2 d-inline-block" 
            placeholder="Search literature..."
            style={{ width: '200px' }}
          />
          <Button variant="success" onClick={() => handleOpenLitModal()}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Literature
          </Button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {literature.map((lit: any) => (
              <tr key={lit.id}>
                <td className="fw-medium">{lit.title}</td>
                <td>{lit.description?.substring(0, 80)}...</td>
                <td>{getApprovalBadge(lit.approved)}</td>
                <td>{new Date(lit.created_at).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleOpenLitModal(lit)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => confirmDelete(lit, 'literature')}
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

export default LiteratureManagement;
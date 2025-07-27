import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const CommentsManagement = ({ comments, confirmDelete }: any) => {
  return (
    <div className="border-0 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded">
        <h5 className="mb-0">Comments Management</h5>
        <div>
          <input 
            type="text" 
            className="form-control me-2 d-inline-block" 
            placeholder="Search comments..."
            style={{ width: '200px' }}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Comment</th>
              <th>Literature</th>
              <th>User</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment: any) => (
              <tr key={comment.id}>
                <td>{comment.comment?.substring(0, 80)}...</td>
                <td className="fw-medium">Literature #{comment.literature_id}</td>
                <td>User #{comment.user_id}</td>
                <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => confirmDelete(comment, 'comment')}
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

export default CommentsManagement;
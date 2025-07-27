// src/pages/CreatePostPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/literature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Literature created successfully!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create literature');
      }
    } catch (error) {
      toast.error('Error creating literature');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Top Bar */}
      <div className="bg-primary text-white py-3 shadow-sm">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button variant="light" onClick={() => navigate('/')} className="me-3">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back
              </Button>
              <h1 className="h3 d-inline-block mb-0">Create New Literature</h1>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter literature title"
                      className="py-3"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Enter literature description"
                      className="py-3"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>File URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="file_url"
                      value={formData.file_url}
                      onChange={handleChange}
                      placeholder="Enter file URL (e.g., https://example.com/document.pdf)"
                      className="py-3"
                    />
                    <Form.Text className="text-muted">
                      Provide a direct link to your document (PDF, DOC, etc.)
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end mt-5">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-4 py-2"
                    >
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      {isSubmitting ? 'Creating...' : 'Create Literature'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CreatePostPage;
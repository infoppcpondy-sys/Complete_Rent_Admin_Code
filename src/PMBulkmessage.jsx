import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, ProgressBar, Modal, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './PMBulkMessage.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5005";

const PMBulkmessage = ({ onClose, onSent }) => {
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [uploadMethod, setUploadMethod] = useState('manual'); // manual or csv
  const [csvFile, setCsvFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);
  const [parsedNumbers, setParsedNumbers] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const parsePhoneNumbers = (input) => {
    // Split by comma, newline, space
    const numbers = input
      .split(/[\n,;\s]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0)
      .filter(num => /^[\d+\-\s()]{7,}$/.test(num)); // Basic validation

    return [...new Set(numbers)]; // Remove duplicates
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    setPhoneNumbers(input);
    const parsed = parsePhoneNumbers(input);
    setParsedNumbers(parsed);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n').slice(1); // Skip header
      const numbers = lines
        .map(line => {
          const columns = line.split(',');
          return columns[0]?.trim() || '';
        })
        .filter(num => num.length > 0)
        .filter(num => /^[\d+\-\s()]{7,}$/.test(num));

      const uniqueNumbers = [...new Set(numbers)];
      setParsedNumbers(uniqueNumbers);
      setPhoneNumbers(uniqueNumbers.join('\n'));
      toast.success(`${uniqueNumbers.length} phone numbers imported`);
    };

    reader.readAsText(file);
  };

  const validateForm = () => {
    if (!campaignName.trim()) {
      toast.error('Campaign name is required');
      return false;
    }
    if (!message.trim()) {
      toast.error('Message is required');
      return false;
    }
    if (parsedNumbers.length === 0) {
      toast.error('Please add at least one phone number');
      return false;
    }
    if (message.length > 4096) {
      toast.error('Message is too long (max 4096 characters)');
      return false;
    }
    return true;
  };

  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    } else if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (!phone.startsWith('+')) {
      return `+${cleaned}`;
    }

    return phone;
  };

  const handleSendBulk = async () => {
    if (!validateForm()) return;

    setSending(true);

    try {
      const formattedNumbers = parsedNumbers.map(formatPhoneNumber);

      const payload = {
        campaignName: campaignName.trim(),
        message: message.trim(),
        phoneNumbers: formattedNumbers,
        totalRecipients: formattedNumbers.length,
        sentBy: localStorage.getItem('pmEmail') || 'admin'
      };

      const response = await fetch(`${API_BASE}/PPC/send-bulk-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('pmToken')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Bulk campaign created! ${data.successCount || 0} messages sent`);
        setCampaignName('');
        setMessage('');
        setPhoneNumbers('');
        setParsedNumbers([]);
        setCsvFile(null);
        setShowPreview(false);

        if (onSent) {
          onSent();
        }
      } else {
        toast.error(data.message || 'Failed to send bulk messages');
      }
    } catch (error) {
      console.error('Error sending bulk message:', error);
      toast.error('An error occurred while sending messages');
    }

    setSending(false);
  };

  return (
    <Container fluid className="pm-bulk-message-container">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="bulk-sender-card">
            <Card.Header className="bulk-sender-header">
              <div className="header-content">
                <h3>📤 Send Bulk WhatsApp Messages</h3>
                <p>Send personalized messages to multiple recipients</p>
              </div>
              <Button 
                variant="outline-secondary" 
                className="close-btn"
                onClick={onClose}
              >
                ✕
              </Button>
            </Card.Header>

            <Card.Body className="bulk-sender-body">
              {/* Campaign Name */}
              <div className="form-section">
                <label className="form-label">Campaign Name</label>
                <Form.Control
                  type="text"
                  placeholder="e.g., January Promotion 2026"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="bulk-form-control"
                  disabled={sending}
                />
                <small className="form-hint">Give your campaign a meaningful name for tracking</small>
              </div>

              {/* Message */}
              <div className="form-section">
                <label className="form-label">Message</label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Type your message here... You can use {firstName}, {lastName}, {phone} for personalization"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bulk-form-control message-textarea"
                  disabled={sending}
                />
                <div className="character-counter">
                  {message.length} / 4096 characters
                </div>
                <small className="form-hint">
                  Max 4096 characters. Personalization: {`{firstName}, {lastName}, {phone}`}
                </small>
              </div>

              {/* Phone Numbers Upload */}
              <div className="form-section">
                <label className="form-label">Phone Numbers</label>

                {/* Upload Method Tabs */}
                <div className="upload-method-tabs">
                  <Button
                    variant={uploadMethod === 'manual' ? 'primary' : 'outline-secondary'}
                    onClick={() => setUploadMethod('manual')}
                    className="method-tab"
                    disabled={sending}
                  >
                    ✏️ Manual Entry
                  </Button>
                  <Button
                    variant={uploadMethod === 'csv' ? 'primary' : 'outline-secondary'}
                    onClick={() => setUploadMethod('csv')}
                    className="method-tab"
                    disabled={sending}
                  >
                    📄 CSV Upload
                  </Button>
                </div>

                {uploadMethod === 'manual' ? (
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Enter phone numbers&#10;Separate by comma, newline, or space&#10;Examples:&#10;+91 9876543210&#10;9876543210&#10;+919876543210"
                    value={phoneNumbers}
                    onChange={handlePhoneNumberChange}
                    className="bulk-form-control"
                    disabled={sending}
                  />
                ) : (
                  <div className="csv-upload-area">
                    <input
                      type="file"
                      accept=".csv"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      disabled={sending}
                    />
                    <Button
                      variant="outline-primary"
                      onClick={() => fileInputRef.current?.click()}
                      className="csv-upload-btn"
                      disabled={sending}
                    >
                      📁 Choose CSV File
                    </Button>
                    {csvFile && (
                      <div className="csv-file-info">
                        <p>✅ File: {csvFile.name}</p>
                        <p>Numbers: {parsedNumbers.length}</p>
                      </div>
                    )}
                    <p className="csv-hint">
                      CSV Format: phone_number (first column, one per row)
                    </p>
                  </div>
                )}

                <div className="numbers-counter">
                  📱 {parsedNumbers.length} phone number(s) added
                </div>
              </div>

              {/* Alerts */}
              {parsedNumbers.length > 0 && (
                <Alert variant="info">
                  ℹ️ You will send {parsedNumbers.length} message(s). This may take a few minutes.
                </Alert>
              )}

              {/* Preview Section */}
              <div className="form-section">
                <Button
                  variant="outline-info"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-100"
                  disabled={parsedNumbers.length === 0 || sending}
                >
                  {showPreview ? '🔽 Hide Preview' : '🔼 Show Preview'}
                </Button>

                {showPreview && (
                  <div className="preview-section">
                    <div className="preview-item">
                      <h6>Campaign Summary</h6>
                      <div className="preview-content">
                        <p><strong>Name:</strong> {campaignName || 'Not set'}</p>
                        <p><strong>Recipients:</strong> {parsedNumbers.length}</p>
                        <p><strong>Message Length:</strong> {message.length}/4096 characters</p>
                      </div>
                    </div>

                    <div className="preview-item">
                      <h6>First 3 Recipients</h6>
                      <div className="preview-content">
                        {parsedNumbers.slice(0, 3).map((num, idx) => (
                          <p key={idx}>{idx + 1}. {num}</p>
                        ))}
                        {parsedNumbers.length > 3 && (
                          <p className="text-muted">... and {parsedNumbers.length - 3} more</p>
                        )}
                      </div>
                    </div>

                    <div className="preview-item">
                      <h6>Message Preview</h6>
                      <div className="message-preview">
                        {message}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="action-btn"
                  disabled={sending}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={handleSendBulk}
                  className="action-btn send-btn"
                  disabled={
                    sending ||
                    !campaignName.trim() ||
                    !message.trim() ||
                    parsedNumbers.length === 0
                  }
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending...
                    </>
                  ) : (
                    '✉️ Send Bulk Message'
                  )}
                </Button>
              </div>

              {sending && (
                <div className="sending-progress">
                  <ProgressBar 
                    animated 
                    now={100} 
                    label="Processing your campaign..."
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* All Numbers Modal Preview */}
      <Modal show={showPreview && parsedNumbers.length > 3} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>All {parsedNumbers.length} Recipients</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="numbers-table-wrapper">
            <Table striped hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {parsedNumbers.map((num, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{num}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PMBulkmessage;

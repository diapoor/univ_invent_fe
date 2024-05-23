import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080/api/v1/lad";

const LossesAndDamageManagement = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reportData, setReportData] = useState({
    itemId: "",
    reportType: "",
    description: "",
    resolvedDate: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    reportId: "",
    itemId: "",
    reportType: "",
    description: "",
    resolvedDate: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState({
    show: false,
    type: "",
    content: "",
  });
  const reportTypeOptions = ["LOSS", "DAMAGED"];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowEditModal = (report) => {
    setEditData(report);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleAddReport = async () => {
    if (
      !reportData.itemId ||
      !reportData.reportType ||
      !reportData.description
    ) {
      showMessage("error", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/add`, reportData);
      fetchReports();
      handleCloseModal();
      showMessage("success", "Report added successfully!");
    } catch (error) {
      showMessage("error", error.response.data);
    }
  };

  const handleUpdateReport = async () => {
    if (!editData.itemId || !editData.reportType || !editData.description) {
      showMessage("error", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/update`, editData);
      fetchReports();
      handleCloseEditModal();
      showMessage("success", "Report updated successfully!");
    } catch (error) {
      showMessage("error", error.response.data);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${reportId}`);
      fetchReports();
      showMessage("success", "Report deleted successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the report";
      showMessage("error", errorMessage);
    }
  };

  const filteredReports = reports.filter((report) =>
    report.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const showMessage = (type, content) => {
    setMessage({ show: true, type, content });
    setTimeout(() => {
      setMessage({ ...message, show: false });
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Losses and Damage Management</h1>
      <div className="mb-3">
        <FormControl
          type="text"
          placeholder="Search by description..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <Button variant="primary" onClick={handleShowModal}>
        Add Report
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Item ID</th>
            <th>Report Type</th>
            <th>Description</th>
            <th>Resolved Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.reportId}>
              <td>{report.reportId}</td>
              <td>{report.itemId}</td>
              <td>{report.reportType}</td>
              <td>{report.description}</td>
              <td>{report.resolvedDate || "-"}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowEditModal(report)}>
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteReport(report.reportId)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="formItemID">
                  <Form.Label>Item ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter item ID"
                    name="itemId"
                    value={reportData.itemId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formReportType">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="reportType"
                    value={reportData.reportType}
                    onChange={handleChange}>
                    <option value="">Select report type</option>
                    {reportTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    name="description"
                    value={reportData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formResolvedDate">
                  <Form.Label>Resolved Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="resolvedDate"
                    value={reportData.resolvedDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddReport}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="formItemID">
                  <Form.Label>Item ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter item ID"
                    name="itemId"
                    value={editData.itemId}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formReportType">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="reportType"
                    value={editData.reportType}
                    onChange={handleEditChange}>
                    <option value="">Select report type</option>
                    {reportTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formResolvedDate">
                  <Form.Label>Resolved Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="resolvedDate"
                    value={editData.resolvedDate}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateReport}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={message.show}
        onHide={() => setMessage({ ...message, show: false })}
        centered>
        <Modal.Body
          className={`text-${
            message.type === "success" ? "success" : "danger"
          }`}>
          {message.type === "success" ? (
            <FaCheckCircle className="mr-2" />
          ) : (
            <FaExclamationCircle className="mr-2" />
          )}
          {message.content}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LossesAndDamageManagement;

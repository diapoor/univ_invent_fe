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
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api/v1/maintenance";

const MaintenanceManagement = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [maintenances, setMaintenances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState({
    itemId: "",
    issueDescription: "",
    reportedDate: new Date().toISOString().slice(0, 10),
    resolvedDate: "",
    status: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    itemId: "",
    issueDescription: "",
    reportedDate: "",
    resolvedDate: "",
    status: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState({
    show: false,
    type: "",
    content: "",
  });
  const statusOptions = ["PENDING", "RESOLVED", "IN_PROGRESS"];

  useEffect(() => {
    const storedExpiryTime = parseInt(localStorage.getItem("expiryTime"));
    const now = new Date().getTime();

    if (!isLoggedIn || !storedExpiryTime || now >= storedExpiryTime) {
      navigate("/auth/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const fetchMaintenances = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`);
      setMaintenances(response.data);
    } catch (error) {
      console.error("Error fetching maintenances:", error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowEditModal = (maintenance) => {
    setEditData(maintenance);
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
    setMaintenanceData({ ...maintenanceData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleAddMaintenance = async () => {
    if (
      !maintenanceData.itemId ||
      !maintenanceData.issueDescription ||
      !maintenanceData.reportedDate ||
      !maintenanceData.status
    ) {
      showMessage("error", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/add`, maintenanceData);
      fetchMaintenances();
      handleCloseModal();
      showMessage("success", "Maintenance added successfully!");
    } catch (error) {
      showMessage("error", error.response.data);
    }
  };

  const handleUpdateMaintenance = async () => {
    if (
      !editData.itemId ||
      !editData.issueDescription ||
      !editData.reportedDate ||
      !editData.status
    ) {
      showMessage("error", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${editData.maintenanceId}`,
        editData
      );
      fetchMaintenances();
      handleCloseEditModal();
      showMessage("success", "Maintenance updated successfully!");
    } catch (error) {
      showMessage("error", error.response.data);
    }
  };

  const handleDeleteMaintenance = async (maintenanceId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete/${maintenanceId}`
      );
      fetchMaintenances();
      showMessage("success", "Maintenance deleted successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting maintenance";
      showMessage("error", errorMessage);
    }
  };

  const filteredMaintenances = maintenances.filter((maintenance) =>
    maintenance.issueDescription
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const showMessage = (type, content) => {
    setMessage({ show: true, type, content });
    setTimeout(() => {
      setMessage({ ...message, show: false });
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Maintenance Management</h1>
      <div className="mb-3">
        <FormControl
          type="text"
          placeholder="Search by issue description..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <Button variant="primary" onClick={handleShowModal}>
        Add Maintenance
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Maintenance ID</th>
            <th>Item ID</th>
            <th>Issue Description</th>
            <th>Reported Date</th>
            <th>Resolved Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaintenances.map((maintenance) => (
            <tr key={maintenance.maintenanceId}>
              <td>{maintenance.maintenanceId}</td>
              <td>{maintenance.itemId}</td>
              <td>{maintenance.issueDescription}</td>
              <td>{maintenance.reportedDate}</td>
              <td>{maintenance.resolvedDate || "-"}</td>
              <td>{maintenance.status}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowEditModal(maintenance)}>
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    handleDeleteMaintenance(maintenance.maintenanceId)
                  }>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Maintenance</Modal.Title>
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
                    value={maintenanceData.itemId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formIssueDescription">
                  <Form.Label>Issue Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter issue description"
                    name="issueDescription"
                    value={maintenanceData.issueDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formReportedDate">
                  <Form.Label>Reported Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="reportedDate"
                    value={maintenanceData.reportedDate}
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
                    value={maintenanceData.resolvedDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={maintenanceData.status}
                    onChange={handleChange}>
                    <option value="">Select status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddMaintenance}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Maintenance</Modal.Title>
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
                <Form.Group controlId="formIssueDescription">
                  <Form.Label>Issue Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter issue description"
                    name="issueDescription"
                    value={editData.issueDescription}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formReportedDate">
                  <Form.Label>Reported Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="reportedDate"
                    value={editData.reportedDate}
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
            <Row>
              <Col>
                <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}>
                    <option value="">Select status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateMaintenance}>
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

export default MaintenanceManagement;

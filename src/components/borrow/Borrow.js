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
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const API_BASE_URL = "http://localhost:8080/api/v1/borrow";

const BorrowManagement = () => {
  const [borrows, setBorrows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [borrowData, setBorrowData] = useState({
    itemId: "",
    borrowerName: "",
    borrowerPhone: "",
    borrowedDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    returnedDate: "",
    status: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    itemId: "",
    borrowerName: "",
    borrowerPhone: "",
    borrowedDate: "",
    dueDate: "",
    returnedDate: "",
    status: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState({
    show: false,
    type: "",
    content: "",
  });
  const statusOptions = ["OVERDUE", "RETURNED", "BORROWED"];
  useEffect(() => {
    const storedExpiryTime = parseInt(localStorage.getItem("expiryTime"));
    const now = new Date().getTime();

    if (!isLoggedIn || !storedExpiryTime || now >= storedExpiryTime) {
      navigate("/auth/login");
    }
  }, [isLoggedIn, navigate]);
  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`);
      setBorrows(response.data);
    } catch (error) {
      console.error("Error fetching borrows:", error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowEditModal = (borrow) => {
    setEditData(borrow);
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
    setBorrowData({ ...borrowData, [name]: value });
  };

  const handleAddBorrow = async () => {
    if (
      !borrowData.itemId ||
      !borrowData.borrowerName ||
      !borrowData.borrowerPhone ||
      !borrowData.borrowedDate ||
      !borrowData.dueDate ||
      !borrowData.status
    ) {
      showMessage("error", "Please fill in all required fields.");
      return;
    }

    if (!/^0\d{9}$/.test(borrowData.borrowerPhone)) {
      showMessage(
        "error",
        "Please enter a valid phone number starting with 0 and containing 10 digits."
      );
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/add`, borrowData);
      fetchBorrows();
      handleCloseModal();
      showMessage("success", "Borrow added successfully!");
    } catch (error) {
      showMessage("error", error.response.data);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleUpdateBorrow = async () => {
    if (
      !editData.itemId ||
      !editData.borrowerName ||
      !editData.borrowerPhone ||
      !editData.borrowedDate ||
      !editData.dueDate ||
      !editData.status
    ) {
      showMessage("error", "Please fill in all required fields.");
      return;
    }

    if (!/^0\d{9}$/.test(editData.borrowerPhone)) {
      showMessage(
        "error",
        "Please enter a valid phone number starting with 0 and containing 10 digits."
      );
      return;
    }
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${editData.borrowingId}`,
        editData
      );
      fetchBorrows();
      handleCloseEditModal();
      showMessage("success", "Borrow updated successfully!");
    } catch (error) {
      showMessage("error", error.response.data);
    }
  };

  const handleDeleteBorrow = async (borrowId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${borrowId}`);
      fetchBorrows();
      showMessage("success", "Borrow deleted successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting borrow";
      showMessage("error", errorMessage);
    }
  };

  const filteredBorrows = borrows.filter((borrow) =>
    borrow.borrowerName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const showMessage = (type, content) => {
    setMessage({ show: true, type, content });
    setTimeout(() => {
      setMessage({ ...message, show: false });
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Borrow Management</h1>
      <div className="mb-3">
        <FormControl
          type="text"
          placeholder="Search by borrower name..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <Button variant="primary" onClick={handleShowModal}>
        Add Borrow
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Borrowing ID</th>
            <th>Item ID</th>
            <th>Borrower Name</th>
            <th>Borrower Phone</th>
            <th>Borrowed Date</th>
            <th>Due Date</th>
            <th>Returned Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBorrows.map((borrow) => (
            <tr key={borrow.borrowingId}>
              <td>{borrow.borrowingId}</td>
              <td>{borrow.itemId}</td>
              <td>{borrow.borrowerName}</td>
              <td>{borrow.borrowerPhone}</td>
              <td>{borrow.borrowedDate}</td>
              <td>{borrow.dueDate}</td>
              <td>{borrow.returnedDate || "-"}</td>
              <td>{borrow.status}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowEditModal(borrow)}>
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteBorrow(borrow.borrowingId)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Borrow</Modal.Title>
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
                    value={borrowData.itemId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBorrowerName">
                  <Form.Label>Borrower Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter borrower name"
                    name="borrowerName"
                    value={borrowData.borrowerName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formBorrowerPhone">
                  <Form.Label>Borrower Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter borrower phone"
                    name="borrowerPhone"
                    value={borrowData.borrowerPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBorrowedDate">
                  <Form.Label>Borrowed Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="borrowedDate"
                    value={borrowData.borrowedDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formDueDate">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    value={borrowData.dueDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formReturnedDate">
                  <Form.Label>Returned Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="returnedDate"
                    value={borrowData.returnedDate}
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
                    value={borrowData.status}
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
          <Button variant="primary" onClick={handleAddBorrow}>
            Save
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
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Borrow</Modal.Title>
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
                <Form.Group controlId="formBorrowerName">
                  <Form.Label>Borrower Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter borrower name"
                    name="borrowerName"
                    value={editData.borrowerName}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formBorrowerPhone">
                  <Form.Label>Borrower Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter borrower phone"
                    name="borrowerPhone"
                    value={editData.borrowerPhone}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBorrowedDate">
                  <Form.Label>Borrowed Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="borrowedDate"
                    value={editData.borrowedDate}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formDueDate">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    value={editData.dueDate}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formReturnedDate">
                  <Form.Label>Returned Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="returnedDate"
                    value={editData.returnedDate}
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
          <Button variant="primary" onClick={handleUpdateBorrow}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BorrowManagement;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, FormControl } from "react-bootstrap";

const BorrowManagement = () => {
  const [borrows, setBorrows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [borrowData, setBorrowData] = useState({
    itemId: "",
    borrowerName: "",
    borrowerPhone: "",
    borrowedDate: "",
    dueDate: "",
    returnedDate: "",
    status: "",
  });
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/borrow/list"
      );
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBorrowData({ ...borrowData, [name]: value });
  };

  const handleAddBorrow = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/borrow/add",
        borrowData
      );
      fetchBorrows();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding borrow:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredBorrows = borrows.filter((borrow) =>
    borrow.borrowerName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <h1>Borrow Management</h1>
      <div className="mb-3">
        <FormControl
          type="text"
          placeholder="Search by borrower name..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <Button onClick={handleShowModal}>Add Borrow</Button>
      <Table striped bordered hover>
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
              <td>{borrow.returnedDate}</td>
              <td>{borrow.status}</td>
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
            {/* Add more form fields here */}
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
    </div>
  );
};

export default BorrowManagement;

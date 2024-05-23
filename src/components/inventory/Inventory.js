import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FormControl, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Inventory = () => {
  const { isLoggedIn } = useAuth();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedExpiryTime = parseInt(localStorage.getItem("expiryTime"));
    const now = new Date().getTime();

    if (!isLoggedIn || !storedExpiryTime || now >= storedExpiryTime) {
      navigate("/auth/login");
    }
  }, [isLoggedIn, navigate]);

  const fetchInventory = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/inventory/list"
      );
      setInventoryItems(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleApiError = (error) => {
    if (error.response) {
      setError(error.response.data);
    } else if (error.request) {
      setError("Server not responding.");
    } else {
      setError("An error occurred while processing your request.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleDelete = (itemId) => {
    const item = inventoryItems.find((item) => item.itemId === itemId);
    setItemToDelete(item);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/inventory/delete/${itemToDelete.itemId}`
      );
      if (response.status === 200) {
        setInventoryItems(
          inventoryItems.filter((item) => item.itemId !== itemToDelete.itemId)
        );
        setShowDeleteConfirmation(false);
        setShowDeleteSuccess(true); // Hiển thị modal thông báo thành công
      }
    } catch (error) {
      handleApiError(error);
      setShowDeleteConfirmation(false);
      setShowDeleteError(true); // Hiển thị modal thông báo lỗi
      setDeleteErrorMessage(error.response.data); // Cập nhật thông báo lỗi
    }
  };

  const filteredInventoryItems = inventoryItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1>Inventory Management</h1>
      <Link to="/inventory/create">
        <Button variant="primary" className="mt-3">
          <i className="fas fa-plus"></i> Add Item
        </Button>
      </Link>
      <FormControl
        type="text"
        placeholder="Search..."
        value={searchKeyword}
        onChange={handleSearchChange}
        className="mt-3"
      />
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Item ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Total Quantity</th>
            <th>Warehouse ID</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventoryItems.map((item, index) => (
            <tr key={item.itemId}>
              <td>{index + 1}</td>
              <td>{item.itemId}</td>
              <td>{item.itemName}</td>
              <td>{item.description}</td>
              <td>{item.totalQuantity}</td>
              <td>{item.warehouseId}</td>
              <td>
                <img
                  src={`http://localhost:8080/api/v1/inventory/image/${item.itemId}`}
                  alt={`Image of ${item.itemName}`}
                  className="img-fluid"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
              <td>
                <Link to={`/inventory/details/${item.itemId}`}>
                  <Button variant="info" className="btn-sm mr-2">
                    <i className="fas fa-info-circle"></i> Details
                  </Button>
                </Link>
                <Link to={`/inventory/update/${item.itemId}`}>
                  <Button variant="warning" className="btn-sm mr-2">
                    <i className="fas fa-edit"></i> Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleDelete(item.itemId)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        centered // Canh giữa modal
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-exclamation-triangle text-warning mr-2"></i>{" "}
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete item "{itemToDelete?.itemName}" with
          description "{itemToDelete?.description}"?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteSuccess}
        onHide={() => setShowDeleteSuccess(false)}
        centered // Canh giữa modal
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-check-circle text-success mr-2"></i> Delete
            Success
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Item deleted successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowDeleteSuccess(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteError}
        onHide={() => setShowDeleteError(false)}
        centered // Canh giữa modal
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-times-circle text-danger mr-2"></i> Delete
            Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{deleteErrorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowDeleteError(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Inventory;

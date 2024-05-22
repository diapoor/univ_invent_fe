import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreateInventory() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    if (name === "itemName") {
      setItemName(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "totalQuantity") {
      setTotalQuantity(value);
    } else if (name === "warehouseId") {
      setWarehouseId(value);
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check input fields
    if (!itemName || !description || !totalQuantity || !warehouseId || !image) {
      setError("Please enter all required information.");
      return;
    }
    if (totalQuantity <= 0 || warehouseId <= 0) {
      setError("Invalid quantity or warehouse ID.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("totalQuantity", totalQuantity);
    formData.append("warehouseId", warehouseId);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/inventory/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        setError("");
        setShowModal(true);
      } else {
        setError("An error occurred while adding the inventory item.");
      }
    } catch (error) {
      setError(error.response.data);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    // Redirect to /inventory page
    navigate("/inventory");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">Create Inventory</h2>
            </div>
            <div className="card-body">
              {error && <p className="text-danger">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Item Name:</label>
                  <input
                    type="text"
                    name="itemName"
                    value={itemName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Quantity:</label>
                  <input
                    type="number"
                    name="totalQuantity"
                    value={totalQuantity}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Warehouse ID:</label>
                  <input
                    type="number"
                    name="warehouseId"
                    value={warehouseId}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal displayed when inventory is added successfully */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Inventory Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-success">Inventory has been added successfully!</p>
          <p>Do you want to go to the inventory management page?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmModal}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateInventory;

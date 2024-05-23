import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

function UpdateInventory() {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/inventory/get/${id}`
        );
        setItem(response.data);
        // Set current image URL
        setCurrentImage(`http://localhost:8080/api/v1/inventory/image/${id}`);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("itemName", item.itemName);
      formData.append("description", item.description);
      formData.append("totalQuantity", item.totalQuantity);
      formData.append("warehouseId", item.warehouseId); // Thêm warehouseId vào formData

      const response = await axios.put(
        `http://localhost:8080/api/v1/inventory/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response.data);
      setShowErrorModal(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setCurrentImage(imageUrl);
  };

  return (
    <div className="container mt-5">
      <h1>Edit Inventory Item</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="itemName">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            name="itemName"
            value={item.itemName || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={item.description || ""}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>
        <Form.Group controlId="totalQuantity">
          <Form.Label>Total Quantity</Form.Label>
          <Form.Control
            type="number"
            name="totalQuantity"
            value={item.totalQuantity || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="warehouseId">
          {" "}
          {/* Thêm warehouseId vào form */}
          <Form.Label>Warehouse ID</Form.Label>
          <Form.Control
            type="number"
            name="warehouseId"
            value={item.warehouseId || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <div className="mb-3">
            {currentImage && (
              <img
                src={currentImage}
                alt="Current Image"
                className="img-fluid"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            )}
          </div>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-check-circle text-success mr-2"></i> Success
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Item updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-times-circle text-danger mr-2"></i> Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UpdateInventory;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Row,
  Col,
  Image,
  Card,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useAuth } from "../AuthContext";

const InventoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const storedExpiryTime = parseInt(localStorage.getItem("expiryTime"));
    const now = new Date().getTime();

    if (!isLoggedIn || !storedExpiryTime || now >= storedExpiryTime) {
      navigate("/auth/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/inventory/get/${id}`
        );
        setItem(response.data);
      } catch (error) {
        if (error.response) {
          setError(error.response.data);
        } else if (error.request) {
          setError("Server not responding.");
        } else {
          setError("An error occurred while processing your request.");
        }
      }
    };

    fetchItemDetails();
  }, [id]);

  // Function to apply different colors based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Borrowed":
        return "danger";
      case "Lost":
        return "warning";
      case "Damaged":
        return "info";
      case "In Progress":
        return "primary";
      case "Available":
        return "success";
      case "Overdue":
        return "dark";
      case "Pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        <i className="fas fa-arrow-left"></i> Back
      </Button>
      <Card>
        <Row noGutters>
          <Col md={4}>
            <Image
              src={`http://localhost:8080/api/v1/inventory/image/${item.itemId}`}
              alt={`Image of ${item.itemName}`}
              fluid
              className="rounded-start"
            />
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Title>{item.itemName}</Card.Title>
              <Card.Text>
                <strong>Item ID:</strong> {item.itemId}
              </Card.Text>
              <Card.Text>
                <strong>Description:</strong> {item.description}
              </Card.Text>
              <Card.Text>
                <strong>Total Quantity:</strong> {item.totalQuantity}
              </Card.Text>
              <Card.Text>
                <strong>Warehouse ID:</strong> {item.warehouseId}
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
      <Card className="mt-3">
        <Card.Header>Additional Details</Card.Header>
        <ListGroup variant="flush">
          {item.statusQuantity &&
            Object.entries(item.statusQuantity).map(([status, quantity]) => (
              <ListGroup.Item key={status} variant={getStatusColor(status)}>
                <strong>{status}:</strong> {quantity}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default InventoryDetails;

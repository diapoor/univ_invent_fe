import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./WareHouse.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { FormControl } from "react-bootstrap";

const Warehouse = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [form, setForm] = useState({ warehouseId: "", name: "", location: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedExpiryTime = parseInt(localStorage.getItem("expiryTime"));
    const now = new Date().getTime();

    if (!isLoggedIn || !storedExpiryTime || now >= storedExpiryTime) {
      navigate("/auth/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/warehouse/list"
      );
      setWarehouses(response.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const fetchWarehouseById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/warehouse/get/${id}`
      );
      setSelectedWarehouse(response.data);
    } catch (error) {
      console.error("Error fetching warehouse:", error.response);
      if (error.response && error.response.status === 400) {
        setError(error.response.data);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const addWarehouse = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/warehouse/add",
        form
      );
      setMessage("Warehouse added successfully");
      fetchWarehouses();
      setForm({ warehouseId: "", name: "", location: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding warehouse:", error);
      setMessage("");
      if (error.response && error.response.status === 400) {
        setError(error.response.data);
      }
    }
  };

  const updateWarehouse = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/warehouse/update/${form.warehouseId}`,
        form
      );
      setMessage("Warehouse updated successfully");
      fetchWarehouses();
      setForm({ warehouseId: "", name: "", location: "" });
      setIsEditing(false);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating warehouse:", error);
      setMessage("");
      if (error.response && error.response.status === 400) {
        setError(error.response.data);
      }
    }
  };

  const deleteWarehouse = async (id) => {
    setError("");
    setMessage("");
    setShowForm(false);
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/warehouse/delete/${id}`
      );
      setDeleteMessage("Warehouse deleted successfully");
      fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      if (error.response && error.response.status === 400) {
        setDeleteMessage(error.response.data);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateWarehouse();
    } else {
      addWarehouse();
    }
  };

  const handleEdit = (warehouse) => {
    setForm(warehouse);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="container mt-5">
      <h1>Warehouse Management</h1>
      <button
        className="btn btn-primary mt-3"
        onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add Warehouse"}
      </button>
      {showForm && (
        <div className="card mt-4">
          <div className="card-header">
            <h3>{isEditing ? "Edit Warehouse" : "Add Warehouse"}</h3>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                {isEditing ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="card mt-4">
        {message && <div className="alert alert-success">{message}</div>}
        {deleteMessage && (
          <div className="alert alert-warning">{deleteMessage}</div>
        )}
        <div className="card-header">
          <h3>Warehouse List</h3>
          <FormControl
            type="text"
            placeholder="Search..."
            value={searchKeyword}
            onChange={handleSearchChange}
          />
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWarehouses.map((warehouse, index) => (
                <tr key={warehouse.warehouseId}>
                  <td>{index + 1}</td>
                  <td>{warehouse.warehouseId}</td>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.location}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(warehouse)}
                      className="btn btn-warning btn-sm">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteWarehouse(warehouse.warehouseId)}
                      className="btn btn-danger btn-sm">
                      Delete
                    </button>
                    <button
                      onClick={() => fetchWarehouseById(warehouse.warehouseId)}
                      className="btn btn-info btn-sm">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul>
            {selectedWarehouse && (
              <div className="card mt-4">
                <div className="card-header">
                  <h3>Warehouse Details</h3>
                </div>
                <div className="card-body">
                  <p>ID: {selectedWarehouse.warehouseId}</p>
                  <p>Name: {selectedWarehouse.name}</p>
                  <p>Location: {selectedWarehouse.location}</p>
                  <h4>Inventory</h4>
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Description</th>
                        <th>Total Quantity</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedWarehouse.inventories.map((inventory, index) => (
                        <tr key={index}>
                          <td>{inventory.itemName}</td>
                          <td>{inventory.description}</td>
                          <td>{inventory.totalQuantity}</td>
                          <td>
                            <img
                              src={`http://localhost:8080/api/v1/inventory/image/${inventory.itemId}`}
                              alt={`Image of ${inventory.itemName}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;

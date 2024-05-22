import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState("");

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
          Add Item
        </Button>
      </Link>
      <FormControl
        type="text"
        placeholder="Search..."
        value={searchKeyword}
        onChange={handleSearchChange}
        className="mt-3"
      />
      {error && <div className="alert alert-danger mt-3">{error}</div>}
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
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>
                <Link to={`/editInventory/${item.itemId}`}>
                  <Button variant="warning" className="btn-sm">
                    Edit
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;

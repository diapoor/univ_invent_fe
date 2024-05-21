import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WareHouse.css'

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [form, setForm] = useState({ warehouseId: '', name: '', location: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/warehouse/list');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const fetchWarehouseById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/warehouse/get/${id}`);
      setSelectedWarehouse(response.data);
    } catch (error) {
      console.error('Error fetching warehouse:', error);
    }
  };

  const searchWarehouses = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/warehouse/search/${searchKeyword}`);
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error searching warehouses:', error);
    }
  };

  const addWarehouse = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/warehouse/add', form);
      setMessage('Warehouse added successfully');
      fetchWarehouses();
      setForm({ warehouseId: '', name: '', location: '' });
    } catch (error) {
      console.error('Error adding warehouse:', error);
      setMessage('Failed to add warehouse');
    }
  };

  const updateWarehouse = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v1/warehouse/update/${form.warehouseId}`, form);
      setMessage('Warehouse updated successfully');
      fetchWarehouses();
      setForm({ warehouseId: '', name: '', location: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating warehouse:', error);
      setMessage('Failed to update warehouse');
    }
  };

  const deleteWarehouse = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/warehouse/delete/${id}`);
      setMessage('Warehouse deleted successfully');
      fetchWarehouses();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      setMessage('Failed to delete warehouse');
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
  };

  return (
    <div className="container mt-5">
      <h1>Warehouse Management</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card">
        <div className="card-header">
          <h3>{isEditing ? 'Edit Warehouse' : 'Add Warehouse'}</h3>
        </div>
        <div className="card-body">
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
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              {isEditing ? 'Update' : 'Add'}
            </button>
          </form>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-header">
          <h3>Warehouse List</h3>
          <input
            type="text"
            placeholder="Search by name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="form-control"
          />
          <button onClick={searchWarehouses} className="btn btn-secondary mt-2">Search</button>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.warehouseId}>
                  <td>{warehouse.warehouseId}</td>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.location}</td>
                  <td>
                    <button onClick={() => handleEdit(warehouse)} className="btn btn-warning btn-sm">
                      Edit
                    </button>
                    <button onClick={() => deleteWarehouse(warehouse.warehouseId)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                    <button onClick={() => fetchWarehouseById(warehouse.warehouseId)} className="btn btn-info btn-sm">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedWarehouse && (
            <div>
              <h3>Warehouse Details</h3>
              <p>ID: {selectedWarehouse.warehouseId}</p>
              <p>Name: {selectedWarehouse.name}</p>
              <p>Location: {selectedWarehouse.location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Warehouse;

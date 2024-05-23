import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, FormControl } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./UserList.css"; // CSS tùy chỉnh
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const storedExpiryTime = parseInt(localStorage.getItem("expiryTime"));
    const now = new Date().getTime();

    if (!isLoggedIn || !storedExpiryTime || now >= storedExpiryTime) {
      navigate("/auth/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/v1/user/list", {
        validateStatus: () => true,
      });
      if (result.status === 200) {
        setUsers(result.data);
        toast.success("User list loaded successfully!");
      }
    } catch (error) {
      console.error("Error loading user data!", error);
      toast.error("Error loading user list!");
    }
  };

  const deleteUser = (username) => {
    setDeleteUsername(username);
    setShowConfirmDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (deleteUsername === localStorage.getItem("username")) {
      toast.error(`Can't delete User: user Activing!`);
    } else {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/v1/user/delete/${deleteUsername}`
        );
        if (response.status === 200) {
          setUsers(users.filter((user) => user.username !== deleteUsername));
          toast.success("User deleted successfully!");
          setShowConfirmDeleteModal(false);
          setShowDeleteModal(true);
        } else {
          toast.error("Error deleting user!");
        }
      } catch (error) {
        console.error("Error deleting user!", error);
        toast.error("Error deleting user!");
      }
    }
  };

  const showUserDetails = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/user/get/${username}`
      );
      if (response.status === 200) {
        setSelectedUser(response.data);
        setShowUserDetailsModal(true);
      } else {
        toast.error("User not found!");
      }
    } catch (error) {
      console.error("Error fetching user details!", error);
      toast.error("Error fetching user details!");
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <section>
      <h2 className="section-title">User List</h2>
      <div className="search-container">
        <FormControl
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.fullName}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => showUserDetails(user.username)}>
                  <i className="fas fa-info-circle"></i> View
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => deleteUser(user.username)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirm Delete Modal */}
      <Modal
        show={showConfirmDeleteModal}
        onHide={() => setShowConfirmDeleteModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-exclamation-circle text-danger"></i> Confirm
            User Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            Are you sure you want to delete user{" "}
            <strong>{deleteUsername}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-check-circle text-success"></i> Notification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-success">User deleted successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Details Modal */}
      <Modal
        show={showUserDetailsModal}
        onHide={() => setShowUserDetailsModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-info-circle text-primary"></i> User Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>
                <strong>User ID:</strong> {selectedUser.userId}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Full Name:</strong> {selectedUser.fullName}
              </p>
              {/* Add more user details if needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUserDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default UserList;

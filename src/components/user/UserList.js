import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, FormControl } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserList.css'; // Import CSS file for custom styling

function UserList() {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  // Function to load users
  const loadUser = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/api/v1/user/list",
        {
          validateStatus: () => true,
        }
      );
      if (result.status === 200) {
        setUsers(result.data);
        toast.success('Danh sách người dùng đã được tải thành công!');
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy dữ liệu người dùng!", error);
      toast.error('Đã xảy ra lỗi khi tải danh sách người dùng!');
    }
  };

  // Function to delete user
  const deleteUser = async (username) => {
    setDeleteUsername(username); // Lưu tên người dùng cần xóa vào state
    setShowConfirmDeleteModal(true); // Hiển thị popup hỏi trước khi xóa
  };
  const confirmDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/user/delete/${deleteUsername}`
      );
      if (response.status === 200) {
        setUsers(users.filter(user => user.username !== deleteUsername));
        toast.success('Người dùng đã được xóa thành công!');
        setShowConfirmDeleteModal(false); // Đóng popup hỏi sau khi xóa thành công
        setShowDeleteModal(true);
      } else {
        toast.error('Đã xảy ra lỗi khi xóa người dùng!');
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi xóa người dùng!", error);
      toast.error('Đã xảy ra lỗi khi xóa người dùng!');
    }
  };
  

  // Function to show user details
  const showUserDetails = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/get/${username}`);
      if (response.status === 200) {
        setSelectedUser(response.data);
        setShowUserDetailsModal(true);
      } else {
        toast.error('Không thể tìm thấy thông tin người dùng!');
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy thông tin người dùng!", error);
      toast.error('Đã xảy ra lỗi khi lấy thông tin người dùng!');
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Filter users based on search value
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <section>
      <h2 className="section-title">Danh sách người dùng</h2>
      <div className="search-container">
        <FormControl
          type="text"
          placeholder="Tìm kiếm..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>User name</th>
            <th>Full name</th>
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
                <Button variant="primary" onClick={() => showUserDetails(user.username)}>View</Button>{' '}
                <Button variant="danger" onClick={() => deleteUser(user.username)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal confimdelete */}
      <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
        <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa người dùng {deleteUsername} không?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>Hủy</Button>
        <Button variant="danger" onClick={confirmDeleteUser}>Xóa</Button>
      </Modal.Footer>
      </Modal>

      {/* Modal hiển thị khi xóa thành công */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Người dùng đã được xóa thành công!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal hiển thị chi tiết người dùng */}
      <Modal show={showUserDetailsModal} onHide={() => setShowUserDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>User Id:</strong> {selectedUser.userId}</p>
              <p><strong>User name:</strong> {selectedUser.username}</p>
              <p><strong>Full name:</strong> {selectedUser.fullName}</p>
              {/* Thêm thông tin chi tiết khác nếu cần */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserDetailsModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default UserList;

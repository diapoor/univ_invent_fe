import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/api/v1/user/list",
        {
          validateStatus: () => true,
        }
      );
      console.log('API response:', result); // Log phản hồi API để kiểm tra
      if (result.status === 200 || result.status === 302) {
        setUsers(result.data);
      } else {
        console.log('Unexpected status code:', result.status);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy dữ liệu người dùng!", error);
    }
  };

  return (
    <section>
      <table>
        <thead>
          <tr>
            <th>User name</th>
            <th>Full name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId}>
              <th scope='row'>{index + 1}</th>
              <td>{user.username}</td>
              <td>{user.fullName}</td>
              <td>
                <button>View</button>
                <button>Add</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default UserList;

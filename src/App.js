import React from 'react';
import Home from './Home'; // Đảm bảo bạn đã nhập đúng tên file
import AppBar from './components/Appbar';
import UserList from './components/user/UserList';
function App() {
  return (
    <div className="App">
      <UserList />
    </div>
  );
}

export default App;

import React from 'react';
import Home from './Home'; // Đảm bảo bạn đã nhập đúng tên file
import AppBar from './components/Appbar';
import userView from './components/user/userView';

function App() {
  return (
    <div className="App">
      <userView />
    </div>
  );
}

export default App;

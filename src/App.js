import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import UserList from "./components/user/UserList";
import Warehouse from "./components/warehouse/WareHouse";
import Login from "./components/auth/Login";
import { AuthProvider } from "./components/AuthContext";
import Layout from "./components/layout/Layout";
import InventoryManagement from "./components/inventory/Inventory";
import CreateInventory from "./components/inventory/CreateInventory";
import InventoryDetails from "./components/inventory/InventoryDetails";
import UpdateInventory from "./components/inventory/UpdateInventory";
import BorrowManagement from "./components/borrow/Borrow";
import Maintenance from "./components/maintenance/Maintenance";
import LossesAndDamageManagement from "./components/lad/LossesAndDamage";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/user" element={<UserList />} />
                  <Route path="/ware-house" element={<Warehouse />} />
                  <Route path="/inventory" element={<InventoryManagement />} />
                  <Route
                    path="/inventory/create"
                    element={<CreateInventory />}
                  />
                  <Route
                    path="/inventory/details/:id"
                    element={<InventoryDetails />}
                  />
                  <Route
                    path="/inventory/update/:id"
                    element={<UpdateInventory />}
                  />
                  <Route path="/borrow" element={<BorrowManagement />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/lad" element={<LossesAndDamageManagement />} />
                  {/* Add more routes for other pages */}
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

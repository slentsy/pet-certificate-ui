import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import UserDashboard from "./pages/UserDashboard";
import ShelterDashboard from "./pages/ShelterDashboard";
import VetDashboard from "./pages/VetDashboard";       // ← Tambahkan ini
import OwnerDashboard from "./pages/OwnerDashboard";   // ← Tambahkan ini

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/shelter" element={<ShelterDashboard />} />
        <Route path="/vet" element={<VetDashboard />} />         {/* Tambahkan ini */}
        <Route path="/owner" element={<OwnerDashboard />} />     {/* Tambahkan ini */}
      </Routes>
    </Router>
  );
}

export default App;

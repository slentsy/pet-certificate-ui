import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContract } from "../utils/contract";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [petId, setPetId] = useState("");
  const [achievement, setAchievement] = useState("");
  const [status, setStatus] = useState("");

  const handleAddAchievement = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.addAchievement(petId, achievement);
      await tx.wait();
      setStatus("Achievement added!");
    } catch (err) {
      setStatus("Error: " + err.message);
    }

    // berhasil?
  };

  return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/")}>← Back to Role Selection</button>
      <h2 className="text-center mb-4">Owner Dashboard</h2>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Pet ID</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter pet ID"
              onChange={(e) => setPetId(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Achievement</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter achievement"
              onChange={(e) => setAchievement(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2 mb-4">
            <button className="btn btn-primary" onClick={handleAddAchievement}>
              Add Achievement
            </button>
          </div>

          <p className="text-center">{status}</p>
        </div>
      </div>
    </div>
  );
}

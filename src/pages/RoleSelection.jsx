import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "2rem" }}>
      <div className="text-center">
        {/* Logo added above "Select Your Role" */}
        <img
          src="Petish_Logo.png"  // Replace this with your actual logo path
          alt="Petish Logo"
          style={{ width: "250px", height: "auto", marginBottom: "20px" }} // Adjust size to be larger
        />
        
        <h1 className="mb-4 display-4" style={{ fontWeight: "400", color: "#3A3A3A" }}>
          Select Your Role
        </h1>
        
        <div className="d-flex flex-column align-items-center">
          <button 
            className="btn btn-primary mb-3 w-75 p-3 shadow-lg hover-shadow-lg" 
            onClick={() => navigate("/shelter")}
            style={{ borderRadius: "25px", transition: "all 0.3s ease" }}
          >
            Shelter
          </button>
          <button 
            className="btn btn-success mb-3 w-75 p-3 shadow-lg hover-shadow-lg" 
            onClick={() => navigate("/user")}
            style={{ borderRadius: "25px", transition: "all 0.3s ease" }}
          >
            User
          </button>
          <button 
            className="btn btn-warning mb-3 w-75 p-3 shadow-lg hover-shadow-lg" 
            onClick={() => navigate("/vet")}
            style={{ borderRadius: "25px", transition: "all 0.3s ease" }}
          >
            Vet
          </button>
          <button 
            className="btn btn-info mb-3 w-75 p-3 shadow-lg hover-shadow-lg" 
            onClick={() => navigate("/owner")}
            style={{ borderRadius: "25px", transition: "all 0.3s ease" }}
          >
            Owner
          </button>
        </div>
      </div>
    </div>
  );
}

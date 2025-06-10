import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getContract } from "../utils/contract";
import 'bootstrap/dist/css/bootstrap.min.css';
import { contractAddress } from "../constants/contractAddress";
import { ethers } from "ethers";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const contract = await getContract();
        if (!contract) {
          alert("Smart Contract tidak tersedia. Silakan coba lagi.");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const code = await provider.getCode(contractAddress);
        if (code === "0x") {
          alert("Alamat kontrak tidak valid. Pastikan kontrak sudah dideploy.");
          return;
        }

        const count = await contract.getPetCounter();
        const petList = [];

        for (let i = 0; i < parseInt(count); i++) {
          const pet = await contract.getPetBasic(i);
          const achievements = await contract.getAchievementCertificates(i);
          const vaccines = await contract.getVaccineCertificates(i);

          petList.push({
            id: i,
            name: pet.name,
            species: pet.species,
            owner: pet.owner,
            tokenURI: pet.tokenURI,
            health: pet.healthRecords,
            achievements: achievements.map(a => ({
              description: a.description,
              ipfsHash: a.ipfsHash
            })),
            vaccines: vaccines.map(v => ({
              description: v.description,
              ipfsHash: v.ipfsHash
            }))
          });
        }

        setPets(petList);
      } catch (err) {
        console.error("Gagal memanggil pet data:", err);
        alert("Gagal memanggil data hewan.");
      }
    };

    fetchPets();
  }, []);

  const handleRequestAdoption = async (petId) => {
    try {
      const contract = await getContract();
      const tx = await contract.requestAdoption(petId);
      await tx.wait();
      alert("Adoption request sent!");
    } catch (err) {
      alert("Failed to request adoption: " + (err.reason || err.message));
    }
  };

  return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/")}>
        ← Back to Role Selection
      </button>
      <h2 className="text-center mb-4">User Dashboard: Available Pets</h2>

      {pets.length === 0 ? (
        <p className="text-center">No pets available.</p>
      ) : (
        <div className="row justify-content-center">
          {pets.map((pet) => (
            <div key={pet.id} className="col-md-4 mb-4">
              <div
                className="card"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    {pet.name} ({pet.species})
                  </h5>
                  <p>
                    <strong>Owner:</strong> {pet.owner}
                  </p>

                  <p>
                    <strong>Achievements:</strong>
                  </p>
                  <ul>
                    {pet.achievements.length === 0 ? (
                      <li>None</li>
                    ) : (
                      pet.achievements.map((a, idx) => (
                        <li key={idx}>
                          {a.description} –{" "}
                          <a
                          href={`https://ipfs.io/ipfs/${a.ipfsHash.replace("ipfs://", "")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                        </li>
                      ))
                    )}
                  </ul>

                  <p>
                    <strong>Vaccine Certificates:</strong>
                  </p>
                  <ul>
                    {pet.vaccines.length === 0 ? (
                      <li>None</li>
                    ) : (
                       pet.vaccines.map((v, idx) => {
                          const cleanedHash = v.ipfsHash?.replace(/^ipfs:\/\//, "");
                          return (
                            <li key={idx}>
                              {v.description} –{" "}
                              {cleanedHash ? (
                                <a
                                  href={`https://ipfs.io/ipfs/${cleanedHash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  [View Certificate]
                                </a>
                              ) : (
                                <span style={{ color: "gray" }}>Invalid IPFS hash</span>
                              )}
                            </li>
                          );
                        }) 
                    )}
                  </ul>
                  <p>
                    <strong>Health Records:</strong>{" "}
                    {pet.health.join(", ") || "None"}
                  </p>

                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleRequestAdoption(pet.id)}
                  >
                    Request Adoption
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

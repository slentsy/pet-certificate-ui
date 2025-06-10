import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getContract } from "../utils/contract";
import axios from "axios";
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ShelterDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [contract, setContract] = useState(null);
  const [mintedHash, setMintedHash] = useState("");

  useEffect(() => {
    const init = async () => {
      const c = await getContract();
      console.log("Kontrak berhasil dihubungkan:", c);
      setContract(c);
    };
    init();
  }, []);

  const handleMint = async () => {
    // console.log("Kontrak saat mint:", contract); 
    if (!contract){
      alert("Smart contract belum terhubung.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); 
      const userAddress = await signer.getAddress(); 
      const shelterAddress = await contract.shelter();

      if (userAddress.toLowerCase() !== shelterAddress.toLowerCase()) {
        alert("Hanya shelter yang dapat melakukan minting.");
        return;
      }

      setStatus("Uploading image to Pinata...");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: "694b3cd0db2cf7db9c1d",
          pinata_secret_api_key: "9664c393d0dc13430a2695f0a828a2ccd70cc0bea9dcbc22355bda8da4092ff3",
        },
      });

      const ipfsHash = res.data.IpfsHash;
      const ipfsURI = `ipfs://${ipfsHash}`;

      setStatus("Calling smart contract...");
      const tx = await contract.mint(name, species, ipfsURI);
      await tx.wait();

      setStatus("Mint successful!");
      setMintedHash(ipfsHash);
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/")}>← Back to Role Selection</button>
      <h2 className="text-center mb-4">Shelter Dashboard</h2>

      <h3 className="text-center mb-4">Mint New Pet</h3>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Pet Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter pet's name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Species</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter species"
              onChange={(e) => setSpecies(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Pet Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="d-grid gap-2 mb-4">
            <button className="btn btn-primary" onClick={handleMint}>
              Mint Pet
            </button>
          </div>

          <p className="text-center">{status}</p>

          {mintedHash && (
            <div className="text-center mt-4">
              <p><strong>Minted IPFS Hash:</strong> {mintedHash}</p>
              <p>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${mintedHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-link"
                >
                  View Image on IPFS
                  {/* coba */}
                  {/* uji coba */}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import PetCertificate from "../constants/PetCertificateABI.json";
import contractAddress from "../constants/contractAddress";

const MintPetForm = () => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadToPinata = async () => {
    if (!image) {
      throw new Error("No image file selected");
    }
    const formData = new FormData();
    formData.append("file", image);

    const metadata = JSON.stringify({
      name,
      keyvalues: {
        species,
      },
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: "694b3cd0db2cf7db9c1d",
        pinata_secret_api_key: "9664c393d0dc13430a2695f0a828a2ccd70cc0bea9dcbc22355bda8da4092ff3",
      },
    });

    console.log("Pinata response:", res.data);
    return `ipfs://${res.data.IpfsHash}`;
  };

  const mintPet = async () => {
    try {
      setStatus("Uploading to IPFS...");
      const ipfsHash = await uploadToPinata();

      setStatus("Sending transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, PetCertificate.abi, signer);

      const tx = await contract.mint(name, species, ipfsHash);
      await tx.wait();
      setStatus("Minted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Failed: " + err.message);
    }
  };

  return (
    <div>
      <h2>Mint Pet Certificate</h2>
      <input type="text" placeholder="Pet Name" onChange={(e) => setName(e.target.value)} /><br />
      <input type="text" placeholder="Species" onChange={(e) => setSpecies(e.target.value)} /><br />
      <input type="file" onChange={handleFileChange} /><br />
      <button onClick={mintPet}>Mint Pet</button>
      <p>{status}</p>
    </div>
  );
};

export default MintPetForm;
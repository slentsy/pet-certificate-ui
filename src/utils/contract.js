import { ethers } from "ethers";
import PetCertificate from "../constants/PetCertificateABI.json";
import { contractAddress } from "../constants/contractAddress";

export const getContract = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PetCertificate.abi, signer);
    return contract;
  } catch (err) {
    console.error("Gagal menginisialisasi kontrak:", err);
    return null;
  }
};

import axios from "axios";

export const uploadToIPFS = async (file) => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({ name: file.name });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({ cidVersion: 0 });
  formData.append("pinataOptions", options);

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: "694b3cd0db2cf7db9c1d",
        pinata_secret_api_key: "9664c393d0dc13430a2695f0a828a2ccd70cc0bea9dcbc22355bda8da4092ff3",
      },
    }
  );

  return res.data.IpfsHash; // ✅ Return hanya CID-nya
};

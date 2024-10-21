import { ethers } from "ethers";

// Địa chỉ hợp đồng đã triển khai
const contractAddress = "0x3859681C32ce57c9de5fe96Cf8e197E4b8c61f99";

// ABI với hàm payForCourse
const contractABI = [
  "function getTotalCertificates() public view returns (uint256)",
  "function payForCourse(string memory courseId, string memory studentId, string memory studentName, address payable organization, string memory organizationName) public payable",
];

// Hàm kết nối với hợp đồng và gọi payForCourse
export async function payForCourse(
  provider,
  courseId,
  studentId,
  studentName,
  organization,
  organizationName,
  value
) {
  try {
  const web3Provider = new ethers.providers.Web3Provider(provider);

  const signer = web3Provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer); // Khởi tạo contract với signer

  const tx = await contract.payForCourse(
    courseId,
    studentId,
    studentName,
    organization,
    organizationName,
    { value }
  );
  return { success: true, message: 'Thanh toán thành công!' };
}
catch (error) {
  console.error("Lỗi khi thanh toán khóa học:", error);
  return { success: false, message: error.message };
}}

export async function readTotalCertificates() {
  try {
    // Gọi hàm getTotalCertificates
    // Khởi tạo một provider, có thể là Infura, Alchemy hoặc một node Ethereum
    const provider = new ethers.providers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/c2905ad3e3eb4ab3957a1b9ff6f4ed6b"
    ); 

    // Khởi tạo một thể hiện hợp đồng
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    const totalCertificates = await contract.getTotalCertificates();
    return totalCertificates.toString();
  } catch (error) {
    console.error("Lỗi khi đọc tổng số chứng chỉ:", error);
  }
}

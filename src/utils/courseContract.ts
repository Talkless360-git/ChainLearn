
import { ethers } from 'ethers';
import { CourseUploadData } from '@/types/course';

// ABI for the Course Upload Contract
export const COURSE_CONTRACT_ABI = [
  "function uploadCourse(string memory title, string memory description, string memory imageUrl, string memory duration, uint8 level, string[] memory moduleTitles, string[] memory moduleContents, uint256 price) public payable",
  "function getCourse(uint256 courseId) public view returns (string memory title, string memory description, string memory imageUrl, string memory duration, uint8 level, address creator, uint256 price)",
  "event CourseUploaded(uint256 indexed courseId, address indexed creator, string title, uint256 price)"
];

// Demo contract address on ApeChain testnet
export const COURSE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual contract address

export async function uploadCourseToContract(course: CourseUploadData): Promise<boolean> {
  try {
    if (!window.ethereum) throw new Error("No wallet found!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(COURSE_CONTRACT_ADDRESS, COURSE_CONTRACT_ABI, signer);

    // Prepare module arrays for contract
    const moduleTitles = course.modules.map(m => m.title);
    const moduleContents = course.modules.map(m => m.content);
    
    // Convert level to number for contract
    const levelMap = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
    const levelNumber = levelMap[course.level];

    // Convert price to wei
    const priceInWei = ethers.utils.parseEther(course.price);

    // Upload course to blockchain
    const tx = await contract.uploadCourse(
      course.title,
      course.description,
      course.imageUrl,
      course.duration,
      levelNumber,
      moduleTitles,
      moduleContents,
      priceInWei,
      { value: priceInWei } // Send tokens with transaction
    );

    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error uploading course:', error);
    return false;
  }
}

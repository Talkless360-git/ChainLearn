# ChainLearn

> Learn. Earn. Grow. A Web3 Education Platform on ApeChain

---

## ✨ Overview

**ChainLearn** is a full-stack blockchain-powered education platform deployed on **ApeChain**. It empowers learners to gain knowledge in Web3 and blockchain topics while earning **NFT certificates** and **token rewards** upon course completion. The platform integrates **AI for personalized feedback**, and ensures accessibility and inclusivity across all users.

---

## ❓ Problem Statement

With the rapid rise of blockchain technologies, there's a significant **lack of practical, incentivized, and decentralized educational platforms** that provide verifiable credentials. Traditional learning platforms often:

- Lack trustless proof of course completion.
- Do not reward learners for engagement.
- Fail to adapt learning based on performance.
- Have poor accessibility for diverse learners.

---

## 💡 Solution

**ChainLearn** bridges this gap by offering:

- **Incentivized Learning**: Learners earn **LEARN tokens** and **NFT certificates** for completing blockchain courses.
- **Verifiable Credentials**: NFT certificates stored on ApeChain act as permanent proof of course completion.
- **Adaptive Learning**: AI-powered quizzes offer tailored feedback and progression.
- **Web3 Integration**: Seamless MetaMask wallet connection, token minting, and contract interactions.
- **Accessibility Tools**: High contrast toggle and voice controls for an inclusive experience.

---

## 🌟 Key Features

| Feature                | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| 📚 Course Dashboard    | Browse featured blockchain courses and select to begin.               |
| 🎓 NFT Certificates    | Automatically minted upon passing quizzes.                            |
| 💰 Token Rewards       | Learners are rewarded with **LEARN** tokens for completing modules.   |
| 🤖 AI Quiz Feedback    | Real-time, intelligent quiz feedback using TensorFlow\.js.            |
| 🔐 Web3 Integration    | Connect MetaMask, interact with ApeChain smart contracts.             |
| 🤻 Accessibility Tools | Voice commands, high contrast modes, and screen reader compatibility. |
| 📈 User Achievements   | View collected NFTs, token balance, and learning milestones.          |

---

## 🛠️ Technologies Used

| Layer               | Stack / Tools                                |
| ------------------- | -------------------------------------------- |
| **Frontend**        | React.js, ethers.js, thirdweb-dev/react      |
| **Backend**         | Node.js, Express.js, MongoDB                 |
| **Smart Contracts** | Solidity (ERC-20, ERC-721) on ApeChain       |
| **AI Layer**        | TensorFlow\.js for quiz performance analysis |
| **Design**          | Tailwind CSS, Framer Motion (for animations) |
| **Accessibility**   | react-aria, react-voice-components           |

---

## 🚀 Getting Started

### 🔧 1. Prerequisites

- [Node.js](https://nodejs.org/)
- [MetaMask Wallet](https://metamask.io/)
- ApeChain Testnet RPC Configured in MetaMask
- MongoDB (Local or Cloud Instance)

### 🛠️ 2. Smart Contract Deployment

```bash
cd contracts
npx hardhat deploy --network apeChainTestnet
```

### 🖼️ 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### ⚙️ 4. Backend Setup

```bash
cd backend
npm install
node server.js
```

### 📡 5. Connect Wallet

- Launch the app.
- Click on “Connect ApeChain Wallet” to link MetaMask.
- Courses will become available after connection.

---

## 🚪 Smart Contract Highlights

**NFT Certificate Contract**

```solidity
function mintCertificate(address learner, string memory courseId) external {
    require(completedCourses[learner][courseId], "Course not completed");
    _safeMint(learner, _tokenIdCounter++);
}
```

**Token Reward System**

```solidity
function rewardLearner(address learner, uint256 amount) external onlyOwner {
    _mint(learner, amount);
}
```

---

## 📂 Folder Structure

```
chainlearn/
├── contracts/          # Solidity contracts for ApeChain
├── frontend/           # React app with Web3 integration
├── backend/            # Node.js API and MongoDB models
├── ai/                 # TensorFlow-based quiz analyzer
```

---

## 🤎 How to Use the System

1. **Connect Wallet**: Launch the frontend and connect MetaMask with ApeChain.
2. **Explore Courses**: Choose from curated blockchain courses on the homepage.
3. **Take Quiz**: Complete quizzes and receive real-time AI feedback.
4. **Earn Rewards**: Receive token rewards and NFT certificates on successful completion.
5. **Track Progress**: View achievements, certificates, and learning stats.

---

## 🔒 Security & Best Practices

- Contracts are protected with `onlyOwner` modifiers.
- All course completions are logged both on-chain and in MongoDB.
- Client-side validation and server-side checks are in place.

---

>


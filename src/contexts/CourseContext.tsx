
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';

// Define types for course data
export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  content: string;
}

export interface Quiz {
  courseId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface UserProgress {
  wallet: string;
  enrolledCourses: {
    courseId: string;
    completed: boolean;
    quizScore?: number;
    quizPassed?: boolean;
    nftMinted?: boolean;
    lastAccessed: string; // ISO date string
  }[];
}

interface CourseContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  userProgress: UserProgress | null;
  enrollInCourse: (courseId: string) => void;
  updateQuizResults: (courseId: string, score: number, passed: boolean) => void;
  markNftMinted: (courseId: string) => void;
  getQuizForCourse: (courseId: string) => Quiz | undefined;
  isEnrolled: (courseId: string) => boolean;
  hasPassed: (courseId: string) => boolean;
  hasNft: (courseId: string) => boolean;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: "c001",
    title: "Blockchain Fundamentals",
    description: "Learn the basics of blockchain technology, including distributed ledgers, consensus mechanisms, and cryptographic principles.",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=500",
    duration: "4 weeks",
    level: "Beginner",
    modules: [
      {
        id: "m001",
        title: "Introduction to Blockchain",
        content: "Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping without requiring a trusted third party. This module covers the fundamental concepts of blockchain, including its origin with Bitcoin, basic structure, and key features like decentralization and cryptographic security."
      },
      {
        id: "m002",
        title: "Consensus Mechanisms",
        content: "Consensus mechanisms are protocols that ensure all nodes in a blockchain network agree on the validity of transactions. This module explores various consensus algorithms including Proof of Work (PoW), Proof of Stake (PoS), and Delegated Proof of Stake (DPoS), discussing their advantages, limitations, and environmental implications."
      }
    ]
  },
  {
    id: "c002",
    title: "Smart Contract Development",
    description: "Master the creation and deployment of smart contracts using Solidity and industry best practices.",
    imageUrl: "https://images.unsplash.com/photo-1639322537174-8c5b573bc1ce?auto=format&fit=crop&q=80&w=500",
    duration: "6 weeks",
    level: "Intermediate",
    modules: [
      {
        id: "m003",
        title: "Solidity Basics",
        content: "Solidity is a statically-typed programming language designed for developing smart contracts on the Ethereum blockchain. This module introduces the syntax, data types, functions, and control structures of Solidity, alongside environment setup and simple contract examples."
      },
      {
        id: "m004",
        title: "Security Best Practices",
        content: "Security is paramount in smart contract development as vulnerabilities can lead to significant financial losses. This module covers common security threats like reentrancy attacks, integer overflow/underflow, and front-running, along with best practices for secure contract development and tools for security auditing."
      }
    ]
  },
  {
    id: "c003",
    title: "DeFi Protocols and Tokenomics",
    description: "Explore decentralized finance protocols, tokenomics principles, and liquidity mechanisms.",
    imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=500",
    duration: "5 weeks",
    level: "Advanced",
    modules: [
      {
        id: "m005",
        title: "DeFi Fundamentals",
        content: "Decentralized Finance (DeFi) is an ecosystem of financial applications built on blockchain networks. This module explains the core components of DeFi including lending platforms, decentralized exchanges (DEXs), yield farming, and stablecoins, highlighting how they differ from traditional financial systems."
      },
      {
        id: "m006",
        title: "Tokenomics Design",
        content: "Tokenomics involves the economic model that governs a cryptocurrency or token. This module delves into token distribution strategies, supply mechanisms (inflation vs. deflation), utility value, governance rights, and how these factors influence a token's market behavior and long-term sustainability."
      }
    ]
  },
  {
    id: "c004",
    title: "NFT Creation and Marketplaces",
    description: "Learn to create, mint, and trade NFTs across various blockchain platforms and marketplaces.",
    imageUrl: "https://images.unsplash.com/photo-1645954780061-2ec08619233a?auto=format&fit=crop&q=80&w=500",
    duration: "3 weeks",
    level: "Beginner",
    modules: [
      {
        id: "m007",
        title: "NFT Fundamentals",
        content: "Non-Fungible Tokens (NFTs) are unique digital assets verified using blockchain technology. This module covers the basic concepts of NFTs, including standards like ERC-721 and ERC-1155, properties of non-fungibility, and the technological infrastructure that supports NFTs."
      },
      {
        id: "m008",
        title: "Creating and Minting NFTs",
        content: "This module provides a hands-on approach to creating and minting NFTs. Topics include selecting the right blockchain platform, preparing digital content, metadata standards, minting processes, and considerations for storage solutions like IPFS to ensure longevity of the associated digital content."
      }
    ]
  }
];

// Mock quizzes for each course
const mockQuizzes: Quiz[] = [
  {
    courseId: "c001",
    questions: [
      {
        id: "q001",
        question: "What is the primary purpose of blockchain technology?",
        options: [
          "To create digital currencies only",
          "To maintain a centralized database",
          "To ensure immutable and transparent record-keeping without trusted intermediaries",
          "To replace traditional banking entirely"
        ],
        correctAnswer: 2
      },
      {
        id: "q002",
        question: "Which consensus mechanism is used by Bitcoin?",
        options: [
          "Proof of Stake (PoS)",
          "Proof of Work (PoW)",
          "Delegated Proof of Stake (DPoS)",
          "Proof of Authority (PoA)"
        ],
        correctAnswer: 1
      },
      {
        id: "q003",
        question: "What is a hash function in blockchain technology?",
        options: [
          "A function that encrypts data for secure transmission",
          "A function that converts any input data into a fixed-size string of bytes",
          "A function that validates transactions on the network",
          "A function that creates new cryptocurrency coins"
        ],
        correctAnswer: 1
      },
      {
        id: "q004",
        question: "What problem does blockchain technology primarily solve?",
        options: [
          "Processing speed issues in computing",
          "The double-spending problem",
          "Internet bandwidth limitations",
          "Software development complexity"
        ],
        correctAnswer: 1
      },
      {
        id: "q005",
        question: "What is a 'block' in blockchain technology?",
        options: [
          "A type of cryptocurrency",
          "A collection of transactions grouped together",
          "A security feature to prevent hacking",
          "A type of digital wallet"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    courseId: "c002",
    questions: [
      {
        id: "q006",
        question: "What language is commonly used for Ethereum smart contract development?",
        options: [
          "JavaScript",
          "Python",
          "Solidity",
          "C++"
        ],
        correctAnswer: 2
      },
      {
        id: "q007",
        question: "What is a 'gas fee' in Ethereum?",
        options: [
          "A fee paid to miners for processing transactions",
          "A subscription fee for using the Ethereum network",
          "A tax imposed by governments on cryptocurrency",
          "A fee charged by wallet providers"
        ],
        correctAnswer: 0
      },
      {
        id: "q008",
        question: "What is a reentrancy attack?",
        options: [
          "An attack that overwhelms the network with traffic",
          "An attack where a contract calls back into the calling contract before the first execution is complete",
          "An attack that steals private keys from users",
          "An attack that modifies blockchain history"
        ],
        correctAnswer: 1
      },
      {
        id: "q009",
        question: "Which of the following is NOT a feature of Solidity?",
        options: [
          "Contract inheritance",
          "Native support for asynchronous operations",
          "Event emission",
          "Function modifiers"
        ],
        correctAnswer: 1
      },
      {
        id: "q010",
        question: "What is the purpose of the 'view' keyword in Solidity function declarations?",
        options: [
          "To make the function visible to other contracts",
          "To indicate the function doesn't modify state",
          "To optimize gas usage for complex calculations",
          "To restrict function access to contract owner"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    courseId: "c003",
    questions: [
      {
        id: "q011",
        question: "What is the main purpose of DeFi?",
        options: [
          "To create new cryptocurrencies",
          "To provide financial services without centralized intermediaries",
          "To increase transaction speeds on blockchain networks",
          "To regulate cryptocurrency markets"
        ],
        correctAnswer: 1
      },
      {
        id: "q012",
        question: "What is 'yield farming' in DeFi?",
        options: [
          "Mining new cryptocurrency tokens",
          "Staking cryptocurrency to validate transactions",
          "Lending crypto assets to earn interest or additional tokens",
          "Creating new DeFi platforms"
        ],
        correctAnswer: 2
      },
      {
        id: "q013",
        question: "What is a 'liquidity pool' in DeFi?",
        options: [
          "A centralized exchange reserve",
          "A collection of funds locked in a smart contract",
          "A fund controlled by platform developers",
          "A type of crypto wallet"
        ],
        correctAnswer: 1
      },
      {
        id: "q014",
        question: "What is the main benefit of a deflationary tokenomics model?",
        options: [
          "It increases token supply over time",
          "It potentially increases token value by reducing supply",
          "It stabilizes the token price against fiat currencies",
          "It increases network transaction speeds"
        ],
        correctAnswer: 1
      },
      {
        id: "q015",
        question: "What is an 'impermanent loss' in DeFi?",
        options: [
          "Loss due to platform hacking",
          "Loss due to cryptocurrency market volatility",
          "Loss of value compared to holding assets outside a liquidity pool",
          "Loss due to failed transactions"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    courseId: "c004",
    questions: [
      {
        id: "q016",
        question: "What does NFT stand for?",
        options: [
          "New Financial Transaction",
          "Non-Fungible Token",
          "Network File Transfer",
          "New Format Technology"
        ],
        correctAnswer: 1
      },
      {
        id: "q017",
        question: "What makes NFTs unique compared to cryptocurrencies like Bitcoin?",
        options: [
          "NFTs are faster to transfer",
          "NFTs are less expensive",
          "NFTs represent unique items rather than being interchangeable",
          "NFTs don't use blockchain technology"
        ],
        correctAnswer: 2
      },
      {
        id: "q018",
        question: "What is 'minting' in the context of NFTs?",
        options: [
          "Creating a new cryptocurrency",
          "The process of creating an NFT on the blockchain",
          "Selling an NFT on a marketplace",
          "Converting digital art to physical art"
        ],
        correctAnswer: 1
      },
      {
        id: "q019",
        question: "What is the most common Ethereum standard for NFTs?",
        options: [
          "ERC-20",
          "ERC-721",
          "ERC-1155",
          "ERC-777"
        ],
        correctAnswer: 1
      },
      {
        id: "q020",
        question: "What service is commonly used to store NFT metadata and images?",
        options: [
          "Amazon Web Services",
          "Google Cloud",
          "IPFS (InterPlanetary File System)",
          "Microsoft Azure"
        ],
        correctAnswer: 2
      }
    ]
  }
];

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const { account } = useWallet();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  // Simulate fetching courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use our mock data
        setTimeout(() => {
          setCourses(mockCourses);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Load user progress from localStorage when wallet changes
  useEffect(() => {
    if (account) {
      const savedProgress = localStorage.getItem(`userProgress_${account}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      } else {
        // Initialize new user progress
        setUserProgress({
          wallet: account,
          enrolledCourses: []
        });
      }
    } else {
      setUserProgress(null);
    }
  }, [account]);

  // Save user progress to localStorage whenever it changes
  useEffect(() => {
    if (userProgress && account) {
      localStorage.setItem(`userProgress_${account}`, JSON.stringify(userProgress));
    }
  }, [userProgress, account]);

  // Enroll user in a course
  const enrollInCourse = (courseId: string) => {
    if (!account || !userProgress) return;

    // Check if already enrolled
    if (isEnrolled(courseId)) return;

    setUserProgress({
      ...userProgress,
      enrolledCourses: [
        ...userProgress.enrolledCourses,
        {
          courseId,
          completed: false,
          lastAccessed: new Date().toISOString()
        }
      ]
    });
  };

  // Update quiz results
  const updateQuizResults = (courseId: string, score: number, passed: boolean) => {
    if (!account || !userProgress) return;

    setUserProgress({
      ...userProgress,
      enrolledCourses: userProgress.enrolledCourses.map(course => 
        course.courseId === courseId
          ? {
              ...course,
              quizScore: score,
              quizPassed: passed,
              completed: passed,
              lastAccessed: new Date().toISOString()
            }
          : course
      )
    });
  };

  // Mark NFT as minted for a course
  const markNftMinted = (courseId: string) => {
    if (!account || !userProgress) return;

    setUserProgress({
      ...userProgress,
      enrolledCourses: userProgress.enrolledCourses.map(course => 
        course.courseId === courseId
          ? {
              ...course,
              nftMinted: true,
              lastAccessed: new Date().toISOString()
            }
          : course
      )
    });
  };

  // Get quiz for a specific course
  const getQuizForCourse = (courseId: string): Quiz | undefined => {
    return mockQuizzes.find(quiz => quiz.courseId === courseId);
  };

  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string): boolean => {
    if (!userProgress) return false;
    return userProgress.enrolledCourses.some(course => course.courseId === courseId);
  };

  // Check if user has passed a course quiz
  const hasPassed = (courseId: string): boolean => {
    if (!userProgress) return false;
    const course = userProgress.enrolledCourses.find(c => c.courseId === courseId);
    return !!course?.quizPassed;
  };

  // Check if user has minted NFT for a course
  const hasNft = (courseId: string): boolean => {
    if (!userProgress) return false;
    const course = userProgress.enrolledCourses.find(c => c.courseId === courseId);
    return !!course?.nftMinted;
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        error,
        userProgress,
        enrollInCourse,
        updateQuizResults,
        markNftMinted,
        getQuizForCourse,
        isEnrolled,
        hasPassed,
        hasNft
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

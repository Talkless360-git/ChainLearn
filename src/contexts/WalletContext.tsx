
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

// Add Ethereum provider types
declare global {
  interface Window {
    ethereum?: {
      request: (args: {method: string; params?: any[]}) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

interface WalletContextType {
  account: string | null;
  balance: string;
  chainId: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  isCorrectNetwork: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

// ApeChain network parameters
const APECHAIN_TESTNET_PARAMS = {
  chainId: '0x3C3',
  chainName: 'ApeChain Testnet',
  nativeCurrency: {
    name: 'APE',
    symbol: 'APE',
    decimals: 18
  },
  rpcUrls: ['https://rpc-testnet.apechain.com'],
  blockExplorerUrls: ['https://explorer-testnet.apechain.com']
};

// For demo purposes this is the target network
// In a real app, we'd check if it's the correct ApeChain network
const TARGET_NETWORK_ID = APECHAIN_TESTNET_PARAMS.chainId;

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  // Check if MetaMask is available
  const hasMetaMask = (): boolean => {
    return typeof window !== "undefined" && window.ethereum !== undefined;
  };

  // Connect wallet
  const connectWallet = async (): Promise<void> => {
    if (!hasMetaMask()) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this application",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await getBalance(accounts[0]);
        const currentChainId = await window.ethereum!.request({
          method: 'eth_chainId'
        });
        setChainId(currentChainId);
        setIsCorrectNetwork(currentChainId === TARGET_NETWORK_ID);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = (): void => {
    setAccount(null);
    setBalance('0');
    setChainId(null);
  };

  // Get wallet balance
  const getBalance = async (address: string): Promise<void> => {
    if (!hasMetaMask() || !address) return;

    try {
      const balanceHex = await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      
      const balanceInWei = parseInt(balanceHex, 16);
      const balanceInEth = balanceInWei / 1e18;
      setBalance(balanceInEth.toFixed(4));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  // Switch to ApeChain network
  const switchNetwork = async (): Promise<void> => {
    if (!hasMetaMask()) return;

    try {
      await window.ethereum!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TARGET_NETWORK_ID }]
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum!.request({
            method: 'wallet_addEthereumChain',
            params: [APECHAIN_TESTNET_PARAMS]
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast({
            title: "Network Error",
            description: "Failed to add ApeChain network",
            variant: "destructive"
          });
        }
      } else {
        console.error('Error switching network:', switchError);
        toast({
          title: "Network Error",
          description: "Failed to switch to ApeChain network",
          variant: "destructive"
        });
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!hasMetaMask()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        getBalance(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(chainId);
      setIsCorrectNetwork(chainId === TARGET_NETWORK_ID);
      if (account) {
        getBalance(account);
      }
    };

    window.ethereum!.on('accountsChanged', handleAccountsChanged);
    window.ethereum!.on('chainChanged', handleChainChanged);

    // Check if already connected
    window.ethereum!.request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch((err: any) => console.error('Error checking accounts:', err));

    return () => {
      if (hasMetaMask()) {
        window.ethereum!.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum!.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account]);

  return (
    <WalletContext.Provider
      value={{
        account,
        balance,
        chainId,
        isConnecting,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        isCorrectNetwork
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

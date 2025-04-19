
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, X } from "lucide-react";
import AccessibilityControls from "./AccessibilityControls";

const Navbar: React.FC = () => {
  const { account, balance, connectWallet, disconnectWallet, isConnecting, switchNetwork, isCorrectNetwork } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Truncate wallet address for display
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-chainlearn-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-chainlearn-purple to-chainlearn-pink text-transparent bg-clip-text">
                ChainLearn
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/courses"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Courses
              </Link>
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <AccessibilityControls />
            
            {account ? (
              <div className="flex items-center space-x-4">
                {!isCorrectNetwork && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={switchNetwork}
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  >
                    Switch to ApeChain
                  </Button>
                )}
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      {truncateAddress(account)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Connected Wallet</p>
                        <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis">{account}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Balance</p>
                        <p className="text-lg font-bold">{balance} APE</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={disconnectWallet}
                        className="w-full"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="bg-chainlearn-purple hover:bg-chainlearn-purple/90"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <AccessibilityControls />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/dashboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              {account ? (
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <div className="text-base font-medium text-gray-800">Wallet</div>
                    <div className="text-sm text-gray-500">{truncateAddress(account)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Balance</div>
                    <div className="text-sm text-gray-500">{balance} APE</div>
                  </div>
                  <div className="flex gap-2">
                    {!isCorrectNetwork && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={switchNetwork}
                        className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                      >
                        Switch to ApeChain
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={disconnectWallet}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={connectWallet} 
                  disabled={isConnecting}
                  className="w-full bg-chainlearn-purple hover:bg-chainlearn-purple/90"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

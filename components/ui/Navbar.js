import React, { useState, useEffect } from "react";
import { useWeb3 } from "../providers/web3";

export default function Navbar({ accountAddress }) {
  const { web3, isLoading } = useWeb3();
  const [networkName, setNetworkName] = useState("");

  useEffect(() => {
    if (web3) {
      const getNetwork = async () => {
        try {
          const networkId = await web3.eth.net.getId();
          let name = "Unknown Network";
          switch (Number(networkId)) {
            case 1: name = "Ethereum"; break;
            case 11155111: name = "Sepolia"; break;
            case 137: name = "Polygon"; break;
            case 80001: name = "Mumbai"; break;
            case 42161: name = "Arbitrum"; break;
            case 421613: name = "Arbitrum Goerli"; break;
            case 5777: // Common Ganache ID for Truffle
            case 1337: // Common Ganache ID for Hardhat
              name = "Local Dev"; break;
            default: name = `Network ID: ${networkId}`; break;
          }
          setNetworkName(name);
        } catch (error) {
          console.error("Error fetching network ID:", error);
          setNetworkName("N/A");
        }
      };
      getNetwork();
    } else if (!isLoading) { // web3 is null and not loading, so no provider
      setNetworkName("Not Connected");
    } else { // Still loading
      setNetworkName("Loading...");
    }
  }, [web3, isLoading]);

  return (
    <>
      {/* Navbar */}
      <nav className="md:flex-row md:flex-nowrap md:justify-start flex items-center px-4 py-2 border bg-gray-700 border-gray-500">
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center"> {/* Modified this div to include network name */}
              <a
                className="text-white text-sm hidden lg:inline-block font-semibold"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Dashboard
              </a>
              {networkName && (
                <span className="text-white text-xs lg:inline-block ml-4 px-2 py-1 rounded-md bg-gray-600">
                  {networkName}
                </span>
              )}
            </div>
            <div className="px-4 py-1 text-white border bg-gray-800 border-gray-400 rounded-md">
              {accountAddress.slice(0, 7)}...
              {accountAddress.slice(accountAddress.length - 10)}
            </div>
          </div>
          {/* Form */}

          {/* User */}
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}

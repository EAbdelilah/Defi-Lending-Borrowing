import React from "react";
import { useWeb3 } from "../../../components/providers/web3";

const getNetworkName = (chainId) => {
  switch (chainId) {
    case 1:
      return "Ethereum";
    case 11155111:
      return "Sepolia";
    case 137:
      return "Polygon";
    case 80001:
      return "Mumbai";
    case 42161:
      return "Arbitrum One";
    case 421614:
      return "Arbitrum Sepolia";
    case null:
    case undefined:
      return "Connecting...";
    default:
      return "Unsupported Network";
  }
};

export default function Navbar({accountAddress}) { // accountAddress is still a prop
  const { chainId } = useWeb3();

  return (
    <>
      {/* Navbar */}
      <nav className="md:flex-row md:flex-nowrap md:justify-start flex items-center px-4 py-2 border bg-gray-700 border-gray-500">
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className="w-full flex items-center justify-between">
            <div className="flex justify-between">
              {" "}
              <a
                className="text-white text-sm hidden lg:inline-block font-semibold"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Dashboard
              </a>
            </div>
            <div className="flex items-center">
              <span className="text-white mr-3">{getNetworkName(chainId)}</span>
              { accountAddress && // Conditionally render account if available
                <div className="px-4 py-1 text-white border bg-gray-800 border-gray-400 rounded-md">
                  {accountAddress.slice(0,7)}...{accountAddress.slice(accountAddress.length-10)}
                </div>
              }
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

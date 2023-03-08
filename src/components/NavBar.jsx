import React, { useState } from "react";

import logo from "./../assets/logo.svg";

function Navbar({ wallet, connectWallet, disconnectWallet }) {
  const [isOpen, setIsOpen] = useState(false);
  console.log("Is Open:", isOpen);
  return (
    <>
      <div className="flex justify-between items-center px-4 md:px-24 py-4 h-[10vh] bg-[#343D46]">
        <div className="w-1/3 ">
          <img
            src={logo}
            width="50rem"
            alt="logo"
            // className="animate-spin-slow"
          />
        </div>
        <div className="w-1/3 hidden md:flex md:justify-center">
          <div className="inline mr-4 font-[500] text-lg  cursor-pointer text-white hover:text-[#B7E82E]">
            HOME
          </div>
        </div>

        <div className="w-1/3 flex justify-end text-black">
          {typeof window.ethereum !== "undefined" ? (
            wallet?.address ? (
              <button
                onClick={disconnectWallet}
                className="bg-[#B7E82E00] border-x-4  border-y-2 text-white  md:px-12 px-4 py-2 mr-3 rounded-xl font-semibold"
              >
                {wallet?.address?.slice(0, 5)}...{wallet?.address?.slice(-4)}
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-[#B7E82E00]  border-x-4  border-y-2 text-white   md:px-12 px-4 py-2 mr-3 rounded-xl"
              >
                Connect
              </button>
            )
          ) : (
            <a
              target="_blank"
              href="https://metamask.io/download/"
              className="bg-[#B7E82E00]  text-white  border-x-4  border-y-2  md:px-12 px-4 py-2 mr-3 rounded-xl"
              rel="noreferrer"
            >
              Install Metamask
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;

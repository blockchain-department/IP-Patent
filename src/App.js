import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./contracts/contract";
import Navbar from "./components/NavBar";
import axios from "axios";
import background from "./assets/bg.gif";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [wallet, setWallet] = useState({});
  const [json, setJson] = useState({});

  // Connect Wallet
  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.enable();
        const accounts = await window.ethereum.send("eth_requestAccounts");
        const _signer = new ethers.providers.Web3Provider(window.ethereum);
        let contract = new ethers.Contract(
          contractAddress,
          contractABI,
          _signer.getSigner()
        );
        // console.log("useee", contract);
        if (
          accounts?.result[0]?.toLowerCase() != wallet?.address?.toLowerCase()
        ) {
          setWallet({
            ...wallet,
            contract: contract,
            address: accounts?.result[0],
            provider: _signer,
            signer: _signer.getSigner(),
            network: await _signer.getNetwork(),
          });
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    }
    // else
    //  alert("Please install MetaMask");
  };
  // Switch Network
  const handleSwitchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x80001" }],
        });
      } catch (error) {
        if (error.code === 4902) {
          // alert("Please add this network to metamask!");
        }
      }
    }
  };
  // Disconnect Wallet
  const handleDisconnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("to be coded...");
      } catch (error) {
        console.log("Error:", error.message);
      }
    }
    // else alert("Please install MetaMask");
  };
  // Detect change in Metamask accounts
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => handleSwitchNetwork());
      window.ethereum.on("accountsChanged", () => handleConnectWallet());
    }
  });
  // Connect wallet on Refresh Page
  useEffect(() => {
    handleConnectWallet();

    // eslint-disable-next-line
  }, [wallet]);
  useEffect(() => {
    return () => {
      try {
        axios
          .get(
            "https://www.cre8.wtf//tix/downloads/JSON/0x4aafef0c862cd26899fa29f060c92a7fe1c1bfc3/user.json",
            // "https://cors-anywhere.herokuapp.com/https://www.cre8.wtf//tix/downloads/JSON/0x4aafef0c862cd26899fa29f060c92a7fe1c1bfc3/user.json",
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":
                  "Origin, X-Requested-With, Content-Type, Accept",
              },
            }
          )
          .then((res) => setJson(res?.data));
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  console.log("apiii", json);
  const mint = async () => {
    let price = await wallet?.contract?.mintPrice();
    try {
      await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: {
          name: json?.nft_name,
          description: `Description 1 ${wallet?.address}  `,
          image: json?.photo,
        },
        headers: {
          pinata_api_key: `5d84861fe44c09daaab5`,
          pinata_secret_api_key: `caf6aed134e58581ee9bff08d9bec1ec9564125d131802ad3a9bba663d75ab8a`,
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log("dataaaaaaaaaaaaa", res?.data?.IpfsHash);
        toast.info("Hash Created");
        JSON.stringify(res?.data?.IpfsHash);
        toast.promise(
          wallet?.contract
            ?.safeMint(
              wallet?.address,
              "https://gateway.pinata.cloud/ipfs/" +
                res?.data?.IpfsHash?.replaceAll('"', ""),
              { value: price }
            )
            .then((tx) =>
              tx.wait().then(() => toast.info("Minting Succesful"))
            ),
          {
            pending: "Start Minting...",
            success: "Minted Successfully 👌",
            error: "Promise rejected 🤯",
          }
        );
      });
    } catch (e) {
      console.error("ERRORRR", e);
    }
  };
  // console.log("Wallet:", wallet);
  return (
    <div className=" w-screen h-screen">
      <ToastContainer />

      <Navbar
        className=""
        wallet={wallet}
        connectWallet={handleConnectWallet}
        disconnectWallet={handleDisconnectWallet}
      />
      <div
        className=" flex justify-center items-center w-screen h-[90vh] bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <button
          onClick={mint}
          class=" bg-[#46474B] hover:bg-red-500 text-white  hover:text-white py-2 px-10 font-bold border-2 border-red-700 hover:border-transparent rounded"
        >
          Mint
        </button>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../App.css";
import TOKEN from "../abis/Token.json";
import config from "../config.json";

function App() {
  /*

  */
  const loadBlockchainData = async params => {
    // help you connect the browser to web3.O via metamask
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    console.log("accounts :>> ", accounts[0]);

    // Connect Ethers to Blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork(); // Destructuring
    console.log("network.chainId", chainId);

    // Token smart contract
    const token = new ethers.Contract(
      config[chainId].JEX.address,
      TOKEN.abi,
      provider
    );
    console.log("token.Address", token.address);
    const symbol = await token.symbol();
    console.log(symbol);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      {/* Navbar */}

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}

          {/* Balance */}

          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;

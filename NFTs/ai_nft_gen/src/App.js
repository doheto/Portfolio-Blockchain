import { useState, useEffect } from "react";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import axios from "axios";

// Components
import Spinner from "react-bootstrap/Spinner";
import Navigation from "./components/Navigation";

// ABIs
import NFT from "./abis/NFT.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [url, setURL] = useState(null);

  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const [supplyAvailable, setSupplyAvailable] = useState(0);
  const [ownerOf, setOwnerOf] = useState([]);
  const [explorerURL, setExplorerURL] = useState("https://etherscan.io");
  const [openseaURL, setOpenseaURL] = useState("https://opensea.io");
  const [isMinting, setIsMinting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [revealTime, setRevealTime] = useState(0);
  const [counter, setCounter] = useState(7);
  const [isCycling, setIsCycling] = useState(false);

  //here we getting the web3 access point, the network and nft interface
  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const network = await provider.getNetwork();

      const nft = new ethers.Contract(
        config[network.chainId].nft.address,
        NFT,
        provider
      );
      setNFT(nft);

      const maxSupply = await nft.methods.maxSupply().call();
      const totalSupply = await nft.methods.totalSupply().call();
      setSupplyAvailable(maxSupply - totalSupply);

      // if (account) {
      //   const ownerOf = await nft.methods.walletOfOwner(_account).call();
      //   setOwnerOf(ownerOf);
      // } else {
      //   setOwnerOf([]);
      // }
    } catch (error) {
      setIsError(true);
      setMessage(
        "Contract not deployed to current network, please change network in MetaMask"
      );
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const submitHandler = async e => {
    e.preventDefault();

    if (name === "" || description === "") {
      window.alert("Please provide a name and description");
      return;
    }

    setIsWaiting(true);

    // Call AI API to generate a image based on description
    const imageData = await createImage();

    // Upload image to IPFS (NFT.Storage)
    const url = await uploadImage(imageData);
    console.log(url);

    // Mint NFT: signing transaction, creating NFT on chain, paying the dev
    await mintImage(url);

    setIsWaiting(false);
    setMessage("");
  };

  const createImage = async () => {
    setMessage("Generating Image...");

    // You can replace this with different model API's
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;

    // Send the request
    const response = await axios({
      url: URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        inputs: description,
        options: { wait_for_model: true }
      }),
      responseType: "arraybuffer"
    });

    const type = response.headers["content-type"];
    const data = response.data;

    //Load String image from downloaded data
    const base64data = Buffer.from(data).toString("base64");
    // transform to js object a file-like object of immutable, raw data
    const img = `data:${type};base64,` + base64data;
    setImage(img);

    return data;
  };

  const uploadImage = async imageData => {
    setMessage("Uploading Image...");

    // Create instance to NFT.Storage
    const nftstorage = new NFTStorage({
      token: process.env.REACT_APP_NFT_STORAGE_API_KEY
    });

    // Send request to store image
    const { ipnft } = await nftstorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description
    });

    // Save the URL
    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
    setURL(url);

    return url;
  };

  const mintImage = async tokenURI => {
    setMessage("Waiting for Mint...");

    const signer = await provider.getSigner();
    const transaction = await nft
      .connect(signer)
      .mint(tokenURI, { value: ethers.utils.parseUnits("0.1", "ether") });
    await transaction.wait();
    console.dir(transaction);
  };

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <div className="form">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Create a name..."
            onChange={e => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Create a description..."
            onChange={e => setDescription(e.target.value)}
          />
          <input type="submit" value="Create & Mint" />
        </form>

        <div className="image">
          {!isWaiting && image ? (
            <img src={image} alt="AI generated image" />
          ) : isWaiting ? (
            <div className="image__placeholder">
              <Spinner animation="border" />
              <p>{message}</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {!isWaiting && url && (
        <p>
          View&nbsp;
          <a href={url} target="_blank" rel="noreferrer">
            Metadata
          </a>
        </p>
      )}
    </div>
  );
}

export default App;

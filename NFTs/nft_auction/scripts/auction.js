const Web3 = require("web3");
let web3 = new Web3("http://127.0.0.1:7545");

const nftBuild = require("../build/contracts/NFT.json");
const nftContract = new web3.eth.Contract(
  nftBuild.abi,
  nftBuild.networks[1].address
);

const auctionBuild = require("../build/contracts/Auction.json");
let auctionContract = new web3.eth.Contract(auctionBuild.abi);

const startingBid = web3.utils.toWei("1", "ether");
const nftIdToAuction = 1;
const allowAuctionFor = 3; // Time in seconds (3 seconds)

const main = async () => {
  const [owner, bidder1, bidder2] = await web3.eth.getAccounts();
  const balanceBefore = await web3.eth.getBalance(owner);

  const receipt = await auctionContract
    .deploy({
      data: auctionBuild.bytecode,
      arguments: [nftContract._address, nftIdToAuction, startingBid]
    })
    .send({ from: owner, gas: 2000000 });
  auctionContract = new web3.eth.Contract(auctionBuild.abi, receipt._address);

  console.log(`Starting Auction...\n`);

  // Start Bid
  await nftContract.methods
    .approve(auctionContract._address, nftIdToAuction)
    .send({ from: owner });
  await auctionContract.methods
    .start(allowAuctionFor)
    .send({ from: owner, gas: 2000000 });

  const nftId = await nftContract.methods
    .walletOfOwner(auctionContract._address)
    .call();
  console.log(
    `${auctionContract._address} (Auction Contract) now owns NFT ${nftId}\n`
  );

  // Bidder 1 sends in their bid
  const firstBid = web3.utils.toWei("5", "ether");
  await auctionContract.methods.bid().send({ from: bidder1, value: firstBid });

  // Fetch current highest bid/bidder
  let highestBid = await auctionContract.methods.highestBid().call();
  let highestBidder = await auctionContract.methods.highestBidder().call();
  console.log(
    `Highest Bid: ${web3.utils.fromWei(
      highestBid.toString(),
      "ether"
    )} ether from ${highestBidder}\n`
  );

  // Bidder 2 sends in their bid
  const secondBid = web3.utils.toWei("10", "ether");
  await auctionContract.methods.bid().send({ from: bidder2, value: secondBid });

  // Fetch current highest bid/bidder
  highestBid = await auctionContract.methods.highestBid().call();
  highestBidder = await auctionContract.methods.highestBidder().call();
  console.log(
    `Highest Bid: ${web3.utils.fromWei(
      highestBid.toString(),
      "ether"
    )} ether from ${highestBidder}\n`
  );

  console.log(`Waiting for auction to end...\n`);
  await wait(3000);

  // Reestablish connection
  web3 = new Web3("http://127.0.0.1:7545");
  auctionContract = new web3.eth.Contract(auctionBuild.abi, receipt._address);

  // End Bidding
  await auctionContract.methods.end().send({ from: owner, gas: 2000000 });

  const ownerCollection = await nftContract.methods.walletOfOwner(owner).call();
  const bidderCollection = await nftContract.methods
    .walletOfOwner(bidder2)
    .call();
  console.log(`${owner} (original owner) still owns NFTs ${ownerCollection}`);
  console.log(`${bidder2} (highest bidder) now owns NFT ${bidderCollection}\n`);

  const balanceAfter = await web3.eth.getBalance(owner);
  console.log(
    `Original owner balance before auction | ${web3.utils.fromWei(
      balanceBefore.toString(),
      "ether"
    )} ether`
  );
  console.log(
    `Original owner balance after auction  | ${web3.utils.fromWei(
      balanceAfter.toString(),
      "ether"
    )} ether\n`
  );
};

const wait = async ms => {
  return await new Promise(resolve => setTimeout(resolve, ms));
};

main();

const Web3 = require('web3');
require('dotenv').config();

const provider = new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_URL); 
const web3 = new Web3(provider);

// Lấy ABI & Address từ contract đã deploy
const contractABI = require('./contractABI.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3, contract };

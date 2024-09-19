// import React from 'react';

// const Newcode = () => {
//     return (
//         <div>
            
//         </div>
//     );
// };

// export default Newcode;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

// Replace these addresses with the actual contract addresses for different networks
const MANTLE_TOKEN_ADDRESSES = {
    1: '0xYourMantleMainnetAddress',    // Mainnet
    5: '0xYourMantleGoerliTestnetAddress' // Goerli Testnet (for example)
};

// Mantle Token ERC-20 ABI
const ERC20_ABI = [
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const YOUR_ACCOUNT = '0xYourAccountAddress';  // Replace with your account to receive tokens

const Newcode = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(0);
    const [mantleTokenAddress, setMantleTokenAddress] = useState(null);

    // Connect to MetaMask
    const connectToMetaMask = async () => {
        if (window.ethereum) {
            try {
                const web3Instance = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWeb3(web3Instance);
                setAccount(accounts[0]);

                // Get the connected network ID
                const networkId = await web3Instance.eth.net.getId();
                const mantleAddress = MANTLE_TOKEN_ADDRESSES[networkId];

                if (mantleAddress) {
                    setMantleTokenAddress(mantleAddress);
                    fetchBalance(web3Instance, accounts[0], mantleAddress);
                } else {
                    alert('Mantle token not available on this network.');
                }
            } catch (error) {
                console.error("User denied account access", error);
            }
        } else {
            alert('MetaMask not detected. Please install MetaMask.');
        }
    };

    // Fetch Mantle Token Balance
    const fetchBalance = async (web3Instance, userAccount, tokenAddress) => {
        const contract = new web3Instance.eth.Contract(ERC20_ABI, tokenAddress);
        try {
            const balance = await contract.methods.balanceOf(userAccount).call();
            const formattedBalance = web3Instance.utils.fromWei(balance, 'ether');  // Adjust decimal if needed
            setBalance(formattedBalance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Set Max Balance to Amount Input
    const setMaxBalance = () => {
        setAmount(balance);
    };

    // Handle Mantle Token Transfer
    const handleTransfer = async () => {
        if (!web3 || !account || !mantleTokenAddress) {
            alert('Connect to MetaMask first');
            return;
        }

        try {
            const contract = new web3.eth.Contract(ERC20_ABI, mantleTokenAddress);
            const valueToSend = web3.utils.toWei(amount.toString(), 'ether');  // Adjust decimal if needed

            await contract.methods.transfer(YOUR_ACCOUNT, valueToSend).send({ from: account });
            alert('Transfer successful!');
            fetchBalance(web3, account, mantleTokenAddress);  // Refresh balance after transfer
        } catch (error) {
            console.error('Transfer failed:', error);
            alert('Transfer failed.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Mantle Token Transfer</h1>
            {!account ? (
                <button onClick={connectToMetaMask}>Connect to MetaMask</button>
            ) : (
                <div>
                    <p>Connected Account: {account}</p>
                    <p>Your Mantle Token Balance: {balance}</p>
                    <input
                        type="text"
                        value={amount}
                        placeholder="Amount to transfer"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={setMaxBalance}>Max</button>
                    <button onClick={handleTransfer}>Transfer</button>
                </div>
            )}
        </div>
    );
};

export default Newcode;

import React, { useState } from 'react';
import Web3 from 'web3';

const TransferComponent = () => {
    const [web3, setWeb3] = useState(null);
    const [fromAddress, setFromAddress] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');

    // Function to initialize Web3 and connect to Metamask
    const connectToMetamask = async () => {
        if (window.ethereum) {
            try {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.enable(); // Request user permission to connect
                setWeb3(web3Instance);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error('Metamask not found. Please install Metamask to use this application.');
        }
    };

    // Function to handle balance transfer
    const handleTransfer = async () => {
        if (!web3) {
            console.error('Web3 not initialized');
            return;
        }

        try {
            const accounts = await web3.eth.getAccounts();
            const from = fromAddress.trim();
            const to = toAddress.trim();
            const value = web3.utils.toWei(amount.trim(), 'ether');

            // Transfer Ether
            await web3.eth.sendTransaction({
                from: accounts[0],
                to,
                value,
            });

            console.log('Transfer successful');
        } catch (error) {
            console.error('Transfer failed:', error);
        }
    };

    return (
        <div>
            <button onClick={connectToMetamask}>Connect to Metamask</button>
            <input
                type="text"
                placeholder="From Address"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
            />
            <input
                type="text"
                placeholder="To Address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
            />
            <input
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleTransfer}>Transfer</button>
        </div>
    );
};

export default TransferComponent;

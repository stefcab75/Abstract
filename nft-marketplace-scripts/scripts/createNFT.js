const ethers = require('ethers');
require('dotenv').config();

async function main() {
    try {
        // Configuration
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const tokenURI = 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1';
        const priceInWei = '1000000000000000000'; // 1 ETH in wei

        // ABI minimal pour la fonction createNFT
        const abi = [
            "function createNFT(string memory tokenURI, uint256 price) public returns (uint256)"
        ];

        console.log('Connecting to Abstract Testnet...');
        
        // Connexion au provider
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        console.log('Provider connected');

        // Création du wallet avec la clé privée
        const wallet = new ethers.Wallet(process.env.WALLET1_PRIVATE_KEY, provider);
        console.log('Wallet address:', wallet.address);

        // Création de l'instance du contrat
        const contract = new ethers.Contract(contractAddress, abi, wallet);
        console.log('Contract instance created');

        // Création du NFT
        console.log('Creating NFT...');
        console.log('Token URI:', tokenURI);
        console.log('Price:', ethers.utils.formatEther(priceInWei), 'ETH');

        const tx = await contract.createNFT(tokenURI, priceInWei, {
            gasLimit: 1000000
        });
        console.log('Transaction sent:', tx.hash);

        // Attente de la confirmation
        console.log('Waiting for confirmation...');
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        console.log('NFT created successfully!');

    } catch (error) {
        console.error('Error:', error.message);
        if (error.data) {
            console.error('Error data:', error.data);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

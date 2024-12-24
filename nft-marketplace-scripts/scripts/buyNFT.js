const ethers = require('ethers');
require('dotenv').config();

async function main() {
    try {
        // Configuration
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const tokenId = 1; // ID du NFT à acheter
        
        // ABI avec les fonctions nécessaires
        const abi = [
            "function buyNFT(uint256 tokenId) public payable",
            "function getNFTDetails(uint256 tokenId) public view returns (tuple(uint256 tokenId, address payable seller, address payable owner, uint256 price, bool isListed))",
            "function ownerOf(uint256 tokenId) public view returns (address)"
        ];

        console.log('Connecting to Abstract Testnet...');
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        console.log('Provider connected');

        // Création du wallet avec la clé privée
        const wallet = new ethers.Wallet(process.env.WALLET2_PRIVATE_KEY, provider);
        console.log('Wallet address:', wallet.address);

        // Création de l'instance du contrat
        const contract = new ethers.Contract(contractAddress, abi, wallet);
        console.log('Contract instance created');

        // Récupération des détails du NFT
        console.log(`\nGetting details for NFT #${tokenId}...`);
        const details = await contract.getNFTDetails(tokenId);
        console.log('Current owner:', await contract.ownerOf(tokenId));
        console.log('Price:', ethers.utils.formatEther(details.price), 'ETH');
        console.log('Listed for sale:', details.isListed);

        if (!details.isListed) {
            throw new Error('NFT is not listed for sale');
        }

        // Achat du NFT
        console.log('\nBuying NFT...');
        const tx = await contract.buyNFT(tokenId, {
            value: details.price,
            gasLimit: 1000000
        });
        console.log('Transaction sent:', tx.hash);

        // Attente de la confirmation
        console.log('Waiting for confirmation...');
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);

        // Vérification du nouveau propriétaire
        const newOwner = await contract.ownerOf(tokenId);
        console.log('\nNew owner:', newOwner);
        
        if (newOwner.toLowerCase() === wallet.address.toLowerCase()) {
            console.log('NFT purchased successfully!');
        } else {
            console.log('Warning: NFT owner is not the buyer. Transaction might have failed.');
        }

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

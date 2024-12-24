const ethers = require('ethers');
require('dotenv').config();

async function main() {
    try {
        // Configuration
        const contractAddress = process.env.CONTRACT_ADDRESS;
        
        // ABI avec toutes les fonctions nécessaires
        const abi = [
            "function getTotalNFTs() public view returns (uint256)",
            "function ownerOf(uint256 tokenId) public view returns (address)",
            "function tokenURI(uint256 tokenId) public view returns (string memory)",
            "function getNFTDetails(uint256 tokenId) public view returns (tuple(uint256 tokenId, address payable seller, address payable owner, uint256 price, bool isListed))",
            "function balanceOf(address owner) public view returns (uint256)"
        ];

        console.log('Connecting to Abstract Testnet...');
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        console.log('Provider connected');

        // Création de l'instance du contrat
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        // Récupération du nombre total de NFTs
        const totalNFTs = await contract.getTotalNFTs();
        console.log(`\nTotal NFTs in contract: ${totalNFTs.toString()}`);

        // Pour chaque NFT
        console.log('\nListing all NFTs:');
        console.log('================');
        
        for (let i = 0; i < totalNFTs; i++) {
            console.log(`\nNFT #${i + 1}:`);
            console.log('----------');
            
            try {
                // Récupération du propriétaire
                const owner = await contract.ownerOf(i + 1);
                console.log(`Owner: ${owner}`);
                
                // Récupération de l'URI
                try {
                    const uri = await contract.tokenURI(i + 1);
                    console.log('Token URI:', uri);
                } catch (error) {
                    console.log('Token URI: Unable to fetch');
                }
                
                // Récupération des détails du NFT
                try {
                    const details = await contract.getNFTDetails(i + 1);
                    console.log('Price:', ethers.utils.formatEther(details.price), 'ETH');
                    console.log('Listed for sale:', details.isListed);
                    if (details.isListed) {
                        console.log(`Seller: ${details.seller}`);
                    }
                } catch (error) {
                    console.log('Additional details not available');
                }
                
                // Vérification du solde du propriétaire
                const balance = await contract.balanceOf(owner);
                console.log(`Owner's NFT balance: ${balance.toString()}`);
                
            } catch (error) {
                console.log(`Error fetching NFT #${i + 1} details:`, error.message);
            }
        }

        console.log('\nNFT listing completed!');

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

# NFT Marketplace Scripts

Ce projet contient une collection de scripts pour interagir avec un NFT Marketplace sur la blockchain Abstract.

## Configuration

1. Copiez le fichier `.env.example` en `.env`
2. Remplissez les variables d'environnement dans `.env` avec vos propres valeurs :
   - `WALLET1_PRIVATE_KEY` : Clé privée du premier wallet
   - `WALLET2_PRIVATE_KEY` : Clé privée du second wallet
   - `CONTRACT_ADDRESS` : Adresse du contrat NFT Marketplace
   - `RPC_URL` : URL du RPC Abstract Testnet

## Installation

```bash
npm install
```

## Scripts disponibles

### 1. Créer un NFT
```bash
npm run create
# ou
node scripts/createNFT.js
```

### 2. Lister tous les NFTs
```bash
npm run list
# ou
node scripts/listAllNFTs.js
```

### 3. Acheter un NFT
```bash
npm run buy
# ou
node scripts/buyNFT.js
```

## Sécurité

- Ne jamais commiter le fichier `.env` contenant vos clés privées
- Ne jamais partager vos clés privées
- Toujours utiliser le fichier `.env` pour les informations sensibles

## Dépendances

- ethers.js v5.7.2
- dotenv

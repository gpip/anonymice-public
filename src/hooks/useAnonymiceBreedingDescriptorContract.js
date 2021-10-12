const { contractAbi, contractAddress } = require('../config/AnonymiceBreedingDescriptorContract.js');
const awaitTransactionMined = require('await-transaction-mined');

export default function useAnonymiceBreedingContract({ addTransaction, editTransaction }) {


    const AnonymiceBreedingDescriptor = new window.web3.eth.Contract(contractAbi, contractAddress);
    window.anonymiceBreedingContract = AnonymiceBreedingDescriptor;

    const tokenURI = async (tokenId) => AnonymiceBreedingDescriptor.methods.tokenURI(tokenId).call()
    const tokenIdToSVG = async (tokenId) => AnonymiceBreedingDescriptor.methods.tokenIdToSVG(tokenId).call()

    return { tokenURI, tokenIdToSVG };
}
const { contractAbi, contractAddress } = require('../config/AnonymiceBreedingContract');
const awaitTransactionMined = require('await-transaction-mined');

export default function useAnonymiceBreedingContract({ addTransaction, editTransaction }) {


    const AnonymiceBreeding = new window.web3.eth.Contract(contractAbi, contractAddress);
    window.anonymiceBreedingContract = AnonymiceBreeding;


    const _tokenToIncubator = async (tokenId) => AnonymiceBreeding.methods._tokenToIncubator(tokenId).call();

    const walletOfOwner = async (userAddress) => {
        const balance = await AnonymiceBreeding.methods.balanceOf(userAddress).call();

        const ids = []
        for (var i = 0; i < balance; i++) {
            const id = await AnonymiceBreeding.methods.tokenOfOwnerByIndex(userAddress, i).call();
            ids.push(id)
        }
        return ids;
    };

    const tokenURI = async (tokenId) => AnonymiceBreeding.methods.tokenURI(tokenId).call()
    const _tokenToRevealed = async (tokenId) => AnonymiceBreeding.methods._tokenToRevealed(tokenId).call();
    const _tokenIdToHash = async (tokenId) => AnonymiceBreeding.methods._tokenIdToHash(tokenId).call();


    const getAllBreedingEvents = async (userAddress) => {
        const breedingAmount = await AnonymiceBreeding.methods.getBreedingEventsLengthByAddress(userAddress).call();
        const breedingEvents = []
        for (var i = 0; i < breedingAmount; i++) {
            const breedingEvent = await AnonymiceBreeding.methods._addressToBreedingEvents(userAddress, i).call();
            breedingEvent.breedingEventId = breedingEvent.breedingEventId;
            breedingEvents.push(breedingEvent);
        }

        return breedingEvents
    }

    const initiateBreeding = async (userAddress, mouse1, mouse2) => {

        try {
            const transaction = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    //nonce: accountNonce,
                    from: userAddress,
                    to: contractAddress,
                    data: AnonymiceBreeding.methods.initiateBreeding(mouse1, mouse2).encodeABI(),
                }]
            })


            addTransaction({ status: 0, title: `Initiating breeding...`, hash: transaction });
            //Pending
            const minedTxReceipt = await awaitTransactionMined.awaitTx(window.web3, transaction, { blocksToWait: 1 });

            //Finished
            if (minedTxReceipt.status) {
                console.log(minedTxReceipt)
                editTransaction({ status: 1, hash: minedTxReceipt.transactionHash });
            } else {
                editTransaction({ status: 2, hash: minedTxReceipt.transactionHash });
            }
        } catch (error) {
        }
    }

    const pullParents = async (userAddress, index) => {

        try {
            const transaction = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    //nonce: accountNonce,
                    from: userAddress,
                    to: contractAddress,
                    data: AnonymiceBreeding.methods.pullParentsByBreedingEventIndex(index).encodeABI(),
                }]
            })


            addTransaction({ status: 0, title: `Pulling parents...`, hash: transaction });
            //Pending
            const minedTxReceipt = await awaitTransactionMined.awaitTx(window.web3, transaction, { blocksToWait: 1 });

            //Finished
            if (minedTxReceipt.status) {
                console.log(minedTxReceipt)
                editTransaction({ status: 1, hash: minedTxReceipt.transactionHash });
            } else {
                editTransaction({ status: 2, hash: minedTxReceipt.transactionHash });
            }
        } catch (error) {
        }
    }


    const speedUpParentRelease = async (userAddress, breedingIndex, cheethAmount) => {

        try {
            const transaction = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    //nonce: accountNonce,
                    from: userAddress,
                    to: contractAddress,
                    data: AnonymiceBreeding.methods.speedUpParentRelease(breedingIndex, cheethAmount).encodeABI(),
                }]
            })


            addTransaction({ status: 0, title: `Speeding up parents release`, hash: transaction });
            //Pending
            const minedTxReceipt = await awaitTransactionMined.awaitTx(window.web3, transaction, { blocksToWait: 1 });

            //Finished
            if (minedTxReceipt.status) {
                console.log(minedTxReceipt)
                editTransaction({ status: 1, hash: minedTxReceipt.transactionHash });
            } else {
                editTransaction({ status: 2, hash: minedTxReceipt.transactionHash });
            }
        } catch (error) {
        }
    }



    const speedUpChildReveal = async (userAddress, breedingIndex, cheethAmount) => {

        try {
            const transaction = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    //nonce: accountNonce,
                    from: userAddress,
                    to: contractAddress,
                    data: AnonymiceBreeding.methods.speedUpChildReveal(breedingIndex, cheethAmount).encodeABI(),
                }]
            })


            addTransaction({ status: 0, title: `Speeding up child reveal`, hash: transaction });
            //Pending
            const minedTxReceipt = await awaitTransactionMined.awaitTx(window.web3, transaction, { blocksToWait: 1 });

            //Finished
            if (minedTxReceipt.status) {
                console.log(minedTxReceipt)
                editTransaction({ status: 1, hash: minedTxReceipt.transactionHash });
            } else {
                editTransaction({ status: 2, hash: minedTxReceipt.transactionHash });
            }
        } catch (error) {
        }
    }

    const reveal = async (userAddress, tokenId) => {

        try {
            const transaction = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    //nonce: accountNonce,
                    from: userAddress,
                    to: contractAddress,
                    data: AnonymiceBreeding.methods.revealBaby(tokenId).encodeABI(),
                }]
            })


            addTransaction({ status: 0, title: `Revealing baby...`, hash: transaction });
            //Pending
            const minedTxReceipt = await awaitTransactionMined.awaitTx(window.web3, transaction, { blocksToWait: 1 });

            //Finished
            if (minedTxReceipt.status) {
                console.log(minedTxReceipt)
                editTransaction({ status: 1, hash: minedTxReceipt.transactionHash });
            } else {
                editTransaction({ status: 2, hash: minedTxReceipt.transactionHash });
            }
        } catch (error) {
        }
    }



    return { AnonymiceBreeding, getAllBreedingEvents, initiateBreeding, tokenURI, _tokenToIncubator, walletOfOwner, _tokenToRevealed, reveal, pullParents, speedUpChildReveal, speedUpParentRelease, _tokenIdToHash };
}
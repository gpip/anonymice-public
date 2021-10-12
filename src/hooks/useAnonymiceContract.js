const { contractAbi, contractAddress } = require('../config/AnonymiceContract');
const awaitTransactionMined = require('await-transaction-mined');

export default function useAnonymiceContract({ addTransaction, editTransaction }) {


    const Anonymice = new window.web3.eth.Contract(contractAbi, contractAddress);
    window.anonymiceContract = Anonymice;

    const walletOfOwner = async (userAddress) => Anonymice.methods.walletOfOwner(userAddress).call();
    const _tokenIdToHash = async (tokenId) => Anonymice.methods._tokenIdToHash(tokenId).call();
    const hashToSVG = async (tokenId) => Anonymice.methods.hashToSVG(tokenId).call();
    const isApprovedForAll = async (userAddress, operator) => Anonymice.methods.isApprovedForAll(userAddress, operator).call();
    const tokenURI = async (tokenId) => Anonymice.methods.tokenURI(tokenId).call();


    const setApprovalForAll = async (userAddress, operator) => {

        try {
            const transaction = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    //nonce: accountNonce,
                    from: userAddress,
                    to: contractAddress,
                    data: Anonymice.methods.setApprovalForAll(operator, true).encodeABI(),
                }]
            })


            addTransaction({ status: 0, title: `Setting approval for all...`, hash: transaction });
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


    return { Anonymice, walletOfOwner, setApprovalForAll, isApprovedForAll, hashToSVG, _tokenIdToHash, tokenURI };
}
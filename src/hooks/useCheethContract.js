const { contractAbi, contractAddress } = require('../config/CheethContract');
const { contractAddress: breedingContractAddress } = require('../config/AnonymiceBreedingContract');
const awaitTransactionMined = require('await-transaction-mined');

export default function useCheethContract({ addTransaction, editTransaction }) {


    const Cheeth = new window.web3.eth.Contract(contractAbi, contractAddress);
    window.cheethContract = Cheeth;

    const balanceOf = async (userAddress) => Cheeth.methods.balanceOf(userAddress).call();
    
    const allowance = async (userAddress) => Cheeth.methods.allowance(userAddress, breedingContractAddress).call()

    const approve = async (userAddress) => {
        try {
            const transaction = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    //nonce: accountNonce,
                    from: userAddress,
                    to: contractAddress,
                    data: Cheeth.methods.approve(breedingContractAddress, '30000000000000000000000000').encodeABI(),
                }]
            });


            addTransaction({ status: 0, title: `Setting approval`, hash: transaction });
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
            console.log(error)
        }
    }


    return { Cheeth, balanceOf, approve, allowance };
}
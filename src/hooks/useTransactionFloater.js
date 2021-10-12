import TransactionFloaters from "../components/TransactionFloaters";
import { useState } from "react";

export default function useTransactionFloaters() {

    const [transactions, setTransactions] = useState([]);


    const addTransaction = (transaction) => {
        setTransactions(transactions => {
            const transactionsCopy = JSON.parse(JSON.stringify(transactions));
            transaction.createdAt = Date.now();
            transactionsCopy.push(transaction);
            return transactionsCopy;
        })
    }

    const removeTransaction = (transactionToRemove) => {
        setTransactions(transactions => {
            const transactionsCopy = JSON.parse(JSON.stringify(transactions));
            transactionsCopy.splice(transactionsCopy.findIndex(a => a.hash == transactionToRemove.hash), 1)
            return transactionsCopy;
        })
    }

    const editTransaction = (transaction) => {
        setTransactions(transactions => {
            const transactionsCopy = JSON.parse(JSON.stringify(transactions));
            if (transactionsCopy.findIndex(a => a.hash == transaction.hash) == -1) return transactionsCopy;

            
            transactionsCopy[transactionsCopy.findIndex(a => a.hash == transaction.hash)].status = transaction.status;
            transactionsCopy[transactionsCopy.findIndex(a => a.hash == transaction.hash)].finishedAt = Date.now();
            return transactionsCopy;
        })
    }

    return {
        transactions,
        transactionHandlers: {
            addTransaction,
            removeTransaction,
            editTransaction
        }
    }
}

import { useState, useEffect } from 'react';


export default function useMetaMask() {

    const [userWallet, setUserWallet] = useState();

    const setUserWalletMetaMask = async () => {
        if (!window.ethereum) return;
        const wallets = await window.web3.eth.getAccounts();
        const address = wallets[0];

        if (!address) return setUserWallet(null);

        const balanceInWei = await window.web3.eth.getBalance(address);
        const balanceInEth = window.web3.utils.fromWei(balanceInWei);

        setUserWallet({ address, wei: balanceInWei, eth: balanceInEth })
    }


    useEffect(() => {
        setUserWalletMetaMask();
        window?.ethereum?.on('accountsChanged', setUserWalletMetaMask)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return userWallet
}

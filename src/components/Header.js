import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(props) {
    return (
        <div className="header">
            <div className="top-nav">

               
                <Link to="/breeding">Breeding</Link>
                <Link to="/staking">Staking</Link>
                <Link to="/about">About</Link>

                <div className="wallet-container">
                    {
                        props.userWallet?.address
                            ? <> <span className="wallet-address"> <Link to="/my-mice">{props.userWallet.address.substring(0, 7)}...</Link> </span> <span className="wallet-amount"> {parseFloat(props.userWallet.eth).toFixed(2)} ETH</span> </>
                            : <button className="connect-wallet small-connect" onClick={() => {
                                if (!window?.ethereum) {
                                    return //window.location.href = "/metamask";
                                }
                                window?.ethereum?.enable();

                            }}> Connect Wallet </button>
                    }
                </div>

            </div>

        </div>
    )
}

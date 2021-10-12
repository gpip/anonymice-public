import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@material-ui/core';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import ErrorIcon from '@material-ui/icons/Error';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import TimerIcon from '@material-ui/icons/Timer';
import moment from 'moment'
import useInterval from 'use-interval';


const TransactionTimer = (props) => {
    const [currentTime, setCurrentTime] = useState(Date.now())

    useInterval(() => { setCurrentTime(Date.now()) }, 1000)

    return <div className="transaction-timer">
        {
            props.finishedAt
            ?<span> {moment((props.finishedAt - props.createdAt)).format("mm:ss")} </span> 
            :<span> {moment((currentTime - props.createdAt)).format("mm:ss")} </span>
        }
        <TimerIcon />
    </div>
}

export default function TransactionFloaters(props) {


    return (
        <div className="transaction-floaters">
            {
                props?.transactions?.map(transaction => {
                    return <div className="transaction-floater" key={transaction.hash}>
                        <div className="floater-top">
                            <div className="floater-item">
                                {
                                    {
                                        0: <CircularProgress size={20} htmlColor={'white'} />,
                                        1: <DoneOutlineIcon htmlColor={'green'} />,
                                        2: <ErrorIcon htmlColor={'red'} />
                                    }[transaction.status]
                                }

                            </div>
                            <div className="floater-item">
                                <div className="title">
                                    {transaction?.title}
                                </div>

                                <div className="status">
                                    {
                                        {
                                            0: 'Waiting...',
                                            1: 'Completed!',
                                            2: 'Failed :('
                                        }[transaction.status]
                                    }
                                </div>
                            </div>
                            <div className="floater-item remove-transaction" onClick={() => {
                                props.transactionHandlers.removeTransaction(transaction)
                            }}>
                                <HighlightOffIcon />
                            </div>
                        </div>
                        <div className="floater-bottom">
                            <span>
                                {moment(transaction?.createdAt).format("h:mm a")}
                            </span>
                            <span> 
                                <TransactionTimer createdAt={transaction?.createdAt} finishedAt={transaction?.finishedAt} />
                            </span>
                            <span>
                                <a
                                    target="_blank"
                                    href={
                                        process.env.REACT_APP_TESTNET
                                            ? `https://rinkeby.etherscan.io/tx/${transaction.hash}`
                                            : `https://etherscan.io/tx/${transaction.hash}`
                                    }>
                                    View on etherscan
                                </a>
                            </span>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

import React, { useState, useEffect } from 'react';
import useInterval from 'use-interval';
import useAnonymiceContract from '../hooks/useAnonymiceContract';
import useCheethContract from '../hooks/useCheethContract';
import web3 from 'web3'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import useAnonymiceBreedingContract from '../hooks/useAnonymiceBreedingContract';
import useAnonymiceBreedingDescriptorContract from '../hooks/useAnonymiceBreedingDescriptorContract'
const MySwal = withReactContent(Swal);


const { contractAddress: breedingContractAddress } = require('../config/AnonymiceBreedingContract');

const BreedingEvent = (props) => {
    const [cheethInput, setCheethInput] = useState("");
    const blocksLeft = props.currentBlock < parseInt(props.breedingEvent.releaseBlock) ? parseInt(props.breedingEvent.releaseBlock) - props.currentBlock : 0;

    return <div className="action-box breeding-event">
            <div className="locked-parents">
                <span>
                    <span>{props.breedingEvent.parentId1}</span>
                    <img src={`https://raw.githubusercontent.com/jozanza/anonymice-images/main/${props.breedingEvent.parentId1}.png`} />
                </span>
                <span>
                    <span>{props.breedingEvent.parentId2}</span>
                    <img src={`https://raw.githubusercontent.com/jozanza/anonymice-images/main/${props.breedingEvent.parentId2}.png`} />
                </span>
            </div>
            <div className="speed-ups">
                <p>Blocks left: {props.currentBlock < parseInt(props.breedingEvent.releaseBlock) ? parseInt(props.breedingEvent.releaseBlock) - props.currentBlock : 0}<i>Approx 84 hours</i></p>

                {
                    blocksLeft == 0
                    ? <button onClick={() => props.handlers.pullParents(props?.userWallet?.address, props.breedingEvent.breedingEventId)}> Unlock Parents </button>
                    : <><input value={cheethInput} placeholder="🧀 Amount" onChange={(e) => { setCheethInput(e.target.value) }} />
                    <button onClick={() => {
                        var cheethAmount = web3.utils.toWei(cheethInput, 'ether');
                        props.handlers.speedUpParentRelease(props?.userWallet?.address, props.breedingEvent.breedingEventId, cheethAmount);
                    }}> Speed up </button></>
                }

                

                
            </div>
    </div>
}


const BabyMouse = (props) => {
    const [cheethInput, setCheethInput] = useState("");

    return <div className="baby-mouse">

        

        <img src={props.babyMouse.image} />
        <span>
            #{props.babyMouse.tokenId}
        </span>

        {
            props.babyMouse.revealed
                ? <div className="parent-images">
                    <div className="parent-container">
                        <span>{props?.babyMouse?.parent1ID}</span>
                        <img src={props.babyMouse.parent1Image} className="parent-image" />
                    </div>
                    <div className="parent-container">
                        <span>{props?.babyMouse?.parent2ID}</span>
                        <img src={props.babyMouse.parent2Image} className="parent-image" />
                    </div>

                </div>
                : ''
        }


        {props.babyMouse.revealed ? '' : <>

            <input value={cheethInput} placeholder="Cheeth Amount" onChange={(e) => { setCheethInput(e.target.value) }} />
            <button onClick={() => {
                var cheethAmount = web3.utils.toWei(cheethInput, 'ether');
                props.handlers.speedUpChildReveal(props?.userWallet?.address, props.babyMouse.tokenId, cheethAmount);
            }}> Speed up </button>
            <button onClick={() => props.handlers.reveal(props?.userWallet?.address, props.babyMouse.tokenId)}> Reveal </button>
        </>
        }
    </div>
}

export default function Breeding(props) {
    const [cheethBalance, setCheethBalance] = useState();
    const [myMice, setMyMice] = useState([]);
    const [breedingEvents, setBreedingEvents] = useState([]);

    const [approvedForAll, setApprovedForAll] = useState();
    const [allowance, setAllowance] = useState();
    const [miceInput, setMiceInput] = useState([]);
    const [currentBlock, setCurrentBlock] = useState("");
    const [babyMice, setBabyMice] = useState([]);

    const { walletOfOwner, setApprovalForAll, isApprovedForAll, _tokenIdToHash: _tokenIdToParentHash, hashToSVG, tokenURI: parentTokenURI } = useAnonymiceContract(props.handlers.transactionHandlers);
    const { balanceOf, allowance: getAllowance, approve } = useCheethContract(props.handlers.transactionHandlers);
    const { getAllBreedingEvents, initiateBreeding, _tokenToIncubator, walletOfOwner: babyMiceWallet, _tokenToRevealed, reveal, pullParents, _tokenIdToHash: _tokenIdToBabyHash, speedUpParentRelease, speedUpChildReveal } = useAnonymiceBreedingContract(props.handlers.transactionHandlers);
    const { tokenURI, tokenIdToSVG } = useAnonymiceBreedingDescriptorContract(props.handlers.transactionHandlers);



    const handleMouseInput = (index, input) => {
        setMiceInput(miceInput => {
            const miceInputCopy = [...miceInput];
            miceInputCopy[index] = input;
            return miceInputCopy;
        })
    }

    const refresh = async () => {
        try {

            if (!props?.userWallet?.address) return;

            var [
                cheethBalance,
                approvedForAll,
                allowance,
                myMice,
                breedingEvents,
                currentBlock,
                babyMice
            ] = await Promise.all([
                balanceOf(props?.userWallet?.address),
                isApprovedForAll(props?.userWallet?.address, breedingContractAddress),
                getAllowance(props?.userWallet?.address, breedingContractAddress),
                walletOfOwner(props?.userWallet?.address),
                getAllBreedingEvents(props?.userWallet?.address),
                window.web3.eth.getBlockNumber(),
                babyMiceWallet(props?.userWallet?.address)
            ]);

            console.log(babyMice)

            setCheethBalance(cheethBalance);
            setApprovedForAll(approvedForAll);
            setAllowance(allowance);
            setMyMice(myMice);
            setCurrentBlock(parseInt(currentBlock));
            console.log('d')

            babyMice = await Promise.all(babyMice.map(async babyMouse => {
                var childImage = await tokenURI(babyMouse);
                var incubator = await _tokenToIncubator(babyMouse);
                var revealed = await _tokenToRevealed(babyMouse);


                let [parent1Image, parent2Image] = await Promise.all([
                    parentTokenURI(incubator.parentId1),
                    parentTokenURI(incubator.parentId2)
                ]);

                return {
                    image: JSON.parse(atob(childImage.split(",")[1])).image,
                    tokenId: babyMouse,
                    revealed,
                    incubator,
                    childHash: await _tokenIdToBabyHash(babyMouse),
                    parent1Image: JSON.parse(atob(parent1Image.split(",")[1])).image,
                    parent2Image: JSON.parse(atob(parent2Image.split(",")[1])).image,
                    parent1Hash: await _tokenIdToParentHash(incubator.parentId1),
                    parent2Hash: await _tokenIdToParentHash(incubator.parentId2),
                    parent1ID: await incubator.parentId1,
                    parent2ID: await incubator.parentId2
                };
            }))

            setBabyMice(babyMice)
            setBreedingEvents(breedingEvents);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        refresh()
    }, [props?.userWallet?.address])

    const breedAlotOfMice = () => {

        for (var i = 0; i < 20; i++) {
            const mouse1 = myMice[i * 2];
            const mouse2 = myMice[i * 2 + 1];

            console.log()
            initiateBreeding(props?.userWallet?.address, mouse1, mouse2);
        }

    }


    useInterval(() => {
        refresh()
    }, 5000)

    return (
        <div>

            <div className="content-block">
                <h2>Available Parents</h2>
                <p>These are your available parents. <br/>Select 2 to breed together. <br/>It costs 50 cheeth to breed.</p>
                <div className="mice-grid">
                    {myMice.map(mouse => {
                        return <div className="card">
                            <img src={`https://raw.githubusercontent.com/jozanza/anonymice-images/main/${mouse}.png`} />
                            <span>{mouse}</span>
                        </div>
                    })}
                </div>
            
                {
                    approvedForAll
                        ? <div className="button-completed">✔️ Breeding Approved</div>
                        : <button onClick={() => {
                            setApprovalForAll(props?.userWallet?.address, breedingContractAddress)
                        }}> Approve breeding </button>
                }

                {
                    parseInt(allowance) > 0
                        ? <div className="button-completed">✔️ Cheeth Approved</div>
                        : <button onClick={() => {
                            approve(props?.userWallet?.address)
                        }}> Set allowance to infinite</button>
                }

                <div className="cheeth-balance">🧀: {cheethBalance ? web3.utils.fromWei(cheethBalance, 'ether') : ''}</div>

                <div className="action-box breeding-action">
                    <input value={miceInput[0]} placeholder="Parent ID 1" onChange={(e) => { handleMouseInput(0, e.target.value) }} />
                    <input value={miceInput[1]} placeholder="Parent ID 2" onChange={(e) => { handleMouseInput(1, e.target.value) }} />
                    <span className="cheeth-icon"><span>🧀</span>50</span>
                    <button onClick={() => {
                        initiateBreeding(props?.userWallet?.address, miceInput[0], miceInput[1]);
                    }}> Breed! </button>
                </div>
            </div>

            <div className="content-block">

                <h2>Breeding Couples ({breedingEvents.length})</h2>
                <p>These parents are time-locked in the breeding contract. You can pay CHEETH to speed them up. When blocks left is 0, you can unlock them.</p>

                <div className="breeding-events-container">
                    {breedingEvents.map((breedingEvent) => {
                        return <BreedingEvent key={breedingEvent.breedingEventId} {...props} handlers={{ speedUpParentRelease, pullParents }} breedingEvent={breedingEvent} currentBlock={currentBlock} />
                    })}
                </div>

            </div>

            <div className="content-block">

                <h2>Baby Mice ({babyMice.length})</h2>

                <div className="baby-mice-container">
                    {babyMice.map(babyMouse => {
                        return <BabyMouse key={babyMouse.babyMouseId} {...props} handlers={{ speedUpChildReveal, reveal }} babyMouse={babyMouse} currentBlock={currentBlock} />
                    })}
                </div>

            </div>


        </div>
    )
}

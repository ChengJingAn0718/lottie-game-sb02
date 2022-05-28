import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components'
import { blinkFunc, prePathUrl, stopBlinkFunc } from "../../components/CommonFunctions";
import { Player } from '@lottiefiles/react-lottie-player';

import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';
import { returnVoicePath } from "../../components/CommonFunctions"

const BaseDiv = styled.div`
position: absolute;
width: 100%;
height: 100%;
left : 0%;
top : 0%;
`

let timerList = []
let eyeAniNum
export default React.forwardRef(function LetterExplain({ nextFunc, audioList, _geo, _baseGeo }, ref) {


    const characterList = [useRef(), useRef(), useRef()];
    const eyeListRef = [useRef(), useRef(), useRef(), useRef()]

    const backgroundRef = useRef();
    const aniObjectRef = useRef();

    const [aniState, setAniState] = useState(0)
    const animationPathList = [
        'normal',
        'hi',
        'point_horizon',
        // 'point_stand'
    ]

    const animationScaleList = [
        { s: '100', t: '10%, 10%', },
        { s: '80', t: '8% ,15%' },
        { s: '100', t: '10%, 10%' },
        // { s: '120', t: '15%, 0%' },
    ]

    const durationList = [
        3, //intro
        3, //go
        3 //zoom
    ]


    useEffect(
        () => {

            audioList.bodyAudio1.src = prePathUrl() + "sounds/origin/ep_02_audio_02.mp3" //hello voice
            audioList.bodyAudio3.src = prePathUrl() + "sounds/origin/ep_02_audio_51.mp3"   //exlain voice  
            audioList.bodyAudio2.src = prePathUrl() + "sounds/origin/ep_02_audio_52.mp3"   //exlain voice  

            moveFunc(aniObjectRef, 0, 'translateX(130%)')
            moveFunc(backgroundRef, 0, 'translateX(-50%)')

            eyeAniNum = blinkFunc(eyeListRef, 0, 3500)

            return () => {

                audioList.bodyAudio1.pause()
                audioList.bodyAudio2.pause()
                audioList.bodyAudio3.pause()

                timerList.map(timer => clearTimeout(timer))

                stopBlinkFunc(eyeAniNum)

            }
        }, []
    )

    function moveFunc(obj, transition, transform) {
        obj.current.style.transition = transition + 's'
        obj.current.style.transform = transform
    }


    function introFunc() {
        let introDuration = durationList[0]
        moveFunc(aniObjectRef, introDuration, 'translateX(80%)')

        timerList[0] = setTimeout(() => {
            audioList.bodyAudio1.play()
            setAniState(1)

            timerList[1] = setTimeout(() => {
                goFunc()
            }, audioList.bodyAudio1.duration * 1000);
        }, introDuration * 1000);
    }

    function goFunc() {
        setAniState(0)
        let moveDuration = durationList[1]

        moveFunc(backgroundRef, moveDuration, 'translateX(30%)')
        moveFunc(aniObjectRef, moveDuration, 'translateX(20%)')

        timerList[2] = setTimeout(() => {
            setAniState(2)
            audioList.bodyAudio3.play()
            timerList[3] = setTimeout(() => {
                audioList.bodyAudio2.play()
                timerList[4] = setTimeout(() => {
                    zoomFunc()
                }, 1000);
            }, audioList.bodyAudio3.duration * 1000);
        }, moveDuration * 1000);
    }

    function zoomFunc() {
        moveFunc(backgroundRef, durationList[2], 'scale(0.7) translate(10%,10%)')

        timerList[5] = setTimeout(() => {
            nextFunc()
        }, durationList[2] * 1000 + 3000);
    }

    React.useImperativeHandle(ref, () => ({
        playGame: () => {
            timerList[6] = setTimeout(() => {
                introFunc()
            }, 500);

        },
    }))

    const objectPos = {
        ani: 1, w: 0.4, l: -0.1, b: 0.0, p: 'mouse'
    }

    return (
        <div className="aniObject">
            <div ref={backgroundRef}
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px",
                    left: _baseGeo.left + "px"
                    , bottom: 0 + 'px',
                    pointerEvents: 'none'
                }}>
                {/* bg */}
                <BaseImage
                    scale={2}
                    posInfo={{ l: -0.5, b: -0.3 }}
                    url={"movebg/sb02_bg_16.svg"} />

                <BaseImage
                    url={'character/sb02_ci_mouse.svg'}
                    scale={0.4}
                    posInfo={{ l: -0.1, b: 0.005 }}
                />

                {
                    Array.from(Array(4).keys()).map(
                        value =>
                            <BaseImage
                                ref={eyeListRef[value]}
                                url={'character/sb02_ci_mouse_eye_0' + (value + 1) + '.svg'}
                                scale={0.11}
                                posInfo={{ l: 0.0785, b: 0.53 }}
                                className={value > 0 ? 'hideObject' : ''}
                            />
                    )


                }
                <BaseDiv
                    ref={aniObjectRef}

                >
                    {
                        animationPathList.map((value, index) =>
                            <Player
                                ref={characterList[index]}
                                loop
                                autoplay
                                className={aniState == index ? 'showObject' : 'hideObject'}
                                keepLastFrame={true}
                                src={prePathUrl() + 'lottiefiles/character/bee_' + value + '.json'}
                                style={{
                                    position: 'absolute',
                                    width: '15%',
                                    left: '20%',
                                    bottom: '40%',
                                    pointerEvents: 'none',
                                    overflow: 'visible',
                                    transform: 'scale(' + animationScaleList[index].s +
                                        '%) translate(' + animationScaleList[index].t + ') rotateY(180deg)'
                                }}
                            >
                            </Player>
                        )
                    }
                </BaseDiv>

            </div>
        </div >
    );
})
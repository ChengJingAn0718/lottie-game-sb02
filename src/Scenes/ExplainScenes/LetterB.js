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
    const backgroundRef = useRef();
    const aniObjectRef = useRef();

    const eyeListRef = [useRef(), useRef(), useRef(), useRef()]

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
        2 //zoom
    ]

    const objectPos = {
        ani: 1, w: 0.16, l: 1.05, b: 0.05, p: 'bear'
    }
    useEffect(
        () => {

            audioList.bodyAudio1.src = prePathUrl() + "sounds/origin/ep_02_audio_02.mp3" //hello voice
            audioList.bodyAudio2.src = prePathUrl() + "sounds/origin/ep_02_audio_14.mp3"   //exlain voice    
            // audioList.bodyAudio2.src = prePathUrl() + "sounds/origin/ep_02_audio_14.mp3"   //exlain voice    

            moveFunc(aniObjectRef, 0, 'translateX(-35%)')

            eyeAniNum = blinkFunc(eyeListRef, 0, 3500)

            return () => {

                timerList.map(timer => clearTimeout(timer))
                audioList.bodyAudio1.pause()
                audioList.bodyAudio2.pause()

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
        moveFunc(aniObjectRef, introDuration, 'translateX(20%)')

        timerList[0] = setTimeout(() => {
            setAniState(1)
            audioList.bodyAudio1.play()
            timerList[1] = setTimeout(() => {
                goFunc()
            }, audioList.bodyAudio1.duration * 1000);
        }, introDuration * 1000);
    }

    function goFunc() {
        setAniState(0)
        let moveDuration = durationList[1]

        moveFunc(backgroundRef, moveDuration, 'translateX(-40%)')
        moveFunc(aniObjectRef, moveDuration, 'translateX(60%)')

        timerList[3] = setTimeout(() => {
            setAniState(2)
            audioList.bodyAudio2.play()
            timerList[4] = setTimeout(() => {
                zoomFunc()
            }, 1000);

        }, moveDuration * 1000);
    }

    function zoomFunc() {
        moveFunc(backgroundRef, durationList[2], 'scale(1.2) translate(-65%,-5%)')

        timerList[5] = setTimeout(() => {
            nextFunc()
        }, durationList[2] * 1000 + 2000);
    }

    React.useImperativeHandle(ref, () => ({
        playGame: () => {
            timerList[6] = setTimeout(() => {
                introFunc()
            }, 500);

        },
    }))



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
                    scale={3.2}
                    posInfo={{ l: 0.0, t: 0.0 }}
                    url={"movebg/sb02_bg_01.svg"} />

                <BaseImage
                    url={'character/sb02_ci_bear.svg'}
                    scale={0.15}
                    posInfo={{ l: 1.07, b: 0.105 }}
                />

                {
                    Array.from(Array(4).keys()).map(
                        value =>
                            <BaseImage
                                ref={eyeListRef[value]}
                                url={'character/sb02_bear_eye_blink_0' + (value + 1) + '.svg'}
                                scale={0.045}
                                posInfo={{ l: 1.1, b: 0.505 }}
                                className={value > 0 ? 'hideObject' : ''}
                            />
                    )


                }

                {/* fg */}
                <BaseImage
                    scale={3.2}
                    posInfo={{ l: 0.0, b: -0.05 }}
                    url={"fg/sb02_bg_01_fg_1.svg"} />


                {/* character */}
                <BaseDiv ref={aniObjectRef}
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
                                        '%) translate(' + animationScaleList[index].t + ')'
                                }}
                            >
                            </Player>
                        )
                    }
                </BaseDiv>

            </div>
        </div>
    );
})
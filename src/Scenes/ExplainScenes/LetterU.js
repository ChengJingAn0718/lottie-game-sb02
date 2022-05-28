import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components'
import { pauseEnvirAni, playEnvirAni, prePathUrl } from "../../components/CommonFunctions";
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

let rainAniNum = 0;
let timerList = []
export default React.forwardRef(function LetterExplain({ nextFunc, audioList, _geo, _baseGeo }, ref) {


    const characterList = [useRef(), useRef(), useRef()];
    const backgroundRef = useRef();
    const aniObjectRef = useRef();

    const rainFrameList = [useRef(), useRef(), useRef()]

    const [aniState, setAniState] = useState(0)
    const animationPathList = [
        'normal',
        'hi',
        // 'point_horizon',
        'point_stand'
    ]

    const animationScaleList = [
        { s: '100', t: '10%, 10%', },
        { s: '80', t: '8% ,15%' },
        // { s: '100', t: '10%, 10%' },
        { s: '120', t: '15%, 0%' },
    ]

    const durationList = [
        3, //intro
        3, //go
        3 //zoom
    ]

    const objectPos = {
        ani: 0, w: 0.6, l: 0.25, b: -0.1, p: 'sb02_bg_25_fg_1'
    }
    useEffect(
        () => {

            audioList.bodyAudio1.src = prePathUrl() + "sounds/origin/ep_02_audio_02.mp3" //hello voice
            audioList.bodyAudio2.src = prePathUrl() + "sounds/origin/ep_02_audio_61.mp3"   //exlain voice  
            audioList.bodyAudio3.src = prePathUrl() + "sounds/origin/ep_02_audio_62.mp3"   //exlain voice  

            moveFunc(aniObjectRef, 0, 'translateX(-50%)')

            return () => {
                pauseEnvirAni(rainAniNum)


                audioList.bodyAudio1.pause()
                audioList.bodyAudio2.pause()
                audioList.bodyAudio3.pause();

                timerList.map(timer => clearTimeout(timer))
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
            // rainFrameList.map(item => item.current.sertClass('showObject'))

            timerList[1] = setTimeout(() => {
                rainAniNum = playEnvirAni(rainFrameList, 200)
                goFunc()
            }, audioList.bodyAudio1.duration * 1000);

        }, introDuration * 1000);
    }

    function goFunc() {
        setAniState(0)
        let moveDuration = durationList[1]

        timerList[2] = setTimeout(() => {
            audioList.bodyAudio2.play();
            timerList[3] = setTimeout(() => {
                timerList[4] = setTimeout(() => {
                    zoomFunc()
                }, 1000);
            }, moveDuration * 1000);

        }, 1000);
    }

    function zoomFunc() {
        audioList.bodyAudio3.play();
        setAniState(2)

        timerList[5] = setTimeout(() => {
            moveFunc(backgroundRef, durationList[2], 'scale(0.8) translate(-20%,0%)')

            timerList[6] = setTimeout(() => {
                nextFunc()
            }, durationList[2] * 1000 + 3000);
        }, 1000);


    }

    React.useImperativeHandle(ref, () => ({
        playGame: () => {
            timerList[7] = setTimeout(() => {
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
                    scale={2}
                    posInfo={{ l: 0.0, b: -0.4 }}
                    url={"movebg/sb02_bg_25.svg"} />


                {
                    rainFrameList.map((value, index) =>
                        <BaseImage
                            ref={rainFrameList[index]}
                            scale={1.5}
                            posInfo={{
                                l: 0, t: -0.15
                            }}
                            className='hideObject'
                            url={"animations/sb02_rain_animation_0" + (index + 1) + ".svg"}
                        />
                    )
                }

                {
                    objectPos.ani && <Player

                        loop
                        autoplay

                        keepLastFrame={true}
                        src={prePathUrl() + 'lottiefiles/character/' + objectPos.p + '.json'}
                        style={{
                            position: 'absolute',
                            width: objectPos.w * 100 + '%',
                            left: objectPos.l * 100 + '%',
                            bottom: objectPos.b * 100 + '%',
                            pointerEvents: 'none',
                            overflow: 'visible',
                        }}
                    >
                    </Player>
                }



                {
                    !objectPos.ani &&
                    <BaseImage
                        scale={objectPos.w}
                        posInfo={{ l: objectPos.l, b: objectPos.b }}
                        url={"fg/" + objectPos.p + ".svg"} />
                }
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
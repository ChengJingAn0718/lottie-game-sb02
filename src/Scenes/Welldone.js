import React, { useContext, useEffect } from 'react';
import "../stylesheets/styles.css";
import Lottie from "react-lottie-segments";
import loadAnimation from "../utils/loadAnimation"
import { UserContext } from "../components/BaseShot"
import { prePathUrl } from "../components/CommonFunctions"

let animationData, animationData1, animationData2, animationData3, animationData4, animationData5, animationData6,
    animationData7, animationData8, animationData9

new loadAnimation('excellent/sh24e.json').then(result => {
    animationData = result;
}, () => { });

new loadAnimation('excellent/sh24x.json').then(result => {
    animationData1 = result;
}, () => { });
new loadAnimation('excellent/sh24c.json').then(result => {
    animationData2 = result;
}, () => { });

new loadAnimation('excellent/sh24e2.json').then(result => {
    animationData3 = result;
}, () => { });

new loadAnimation('excellent/sh24l.json').then(result => {
    animationData4 = result;
}, () => { });

new loadAnimation('excellent/sh24l.json').then(result => {
    animationData5 = result;
}, () => { });

new loadAnimation('excellent/sh24e3.json').then(result => {
    animationData6 = result;
}, () => { });

new loadAnimation('excellent/sh24n.json').then(result => {
    animationData7 = result;
}, () => { });

new loadAnimation('excellent/sh24t.json').then(result => {
    animationData8 = result;
}, () => { });

new loadAnimation('excellent/sh24ccc.json').then(result => {
    animationData9 = result;
}, () => { });

let timerList = []

export default function Scene18({ nextFunc, _geo, audioList }) {


    const showSourceList = [
        animationData, animationData1, animationData2, animationData3, animationData4,
        animationData5, animationData6, animationData7, animationData8, animationData9,
    ];

    useEffect(() => {

        timerList[0] = setTimeout(() => {
            audioList.audioClap.play().catch(error => { })
            audioList.audioYeah.play().catch(error => { })
        }, 1500);

        timerList[1] = setTimeout(() => {
            audioList.backAudio.volume = 0.05;
            audioList.replayAudio.play().catch(error => { })
            timerList[2] = setTimeout(() => {
                audioList.backAudio.volume = 0.12;
            }, audioList.replayAudio.duration * 1000);
        }, 5500);

        return () => {
            timerList.map(timer => {
                clearTimeout(timer)
            })

            audioList.backAudio.volume = 0.12;

            audioList.replayAudio.pause();

            audioList.audioClap.pause();
            audioList.audioYeah.pause();

            audioList.audioClap.currentTime = 0;
            audioList.audioYeah.currentTime = 0;
        }
    }, [])

    function returnOption(index) {
        return {
            loop: true,
            autoplay: true,
            animationData: showSourceList[index],
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice"
            }
        };
    }

    return (
        <div className='aniObjectDelay'>
            <div
                className="excellentText"
                style={{
                    position: "fixed", width: _geo.width * 1 + "px"
                    , left: _geo.left - _geo.width * 0 + "px",
                    top: _geo.top - _geo.height * 0 + "px",
                    overflow: 'hidden'
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/magic/sb08_excellent_particles.svg"}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.11 + "px"
                , left: _geo.left + _geo.width * 0.09 + "px",
                top: _geo.top + _geo.height * 0.35 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(6)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.11 + "px"
                , left: _geo.left + _geo.width * 0.18 + "px",
                top: _geo.top + _geo.height * 0.45 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(1)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.11 + "px"
                , left: _geo.left + _geo.width * 0.28 + "px",
                top: _geo.top + _geo.height * 0.45 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(2)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>

            <div style={{
                position: "fixed", width: _geo.width * 0.11 + "px"
                , left: _geo.left + _geo.width * 0.37 + "px",
                top: _geo.top + _geo.height * 0.45 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(3)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.09 + "px"
                , left: _geo.left + _geo.width * 0.46 + "px",
                top: _geo.top + _geo.height * 0.32 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(4)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.09 + "px"
                , left: _geo.left + _geo.width * 0.51 + "px",
                top: _geo.top + _geo.height * 0.32 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(5)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.11 + "px"
                , left: _geo.left + _geo.width * 0.58 + "px",
                top: _geo.top + _geo.height * 0.46 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(0)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.11 + "px"
                , left: _geo.left + _geo.width * 0.67 + "px",
                top: _geo.top + _geo.height * 0.45 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(7)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.09 + "px"
                , left: _geo.left + _geo.width * 0.78 + "px",
                top: _geo.top + _geo.height * 0.39 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(8)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>
            <div style={{
                position: "fixed", width: _geo.width * 0.06 + "px"
                , left: _geo.left + _geo.width * 0.86 + "px",
                top: _geo.top + _geo.height * 0.39 + "px",
            }}>
                <Lottie autoplay loop options={returnOption(9)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                />
            </div>

            <div className='aniObjectDelay'>
                <div className='commonButton'
                    style={{
                        position: "fixed", width: _geo.width * 0.08 + "px",
                        left: _geo.width * 0.45 + _geo.left + "px",
                        height: _geo.width * 0.1 + "px",
                        bottom: "5%",
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        setTimeout(() => {
                            nextFunc();
                        }, 200);
                    }}
                >
                    <img
                        width={"100%"}
                        draggable={false}
                        src={prePathUrl() + "images/buttons/replay_blue.svg"}
                    />
                </div>
            </div>
        </div>
    );
}

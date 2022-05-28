import React from 'react';
import "../stylesheets/styles.css";
import { prePathUrl } from '../components/CommonFunctions';
import { Player } from '@lottiefiles/react-lottie-player';


export default function Scene1({ nextFunc, _geo }) {

    return (
        <div className='aniObject'>
            <div
                className='excellentText'
                style={{
                    position: "fixed", width: _geo.width * 0.55,
                    left: _geo.width * 0.185 + _geo.left
                    , top: (_geo.height * 0.1 + _geo.top) + "px",
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/intro/sb02_intro_bg_title.svg"}
                />
            </div>
            <div
                style={{
                    position: "fixed", width: _geo.width * 0.15,
                    left: _geo.width * 0.16 + _geo.left
                    , bottom: (_geo.height * 0.4 + _geo.top) + "px",
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/intro/sb02_intro_bg_bee.svg"}
                />
            </div>
        </div>
    );
}

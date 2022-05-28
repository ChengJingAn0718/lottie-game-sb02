import "../stylesheets/styles.css";
import "../stylesheets/button.css";

import React, { useEffect, useRef, useState } from "react";
import BaseImage from "../components/BaseImage";
import { prePathUrl } from "../components/CommonFunctions";
import { Switch } from "../components/CommonFunctions";

import TitleScene from "./TitleScene"

import LetterA from "./ExplainScenes/LetterA"
import LetterB from "./ExplainScenes/LetterB"
import LetterC from "./ExplainScenes/LetterC";
import LetterD from "./ExplainScenes/LetterD";
import LetterE from "./ExplainScenes/LetterE";
import LetterF from "./ExplainScenes/LetterF";
import LetterG from "./ExplainScenes/LetterG";
import LetterH from "./ExplainScenes/LetterH";
import LetterI from "./ExplainScenes/LetterI";
import LetterJ from "./ExplainScenes/LetterJ";
import LetterK from "./ExplainScenes/LetterK";
import LetterL from "./ExplainScenes/LetterL";
import LetterM from "./ExplainScenes/LetterM";
import LetterN from "./ExplainScenes/LetterN";
import LetterO from "./ExplainScenes/LetterO";
import LetterQ from "./ExplainScenes/LetterQ";
import LetterP from "./ExplainScenes/LetterP";
import LetterR from "./ExplainScenes/LetterR";
import LetterS from "./ExplainScenes/LetterS";
import LetterT from "./ExplainScenes/LetterT";
import LetterU from "./ExplainScenes/LetterU";
import LetterV from "./ExplainScenes/LetterV";
import LetterW from "./ExplainScenes/LetterW";
import LetterX from "./ExplainScenes/LetterX";
import LetterY from "./ExplainScenes/LetterY";
import LetterZ from "./ExplainScenes/LetterZ";

const ScaleScene = ({ nextFunc, _baseGeo, currentLetterNum, audioList, _geo }, ref) => {
    const parentObject = useRef()

    const letterRefList = Array.from({ length: 26 }, ref => useRef())
    const [isGameStarted, setGameStarted] = useState(false)
    const skipButton = useRef()

    React.useImperativeHandle(ref, () => ({
        playGame: () => {
            letterRefList[currentLetterNum].current.playGame()
            setGameStarted(true)
            skipButton.current.className = 'aniObject'
        },
    }))

    useEffect(() => {

        return () => {
        }

    }, [])


    const switchList = [
        <LetterA key={0} audioList={audioList} ref={letterRefList[0]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={0} />,
        <LetterB key={1} audioList={audioList} ref={letterRefList[1]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={1} />,
        <LetterC key={2} audioList={audioList} ref={letterRefList[2]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={2} />,
        <LetterD key={3} audioList={audioList} ref={letterRefList[3]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={3} />,
        <LetterE key={4} audioList={audioList} ref={letterRefList[4]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={4} />,
        <LetterF key={5} audioList={audioList} ref={letterRefList[5]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={5} />,
        <LetterG key={6} audioList={audioList} ref={letterRefList[6]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={6} />,
        <LetterH key={7} audioList={audioList} ref={letterRefList[7]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={7} />,
        <LetterI key={8} audioList={audioList} ref={letterRefList[8]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={8} />,
        <LetterJ key={9} audioList={audioList} ref={letterRefList[9]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={9} />,
        <LetterK key={10} audioList={audioList} ref={letterRefList[10]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={10} />,
        <LetterL key={11} audioList={audioList} ref={letterRefList[11]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={11} />,
        <LetterM key={12} audioList={audioList} ref={letterRefList[12]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={12} />,
        <LetterN key={13} audioList={audioList} ref={letterRefList[13]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={13} />,
        <LetterO key={14} audioList={audioList} ref={letterRefList[14]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={14} />,
        <LetterP key={15} audioList={audioList} ref={letterRefList[15]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={15} />,
        <LetterQ key={16} audioList={audioList} ref={letterRefList[16]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={16} />,
        <LetterR key={17} audioList={audioList} ref={letterRefList[17]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={17} />,
        <LetterS key={18} audioList={audioList} ref={letterRefList[18]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={18} />,
        <LetterT key={19} audioList={audioList} ref={letterRefList[19]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={19} />,
        <LetterU key={20} audioList={audioList} ref={letterRefList[20]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={20} />,
        <LetterV key={21} audioList={audioList} ref={letterRefList[21]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={21} />,
        <LetterW key={22} audioList={audioList} ref={letterRefList[22]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={22} />,
        <LetterX key={23} audioList={audioList} ref={letterRefList[23]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={23} />,
        <LetterY key={24} audioList={audioList} ref={letterRefList[24]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={24} />,
        <LetterZ key={25} audioList={audioList} ref={letterRefList[25]} nextFunc={nextFunc} _geo={_geo} _baseGeo={_baseGeo} value={25} />,
    ]

    return (
        <div
            className="aniObject"
            ref={parentObject}
        >
            <Switch test={currentLetterNum}>
                {
                    switchList.map(list => list)
                }
            </Switch>

            {
                !isGameStarted &&
                <TitleScene _geo={_geo} _baseGeo={_baseGeo} />
            }

            <div ref={skipButton} className='hideObject'>
                <div
                    className='commonButton'
                    onClick={() => {
                        setTimeout(() => {
                            nextFunc();
                        }, 200);
                    }}
                    style={{
                        position: "fixed", width: _geo.width * 0.055 + "px",
                        height: _geo.width * 0.055 + "px",
                        right: "2%"
                        , bottom: "5%", cursor: "pointer",
                    }}>
                    <img
                        draggable={false}
                        width={"100%"}
                        src={prePathUrl() + 'images/buttons/skip_blue.svg'}
                    />
                </div>
            </div>
        </div>
    );
}


export default React.forwardRef(ScaleScene)
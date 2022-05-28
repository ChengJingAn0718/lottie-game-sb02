
import React, { useState, useEffect, useRef } from 'react';

import TitleScene from "../Scenes/TitleScene";
import ScaleScene from "../Scenes/ScaleScene";
import DrawingScene from "../Scenes/DrawingScene";
import ExcellentScene from "../Scenes/Welldone";

import "../stylesheets/styles.css";
import "../stylesheets/button.css";

import { prePathUrl, Switch } from "./CommonFunctions";
import { MusicButton } from './CommonButtons';


var __geo;
var backgroundImageIndex = 0;
var currentLetterNum = 0;

var backgroundImageList = [
  "sb_01_bg_01", //1
  "sb_01_bg_01", //1
  "sb08_excellent_bg", //1
];


const App = ({ geo, _setBackground, __controlBacksound, _startTransition,
  _hideIntroTitle, _showIntroTitle, baseGeo, _isBackloaded, _audioList, currentSceneNumber
}, ref) => {

  const [index, setIndex] = useState(0);
  const [_isBackSoundPlaying, _setBackgroundPlaying] = useState(true);
  const musicRef = useRef();
  const scaleSceneRef = useRef();
  __geo = geo;

  useEffect(
    () => {
      return () => {
      }
    }, []
  )

  function controlBacksound() {
    __controlBacksound();
    if (_isBackSoundPlaying) {
      _setBackgroundPlaying(false);
    }
    else {
      _setBackgroundPlaying(true);
    }
  }

  const transitionSceneList = [3, 8, 15]
  function changeBackgroundImage(judgeNum) {
    if (judgeNum == 1)
      _hideIntroTitle();
    let sendNum = -1;
    if (judgeNum == 0)
      sendNum = 0;
    if (transitionSceneList.includes(judgeNum))
      sendNum = 1;
    if (judgeNum != backgroundImageIndex) {
      backgroundImageIndex = judgeNum;
      _setBackground(backgroundImageList[judgeNum], sendNum);
    }
  }

  function setFomart(sceneNum) {
    setIndex(sceneNum);
    changeBackgroundImage(sceneNum);
  }

  React.useImperativeHandle(ref, () => ({
    nextFunc: () => {
      scaleSceneRef.current.playGame()
      musicRef.current.fomartSound()

      _hideIntroTitle()
    },
    showMusicBtn: () => {

    }
  }))

  function nextFunc() {
    setFomart(index + 1);
  }

  function goHome() {
    currentLetterNum = 0;
    backgroundImageIndex = 0;
    musicRef.current.setClass('hideObject')

    _audioList.backAudio.pause();
    _audioList.backAudio.currentTime = 0;

    setIndex(0);
    _showIntroTitle();
    _setBackground(backgroundImageList[0])
  }

  return (
    <div >
      <div className={_isBackloaded ? '' : 'hideObject'}>
        <Switch test={index}>
          <ScaleScene ref={scaleSceneRef} key={0} currentLetterNum={currentSceneNumber}
            nextFunc={nextFunc} _baseGeo={baseGeo} audioList={_audioList} _geo={__geo} value={0} />
          <DrawingScene
            key={1}
            startTransition={_startTransition}
            currentLetterNum={currentSceneNumber} nextFunc={nextFunc} _baseGeo={baseGeo} audioList={_audioList} _geo={__geo} value={1} />
          <ExcellentScene
            key={2}
            nextFunc={goHome} _baseGeo={baseGeo} audioList={_audioList} _geo={__geo} value={2} />

        </Switch>
      </div>

      <MusicButton ref={musicRef} _geo={__geo}
        backAudio={_audioList.backAudio} className='hideObject' />
    </div >
  );
}

export default React.forwardRef(App);

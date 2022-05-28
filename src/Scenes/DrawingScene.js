import "../stylesheets/styles.css";
import "../stylesheets/button.css";

import { useEffect, useRef, useState } from "react";
import { prePathUrl, returnVoicePath } from "../components/CommonFunctions";
import Phaser from "phaser"
import BaseImage from "../components/BaseImage";
import { Player } from '@lottiefiles/react-lottie-player';

import { isFirefox } from "react-device-detect";
import { startRepeatAudio, setRepeatAudio, stopRepeatAudio, isRepeating } from "../components/CommonFunctions";
import {
    maskInfoList, iconPathList, animtionList, showingLayoutList, titleList, letterPosList,
    lineWidthList, firstPosList, movePath, subObjectList, brushColorList, letterTurnList, lowerLineWidthList,
    sparkPosLeft, textInfoList, lowerMaskInfoList, lowerLetterPosList,
    lowerMovePath, lowerFirstPosList, lowerIconWidth, firstSubPosList, lastSubPosList, IconPrefix
} from "../components/CommonVariants"



var repeatStep = 0;
const firstPos = { x: 380, y: 255 }
//state variants
let stepCount = 0;

// drawing variants

let isFirst = true;
var curves = [];
var curve = null;


var subCurves = [];
var subCurve = null;

// lemming varients
var graphics
var subGraphics
var nearestStepNum = 0;
var circleObj
let moveObj
// var yOutLine, wOutLine

var highlightList = []
var highCurrentNum = 0;

var currentImgNumOriginal = 0;
var currentLingLength = 40

let posList = []
var path
let prePath

var timerList = []
var isTracingStarted = false;

var rememberX = 0;
var rememberIsLeft = false;

let geometryInfo = null


let lastObjectList = []
let firstObjectList = []
let completedIndex = 0;
let isLowerCaseShow = true
let isLowerDrawing = true;

let currentMovePath
let currentFirstPosList
let currentPath
let currentlineWidthList
let currentLetterPosList

let tapInterval
let scaleInterval, scaleTimer, repeatInterval
let optimizedPosition

let addHighlightCount = 0
let lastPosCount = 0; //for last position

export default function Scene({ nextFunc, _geo, startTransition, audioList, currentLetterNum
}) {

    const letterNum = currentLetterNum;

    currentMovePath = isLowerDrawing ? lowerMovePath : movePath
    currentFirstPosList = isLowerDrawing ? lowerFirstPosList : firstPosList
    currentPath = currentMovePath[letterNum][stepCount]
    currentlineWidthList = isLowerDrawing ? lowerLineWidthList : lineWidthList
    currentLingLength = currentlineWidthList[letterNum]
    currentLetterPosList = isLowerDrawing ? lowerLetterPosList : letterPosList


    const explainVoices = ['04', '05', '07', '10']

    const preName = prePathUrl() + 'images/sb01/sb01_letter_interactive/sb_01_' + letterTurnList[currentLetterNum] + '_'

    prePath = 'sb01/sb01_letter_interactive/sb_01_' + letterTurnList[currentLetterNum] + "_"

    const currentLetter = letterTurnList[letterNum].toLowerCase()
    const lowerPrepath = "lowercase/" + currentLetter + "/sb02_li_" + currentLetter + "_"

    const parentObject = useRef()
    const drawingPanel = useRef();
    const showingImg = useRef();
    const animationRef = useRef();
    const playerRef = useRef();
    const markParentRef = useRef();


    const skipButton = useRef();

    const subObjectsRef = useRef();
    const iconRef = useRef()
    const highlightRefList =
        Array.from({ length: letterPosList[letterNum].highlight.length }, ref => useRef())

    const outLineRefList = [useRef(), useRef()]

    const markRefList = [useRef(), useRef(), useRef()]
    const reviewImgList = [useRef(), useRef(), useRef()]
    const markBaseList = [useRef(), useRef(), useRef()]
    const markBarRef = useRef();
    const sparkRefList = [useRef(), useRef(), useRef()]
    const sparkBaseRef = useRef();

    const lowerCaseRef = useRef();
    const drawingRef = useRef();
    const lowerHighlightRefList = Array.from({ length: lowerLetterPosList[letterNum].highlight.length }, ref => useRef())
    const lowerOutlineRefList = [useRef(), useRef()]

    const [rendering, setRendering] = useState(0)

    const drawingGaameconfig = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        parent: 'DrawingDiv',
        mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
        transparent: true,
        physics: {
            default: 'matter',
            matter: {
                gravity: {
                    y: 0.8
                },
                enableSleep: true,
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update

        }
    };

    const highlightGameConfig = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        transparent: true,
        parent: 'highlightDiv',
        scene: {
            preload: highlight_preload,
            create: highlight_create,
        }
    };


    const wordVoiceList = [audioList.wordAudio1, audioList.wordAudio2, audioList.wordAudio3]
    const reviewVoiceList = [audioList.reviewAudio1, audioList.reviewAudio2, audioList.reviewAudio3]

    useEffect(() => {

        addHighlightCount = lowerFirstPosList[letterNum][0].addCount ? lowerFirstPosList[letterNum][0].addCount : 0
        highCurrentNum = addHighlightCount;

        audioList.bodyAudio1.src = returnVoicePath(0, explainVoices[0])

        drawingPanel.current.className = 'hideObject'
        // animationRef.current.className = 'hideObject'
        markBarRef.current.className = 'hideObject'
        markParentRef.current.className = 'hideObject'
        subObjectsRef.current.className = 'hideObject'

        lowerCaseRef.current.className = 'hideObject'

        new Phaser.Game(highlightGameConfig)

        setTimeout(() => {
            new Phaser.Game(drawingGaameconfig);
        }, 500);

        subObjectsRef.current.className = 'appear'

        playAutoAnimation()
        parentObject.current.className = 'aniObject'

        setRepeatAudio(audioList.bodyAudio1)

        return () => {
            currentImgNumOriginal = 0;
            repeatStep = 0;
            stepCount = 0;
            nearestStepNum = 0;
            highCurrentNum = 0;

            isTracingStarted = false;
            isLowerCaseShow = true;
            isLowerDrawing = true;

            isFirst = true;

            curve = null;
            curves = [];

            subCurves = [];
            subCurve = null;

            highlightList = []

            graphics = null
            subGraphics = null

            stopRepeatAudio();

            audioList.tapAudio.pause()
            audioList.tapAudio.currentTime = 0;

        }

    }, [])

    const playAutoAnimation = () => {
        timerList[0] = setTimeout(() => {
            audioList.letterAudio.play()
            animationRef.current.style.transform = 'translateY(' + _geo.height * animtionList[letterNum].scale * -0.2 + 'px) scale(1.2) '
            animationRef.current.style.transition = '1.5s'

            timerList[2] = setTimeout(() => {
                audioList.bodyAudio1.play();
                timerList[1] = setTimeout(() => {
                    playerRef.current.play();
                    audioList.bodyAudio1.src = returnVoicePath(0, explainVoices[1])
                }, audioList.bodyAudio1.duration * 1000 + 500);
            }, audioList.letterAudio.duration * 1000);
        }, 2500);
    }


    const playTapAnimation = () => {
        // lowerCaseRef.current.style.transition = '0.3s linear'


        // let value = 1;
        // tapInterval = setInterval(() => {
        //     if (value == 1)
        //         value = 1.07
        //     else
        //         value = 1
        //     lowerCaseRef.current.style.transform = 'scale(' + value + ')'
        // }, 300);
    }

    const stopTapAnimation = () => {

        // clearInterval(tapInterval)
        // lowerCaseRef.current.style.transform = 'scale(' + 1 + ')'

    }

    const showingDrawingPanel = () => {

        timerList.map(timer => clearTimeout(timer))
        audioList.bodyAudio1.pause()

        firstObjectList.map(value => value.visible = false)
        lastObjectList.map(value => value.visible = false)

        startTransition(2)

        animationRef.current.style.transition = 'none'

        setTimeout(() => {
            playerRef.current.stop();
        }, 290);

        setTimeout(() => {
            animationRef.current.className = 'hideObject'
            drawingPanel.current.className = 'showObject'
            markParentRef.current.className = 'showObject'
            markBarRef.current.className = 'showObject'
            lowerCaseRef.current.className = 'commonButton'
            showingImg.current.className = 'appear'
            skipButton.current.className = 'hideObject'

            isTracingStarted = true;
        }, 300);

        subObjectsRef.current.className = 'appear'

        timerList[1] = setTimeout(() => {

            // audioList.letterAudio.play()

            // timerList[4] = setTimeout(() => {
            audioList.bodyAudio1.play();
            playScaleFunc()

            timerList[2] = setTimeout(() => {
                // audioList.tapAudio.play()
                // stopScaleFunc()
                playTapAnimation()

                // timerList[3] = setTimeout(() => {

                stopTapAnimation()
                startRepeatScaleFunc()
                startRepeatAudio();

                // }, audioList.tapAudio.duration * 1000);


            }, audioList.bodyAudio1.duration * 1000 + 500);
            // }, audioList.letterAudio.duration * 1000);

        }, 1800);

    }

    const clickUpperCase = () => {

        stopRepeatAudio()
        stopScaleFunc()
        stopTapAnimation()

        isLowerDrawing = false;
        isLowerCaseShow = false;


        drawingRef.current.className = 'disappear'
        lowerCaseRef.current.className = 'disappear'
        lowerOutlineRefList.map(item => item.current.setClass('disappear'))
        lowerHighlightRefList.map(item => item.current.setClass('disappear'))

        firstObjectList.map(value => value.visible = false)
        lastObjectList.map(value => value.visible = false)

        addHighlightCount = firstPosList[letterNum][0].addCount ? firstPosList[letterNum][0].addCount : 0
        highCurrentNum = addHighlightCount;


        let baseScale = 1;
        if (letterNum == 6)
            baseScale = 1.2

        if (!isFirefox) {

            moveObj.setScale(baseScale)
            moveObj.visible = false
        }
        else {
            iconRef.current.setClass('disappear')
            iconRef.current.setStyle({ transform: 'scale(' + baseScale + ')' })
        }

        currentMovePath = isLowerDrawing ? lowerMovePath : movePath
        currentFirstPosList = isLowerDrawing ? lowerFirstPosList : firstPosList
        currentPath = currentMovePath[letterNum][stepCount]
        currentlineWidthList = !isLowerDrawing ? lineWidthList : lowerLineWidthList
        currentLetterPosList = !isLowerDrawing ? letterPosList : lowerLetterPosList

        currentLingLength = currentlineWidthList[letterNum]

        setTimeout(() => {
            drawingRef.current.style.WebkitMaskImage = 'url("' + preName + 'grey.svg")'
            drawingRef.current.style.WebkitMaskPosition = maskInfoList[letterNum].position
            drawingRef.current.style.WebkitMaskSize = maskInfoList[letterNum].size

            setTimeout(() => {
                drawingRef.current.className = 'appear'

                highlightRefList.map((highlight, index) => {
                    if (index <= addHighlightCount)
                        highlight.current.setClass('appear')
                    else
                        highlight.current.setClass('disappear')
                })

                outLineRefList[0].current.setClass('appear')

                curve = new Phaser.Curves.Spline([currentFirstPosList[letterNum][0].x, currentFirstPosList[letterNum][0].y]);
                subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);

                circleObj.x = currentMovePath[letterNum][0][0].x
                circleObj.y = currentMovePath[letterNum][0][0].y
                rememberX = currentMovePath[letterNum][0][0].x;

                if (!isFirefox) {
                    setTimeout(() => {
                        moveObj.visible = true
                        moveObj.x = circleObj.x;
                        moveObj.y = circleObj.y
                    }, 150);

                }
                else {
                    iconRef.current.setPosInfo({
                        l: circleObj.x / 1280 - 0.045,
                        t: circleObj.y / 720 - 0.08,
                    })
                    setTimeout(() => {
                        iconRef.current.setClass('showObject')
                    }, 300);
                }
            }, 700);
        }, 300);

        audioList.bodyAudio1.pause()
        audioList.bodyAudio1.currentTime = 0;
        timerList.map(timer => clearTimeout(timer))

        audioList.tapAudio.pause()
        audioList.tapAudio.currentTime = 0;

        startRepeatScaleFunc()
        startRepeatAudio()
    }

    geometryInfo = _geo

    function reviewFunc() {
        audioList.bodyAudio1.src = prePathUrl() + 'sounds/main/review.mp3'
        startTransition(2)
        setTimeout(() => {
            drawingPanel.current.className = 'hideObject'
            showingImg.current.className = 'hideObject'
        }, 300);

        setTimeout(() => {
            markBaseList.map((markBase, value) => {
                if (markBase.current != null)
                    setTimeout(() => {
                        markBase.current.style.transition = '1s'
                        markBase.current.style.transform = 'translate(' +
                            (geometryInfo.width * [-0.6, -0.36, -0.16][value] - geometryInfo.left) + 'px,' +
                            (geometryInfo.height * (0.38) + geometryInfo.top)
                            + 'px) rotateZ(-360deg) scale(2)'

                        reviewImgList[value].current.style.transform = 'scale(1.15)'
                        reviewImgList[value].current.style.transition = '0.5s'
                        sparkBaseRef.current.style.left =
                            (geometryInfo.left + geometryInfo.width * (0.15 + sparkPosLeft[letterNum][value])) + 'px'

                        setTimeout(() => {
                            markBase.current.className = 'disapear'
                            setTimeout(() => {
                                reviewImgList[value].current.className = 'appear'
                                let showIndex = 0;
                                audioList.audioSuccess.currentTime = 0;
                                audioList.audioSuccess.play();
                                sparkRefList[showIndex].current.setClass('showObject')
                                let showInterval = setInterval(() => {
                                    sparkRefList[showIndex].current.setClass('hideObject')
                                    if (showIndex < 2) {
                                        showIndex++
                                        sparkRefList[showIndex].current.setClass('showObject')
                                    }
                                    else {
                                        clearInterval(showInterval)
                                    }
                                }, 200);
                            }, 200);

                            setTimeout(() => {
                                reviewVoiceList[value].play();
                            }, 1500);
                            setTimeout(() => {
                                reviewImgList[value].current.style.transform = 'scale(1)'

                                if (value == 2)
                                    setTimeout(() => {
                                        markBarRef.current.className = 'hide'
                                        subReviewFunc()
                                    }, 1500);

                            }, 3000);
                        }, 600);
                    }, 6000 * value);
            })
        }, 1500);
    }

    function subReviewFunc() {
        audioList.bodyAudio1.play();
        setTimeout(() => {
            reviewImgList.map((value, index) => {
                if (value.current != null)
                    setTimeout(() => {
                        value.current.style.transition = '1.2s'
                        setTimeout(() => {
                            // audioList.reviewAudio.play()
                            value.current.style.transform = 'scale(1.15)'
                            setTimeout(() => {
                                value.current.style.transform = 'scale(1)'

                                setTimeout(() => {
                                    if (index == 2) {
                                        setTimeout(() => {
                                            parentObject.current.style.transition = '0.5s'
                                            parentObject.current.style.opacity = '0.0'
                                            setTimeout(() => {
                                                nextFunc()
                                            }, 500);
                                        }, 1000);
                                    }
                                }, 1000);
                            }, 4000);
                        }, 1000);
                    }, 5000 * index);
            })
        }, audioList.bodyAudio1.duration * 1000);
    }

    function preload() {
        // this.load.image('letterBase', preName + 'Grey.svg');  //not svg , png

        letterPosList[letterNum].highlight.map((item, index) => {
            this.load.image('letterHighlight' + (index + 1), preName + 'arrow_' + (index + 1) + '.svg');
        })
    }


    function repeatScaleFunc() {
        repeatInterval = setInterval(() => {
            playScaleFunc()
        }, 10000);
    }

    function playScaleFunc() {
        clearInterval(scaleInterval)

        let value = 1
        let isIncrease = true
        scaleInterval = setInterval(() => {
            if (isIncrease)
                value += 0.01
            else
                value -= 0.01
            if (value >= 1.12)
                isIncrease = false;
            if (value <= 1)
                isIncrease = true

            let currrentLineWidth = 1;

            let baseValue = 1
            if (!isLowerDrawing && letterNum == 6)
                baseValue = 1.2

            if (isLowerDrawing)
                currrentLineWidth = lowerIconWidth[letterNum]
            if (!isFirefox) {
                moveObj.setScale(currrentLineWidth * value * baseValue)
            }
            else {
                iconRef.current.setStyle({
                    transform: 'scale(' + currentLingLength * value * baseValue + ')'
                })
            }
        }, 40);
    }

    function startRepeatScaleFunc(delay = 5000) {
        scaleTimer = setTimeout(() => {
            repeatScaleFunc()
        }, delay);
    }

    function stopScaleFunc() {
        clearTimeout(scaleTimer)
        clearInterval(scaleInterval)
        clearInterval(repeatInterval)

        let currrentLineWidth = 1;

        let baseValue = 1
        if (!isLowerDrawing && letterNum == 6)
            baseValue = 1.2

        if (isLowerDrawing)
            currrentLineWidth = lowerIconWidth[letterNum]

        if (!isFirefox)
            moveObj.setScale(currrentLineWidth * baseValue)
        else {
            iconRef.current.setStyle({ transform: 'scale(' + currrentLineWidth * baseValue + ')' })
        }
    }

    function create() {
        graphics = this.add.graphics();
        subGraphics = this.add.graphics();

        letterPosList[letterNum].highlight.map((item, index) => {
            highlightList[index] = this.add.image(item.x, item.y, 'letterHighlight' + (index + 1))
        })

        highlightList.map((highlight, index) => {
            if (index > 0)
                highlight.visible = false
        })

        curve = new Phaser.Curves.Spline([currentFirstPosList[letterNum][0].x, currentFirstPosList[letterNum][0].y]);
        subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);

        circleObj = this.add.circle(currentMovePath[letterNum][0][0].x, currentMovePath[letterNum][0][0].y, 60, 0xffffdd, 0.0)
        rememberX = currentMovePath[letterNum][0][0].x;
        circleObj.setInteractive({ cursor: 'grab' })


        if (letterNum == 14)
            lowerHighlightRefList.map(item => item.current.setClass('appear'))
        else
            lowerHighlightRefList[0].current.setClass('appear')

        firstSubPosList.map((obj, index) => {
            firstObjectList[index] = (obj[4] == 'rect' ? this.add.rectangle(
                obj[0], obj[1],
                obj[2], obj[3],
                brushColorList[repeatStep]) :
                this.add.circle(
                    obj[0], obj[1],
                    obj[2],
                    brushColorList[repeatStep], 1))
            if (obj.length == 6)
                firstObjectList[index].rotation = obj[5]

            firstObjectList[index].visible = false
        })

        lastSubPosList.map((obj, index) => {
            lastObjectList[index] = (obj[4] == 'rect' ? this.add.rectangle(
                obj[0], obj[1],
                obj[2], obj[3],
                brushColorList[repeatStep]) :
                this.add.circle(
                    obj[0], obj[1],
                    obj[2],
                    brushColorList[repeatStep], 1))

            if (obj.length == 6)
                lastObjectList[index].rotation = obj[5]

            lastObjectList[index].visible = false
        })


        if (currentFirstPosList[letterNum][stepCount].firstObj != null) {
            firstObjectList[currentFirstPosList[letterNum][stepCount].firstObj].visible = true
        }

        let isMoving = false;


        circleObj.on('pointerover', function () {

            setTimeout(() => {
                if (isTracingStarted && isRepeating()) {
                    stopRepeatAudio()
                    stopScaleFunc()
                }
            }, 10);

        });

        circleObj.on('pointerout', function () {

            setTimeout(() => {
                if (isTracingStarted && !isRepeating()) {
                    startRepeatAudio()
                    startRepeatScaleFunc()
                }
            }, 10);


        });

        circleObj.on('pointerup', function () {

            setTimeout(() => {
                if (isTracingStarted) {
                    startRepeatAudio();
                    startRepeatScaleFunc();
                }
            }, 10);


        });


        circleObj.on('pointerdown', function (pointer) {
            if (!isMoving) {
                if (isTracingStarted) {

                    if (isLowerCaseShow) {
                        lowerCaseRef.current.className = 'disappear'
                        isLowerCaseShow = false
                    }

                    if (currentFirstPosList[letterNum][stepCount].firstObj != null) {
                        firstObjectList[currentFirstPosList[letterNum][stepCount].firstObj].visible = true
                    }

                    circleObj.on('pointermove', moveFunc, this);
                    curves.push(curve);
                    subCurves.push(subCurve);

                    isMoving = true;

                    audioList.letterAudio.pause();
                    audioList.letterAudio.currentTime = 0;

                    audioList.bodyAudio1.pause()
                    audioList.bodyAudio1.currentTime = 0;
                    timerList.map(timer => clearTimeout(timer))


                    stopRepeatAudio();
                    stopScaleFunc()
                    stopTapAnimation()

                    audioList.tapAudio.pause()
                    audioList.tapAudio.currentTime = 0;

                    if (currentFirstPosList[letterNum][stepCount].p != null && currentFirstPosList[letterNum][stepCount].p == true) {

                        isMoving = false;
                        isTracingStarted = false;




                        nearestStepNum = 0;
                        curve.addPoint(
                            currentFirstPosList[letterNum][stepCount].x,
                            currentFirstPosList[letterNum][stepCount].y);
                        currentPath.map(path => {
                            curve.addPoint(path.x, path.y);
                        })
                        graphics.lineStyle(100, brushColorList[repeatStep]);

                        if (stepCount == currentMovePath[letterNum].length - 1) {

                            graphics.lineStyle(100, brushColorList[repeatStep]);
                            if (isLowerDrawing) {
                                lowerHighlightRefList.map(item => item.current.setClass('disappear'))

                            }
                            else
                                highlightRefList.map(item => item.current.setClass('disappear'))

                            // alert('finished')
                            circleObj.y = 10000;

                            if (!isFirefox) {
                                moveObj.y = 10000
                                moveObj.setScale(lowerIconWidth[letterNum] * 1)

                            }
                            else {
                                iconRef.current.setClass('hideObject')
                                iconRef.current.setStyle({ transform: 'scale(' + lowerIconWidth[letterNum] + ')' })
                            }




                            curves.forEach(function (c) {
                                c.draw(graphics, 100);
                            });

                            subCurves.forEach(function (c) {
                                c.draw(subGraphics, 100);
                            });


                            if (isLowerDrawing) {
                                lowerOutlineRefList[0].current.setClass('disappear')
                                lowerOutlineRefList[1].current.setClass('appear')

                            }
                            else {
                                outLineRefList[0].current.setClass('disappear')
                                outLineRefList[1].current.setClass('appear')
                            }



                            markRefList[repeatStep].current.setUrl("icons/sb02_progress_bar_yellow_flower.svg")


                            if (repeatStep < 2) {
                                audioList.bodyAudio1.src = returnVoicePath(0, explainVoices[repeatStep + 2])
                                audioList.audioTing.currentTime = 0;
                                audioList.audioTing.play();
                            }
                            else
                                audioList.spakleAudio.play()

                            showingImg.current.style.transform = 'scale(1.12)'

                            setTimeout(() => {

                                let waitTime = wordVoiceList[repeatStep].duration * 1000


                                if (repeatStep == 2) {
                                    audioList.excellentAudio.play()
                                    setTimeout(() => {
                                        wordVoiceList[repeatStep].play();
                                    }, 1500);
                                    waitTime += 1500
                                }
                                else
                                    wordVoiceList[repeatStep].play();

                                setTimeout(() => {

                                    showingImg.current.style.transform = 'scale(1)'

                                    if (repeatStep < 2)
                                        showingImg.current.className = 'disappear'

                                    setTimeout(() => {
                                        if (repeatStep < 2) {
                                            let timeDur = 10;
                                            if (!isFirefox) {
                                                moveObj.visible = false
                                            }
                                            else {
                                                iconRef.current.setClass('disappear')
                                            }

                                            if (!isLowerDrawing) {
                                                outLineRefList.map(item =>
                                                    item.current.setClass('disappear'))
                                                drawingRef.current.className = 'disappear'
                                                highlightRefList.map(item =>
                                                    item.current.setClass('disappear'))


                                                setTimeout(() => {
                                                    drawingRef.current.style.WebkitMaskImage =
                                                        'url("' + prePathUrl() + 'images/' + lowerPrepath + 'gray.svg")'
                                                    drawingRef.current.style.WebkitMaskPosition =
                                                        lowerMaskInfoList[letterNum].position
                                                    drawingRef.current.style.WebkitMaskSize =
                                                        lowerMaskInfoList[letterNum].size
                                                    setTimeout(() => {
                                                        drawingRef.current.className = 'appear'
                                                    }, 700);

                                                }, 300);
                                                timeDur = 1000
                                            }

                                            setTimeout(() => {
                                                lowerHighlightRefList.map((highlight, index) => {
                                                    if (index > 0)
                                                        highlight.current.setClass('disappear')
                                                    else
                                                        highlight.current.setClass('appear')
                                                })


                                                addHighlightCount = lowerFirstPosList[letterNum][0].addCount ? lowerFirstPosList[letterNum][0].addCount : 0

                                                lowerCaseRef.current.className = 'appear'
                                                setTimeout(() => {
                                                    lowerCaseRef.current.className = 'commonButton'
                                                }, 300);

                                                lowerOutlineRefList[0].current.setClass('disappear')

                                                isLowerCaseShow = true
                                                isLowerDrawing = true;
                                                currentMovePath = isLowerDrawing ? lowerMovePath : movePath
                                                currentFirstPosList = isLowerDrawing ? lowerFirstPosList : firstPosList

                                                // fomart values....

                                                highCurrentNum = addHighlightCount
                                                currentLingLength = currentlineWidthList[letterNum]
                                                stepCount = 0;

                                                currentPath = currentMovePath[letterNum][stepCount]

                                                repeatStep++;
                                                rememberX = currentPath[0].x

                                                showingImg.current.className = 'appear'
                                                lowerOutlineRefList[1].current.setClass('appear')

                                                isFirst = true;
                                                nearestStepNum = 0;

                                                optimizedPosition = currentMovePath[letterNum][0][0]
                                                //.............

                                                circleObj.x = optimizedPosition.x;
                                                circleObj.y = optimizedPosition.y;

                                                lastObjectList.map(obj => {
                                                    if (obj != null) {
                                                        obj.visible = false;
                                                        obj.setFillStyle(brushColorList[repeatStep], 1)
                                                    }
                                                })
                                                firstObjectList.map(obj => {
                                                    if (obj != null) {
                                                        obj.visible = false;
                                                        obj.setFillStyle(brushColorList[repeatStep], 1)
                                                    }
                                                })

                                                if (!isFirefox) {
                                                    moveObj.setScale(1)

                                                    setTimeout(() => {
                                                        moveObj.visible = true
                                                        moveObj.x = optimizedPosition.x;
                                                        moveObj.y = optimizedPosition.y
                                                    }, 150);

                                                }
                                                else {
                                                    iconRef.current.setStyle({ transform: 'scale(1)' })
                                                    iconRef.current.setPosInfo({
                                                        l: circleObj.x / 1280 - 0.045,
                                                        t: circleObj.y / 720 - 0.08,
                                                    })
                                                    setTimeout(() => {
                                                        iconRef.current.setClass('showObject')
                                                    }, 300);
                                                }


                                                graphics.clear();
                                                subGraphics.clear();

                                                curve = new Phaser.Curves.Spline([currentFirstPosList[letterNum][0].x, currentFirstPosList[letterNum][0].y]);
                                                curves = []


                                                subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                                subCurves = []

                                                isTracingStarted = true;

                                                timerList[0] = setTimeout(() => {

                                                    // audioList.letterAudio.play()
                                                    // setTimeout(() => {
                                                    audioList.bodyAudio1.play();
                                                    playScaleFunc()

                                                    timerList[1] = setTimeout(() => {
                                                        // audioList.tapAudio.play()

                                                        stopScaleFunc()
                                                        playTapAnimation()

                                                        // timerList[3] = setTimeout(() => {

                                                        startRepeatAudio();
                                                        startRepeatScaleFunc()
                                                        stopTapAnimation()

                                                        // }, audioList.tapAudio.duration * 1000);

                                                    }, audioList.bodyAudio1.duration * 1000 + 500);
                                                    // }, audioList.letterAudio.duration * 1000);
                                                }, 500);

                                            }, timeDur);


                                        }
                                        else {
                                            setTimeout(() => {
                                                reviewFunc();

                                                audioList.tapAudio.pause()
                                                audioList.tapAudio.currentTime = 0;
                                            }, 1000);

                                        }

                                        if (currentImgNumOriginal < 2) {
                                            currentImgNumOriginal++
                                            setRendering(currentImgNumOriginal);
                                        }
                                    }, 500);
                                }, waitTime + 3000);
                            }, 1000);
                        }
                        else {

                            let isHighShowPart = currentFirstPosList[letterNum][stepCount + 1].letter_start;
                            let isConnected = currentFirstPosList[letterNum][stepCount + 1].disConnected ? false : true;

                            if (currentFirstPosList[letterNum][stepCount].lastObj != null) {
                                lastObjectList[currentFirstPosList[letterNum][stepCount].lastObj].visible = true
                            }

                            curves.forEach(function (c) {
                                c.draw(graphics, 100);
                            });

                            subCurves.forEach(function (c) {
                                c.draw(subGraphics, 100);
                            });




                            if (isHighShowPart
                                && currentLetterPosList[letterNum].lastPosList
                                && currentLetterPosList[letterNum].lastPosList.length > lastPosCount) {
                                let lastPos = currentLetterPosList[letterNum].lastPosList[lastPosCount]

                                circleObj.x = lastPos.x;
                                circleObj.y = lastPos.y;

                                lastPosCount++

                                if (!isFirefox) {
                                    moveObj.x = lastPos.x;
                                    moveObj.y = lastPos.y;
                                }

                                else
                                    iconRef.current.setPosInfo({
                                        l: circleObj.x / 1280 - 0.045,
                                        t: circleObj.y / 720 - 0.08,
                                    })
                            }

                            stepCount++

                            if (isHighShowPart) {
                                audioList.audioTing.currentTime = 0;
                                audioList.audioTing.play()
                            }

                            const drawNextStep = () => {
                                if (isHighShowPart || !isConnected) {
                                    isTracingStarted = true;
                                    parentObject.current.style.pointerEvents = ''
                                }

                                currentPath = currentMovePath[letterNum][stepCount]
                                rememberX = currentPath[0].x

                                circleObj.x = currentMovePath[letterNum][stepCount][0].x;
                                circleObj.y = currentMovePath[letterNum][stepCount][0].y;

                                if (!isFirefox) {
                                    moveObj.x = currentMovePath[letterNum][stepCount][0].x;
                                    moveObj.y = currentMovePath[letterNum][stepCount][0].y;
                                }

                                else
                                    iconRef.current.setPosInfo({
                                        l: circleObj.x / 1280 - 0.045,
                                        t: circleObj.y / 720 - 0.08,
                                    })

                                if (currentFirstPosList[letterNum][stepCount].letter_start) {

                                    addHighlightCount
                                        = currentFirstPosList[letterNum][stepCount].addCount ? currentFirstPosList[letterNum][stepCount].addCount : 0
                                    let oldHighNum = highCurrentNum
                                    highCurrentNum = highCurrentNum + 1 + addHighlightCount



                                    if (isLowerDrawing) {
                                        lowerHighlightRefList.map((value, index) => {
                                            if (index > oldHighNum && index <= highCurrentNum)
                                                value.current.setClass('appear')
                                            else
                                                value.current.setClass('disappear')
                                        })
                                    }
                                    else {
                                        highlightRefList.map((value, index) => {
                                            if (index > oldHighNum && index <= highCurrentNum)
                                                value.current.setClass('appear')
                                            else
                                                value.current.setClass('disappear')
                                        })
                                    }
                                }

                                curve = new Phaser.Curves.Spline([currentFirstPosList[letterNum][stepCount].x, currentFirstPosList[letterNum][stepCount].y]);
                                curves = []

                                subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                subCurves = []

                                curves.push(curve);
                                subCurves.push(subCurve)


                                curve.addPoint(circleObj.x, circleObj.y);

                                parentObject.current.style.pointerEvents = ''
                                isTracingStarted = true

                                startRepeatAudio()
                                startRepeatScaleFunc();
                            }

                            if (isHighShowPart) {

                                isMoving = false;
                                isTracingStarted = false;
                                parentObject.current.style.pointerEvents = 'none'

                                setTimeout(() => {
                                    drawNextStep()
                                }, 750);
                            }

                            else {
                                if (isConnected)
                                    drawNextStep()
                                else {
                                    isMoving = false;
                                    isTracingStarted = false;
                                    parentObject.current.style.pointerEvents = 'none'
                                    setTimeout(() => {

                                        drawNextStep()
                                    }, 200);
                                }


                            }
                        }

                    }
                }
            }
        }, this);

        circleObj.on('pointermove', moveFunc, this);

        function moveFunc(pointer) {

            if (pointer.isDown && isMoving && isTracingStarted) {

                var x = Number(pointer.x.toFixed(2));
                var y = Number(pointer.y.toFixed(2));

                let minDistance = 1000;
                let currentMinDisIndex = nearestStepNum;
                let lastIndex = nearestStepNum + 2;
                if (lastIndex > currentPath.length)
                    lastIndex = currentPath.length

                for (let i = nearestStepNum; i < lastIndex; i++) {
                    if (minDistance > Phaser.Math.Distance.Between(x, y, currentPath[i].x, currentPath[i].y)) {
                        minDistance = Phaser.Math.Distance.Between(x, y, currentPath[i].x, currentPath[i].y)
                        currentMinDisIndex = i;
                    }
                }


                let pairIndex;
                if (currentMinDisIndex == 0)
                    pairIndex = 1;
                else if (currentMinDisIndex == currentPath.length - 1)
                    pairIndex = currentMinDisIndex - 1;

                else {
                    if (Phaser.Math.Distance.Between(x, y, currentPath[currentMinDisIndex + 1].x, currentPath[currentMinDisIndex + 1].y) >
                        Phaser.Math.Distance.Between(x, y, currentPath[currentMinDisIndex - 1].x, currentPath[currentMinDisIndex - 1].y))
                        pairIndex = currentMinDisIndex - 1;
                    else
                        pairIndex = currentMinDisIndex + 1;

                    if (completedIndex < currentMinDisIndex - 1)
                        completedIndex = currentMinDisIndex - 1
                    pairIndex = completedIndex;

                    if (pairIndex == currentMinDisIndex)
                        pairIndex += 1
                }

                if (currentMinDisIndex >= nearestStepNum && currentMinDisIndex - nearestStepNum <= 1) {

                    let fromIndex = currentPath[currentMinDisIndex].x > currentPath[pairIndex].x ? pairIndex : currentMinDisIndex
                    let toIndex = currentPath[currentMinDisIndex].x > currentPath[pairIndex].x ? currentMinDisIndex : pairIndex

                    let x1 = currentPath[fromIndex].x
                    let x2 = currentPath[toIndex].x
                    let y1 = currentPath[fromIndex].y
                    let y2 = currentPath[toIndex].y

                    optimizedPosition = currentPath[currentMinDisIndex]
                    minDistance = 1000

                    if (x1 != x2)
                        for (let i = 0; i <= Math.abs(currentPath[fromIndex].x
                            - currentPath[toIndex].x); i += 0.1) {
                            let currentXPos = x1 + i;
                            let currentYPos = y1 + (y2 - y1) / (x2 - x1) * (currentXPos - x1)

                            if (minDistance > Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)) {
                                minDistance = Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)
                                optimizedPosition = { x: currentXPos, y: currentYPos }
                            }
                        }

                    else {
                        let addY = y2 > y1 ? y1 : y2;
                        for (let i = 0; i < Math.abs(y1 - y2); i += 0.1) {
                            let currentXPos = x1;
                            let currentYPos = addY + i

                            if (minDistance > Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)) {
                                minDistance = Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)
                                optimizedPosition = { x: currentXPos, y: currentYPos }
                            }
                        }
                    }

                    if (currentMinDisIndex >= nearestStepNum) {
                        if (minDistance < 60) {

                            if (nearestStepNum != currentMinDisIndex && currentMinDisIndex > 0) {
                                subGraphics.lineStyle(currentLingLength, brushColorList[repeatStep]);

                                subCurve.addPoint(
                                    currentPath[currentMinDisIndex - 1].x,
                                    currentPath[currentMinDisIndex - 1].y
                                )

                                subCurves.forEach(function (c) {
                                    c.draw(subGraphics, currentLingLength);
                                });
                            }

                            x = optimizedPosition.x
                            y = optimizedPosition.y

                            let isPassable = true;

                            if (currentPath.length == 2)
                                isPassable = true;

                            let fIndex = nearestStepNum > pairIndex ? pairIndex : nearestStepNum
                            let tIndex = nearestStepNum > pairIndex ? nearestStepNum : pairIndex

                            if (currentPath.length > 2 &&
                                currentPath[fIndex] != null && !isPassable
                                && currentPath[tIndex] != null) {

                                if (currentPath[fIndex].x < currentPath[tIndex].x)
                                    rememberIsLeft = false
                                else if (currentPath[fIndex].x > currentPath[tIndex].x)
                                    rememberIsLeft = true

                                if ((x > rememberX && !rememberIsLeft) ||
                                    currentPath[fIndex].x == currentPath[tIndex].x
                                    || (x < rememberX && rememberIsLeft))
                                    isPassable = true;
                            }


                            if (isPassable) {
                                nearestStepNum = currentMinDisIndex
                                rememberX = x;
                                let compDistance = Phaser.Math.Distance.Between(x, y, currentPath[currentPath.length - 1].x,
                                    currentPath[currentPath.length - 1].y)

                                if (compDistance < 40 && currentMinDisIndex == currentPath.length - 1) {



                                    stopRepeatAudio()
                                    stopScaleFunc()

                                    x = currentPath[currentPath.length - 1].x
                                    y = currentPath[currentPath.length - 1].y

                                    nearestStepNum = 0;
                                    completedIndex = 0
                                    // for (let i = 0; i < currentMinDisIndex; i++)
                                    //     curve.addPoint(currentPath[i])
                                    curve.addPoint(x, y);

                                    if (stepCount == currentMovePath[letterNum].length - 1) {

                                        isMoving = false;
                                        isTracingStarted = false;

                                        graphics.lineStyle(100, brushColorList[repeatStep]);

                                        if (isLowerDrawing) {
                                            lowerHighlightRefList.map(item => item.current.setClass('disappear'))
                                        }
                                        else
                                            highlightRefList.map(item => item.current.setClass('disappear'))

                                        circleObj.y = 10000;

                                        if (!isFirefox) {
                                            moveObj.y = 10000
                                        }
                                        else {
                                            iconRef.current.setClass('hideObject')
                                        }

                                        curves.forEach(function (c) {
                                            c.draw(graphics, 100);
                                        });

                                        subCurves.forEach(function (c) {
                                            c.draw(subGraphics, 100);
                                        });


                                        if (isLowerDrawing) {
                                            lowerOutlineRefList[0].current.setClass('disappear')
                                            lowerOutlineRefList[1].current.setClass('appear')

                                        }
                                        else {
                                            outLineRefList[0].current.setClass('disappear')
                                            outLineRefList[1].current.setClass('appear')
                                        }


                                        markRefList[repeatStep].current.setUrl("icons/sb02_progress_bar_yellow_flower.svg")



                                        if (repeatStep < 2) {
                                            audioList.bodyAudio1.src = returnVoicePath(0, explainVoices[repeatStep + 2])
                                            audioList.audioTing.currentTime = 0;
                                            audioList.audioTing.play();
                                        }
                                        else
                                            audioList.spakleAudio.play()

                                        showingImg.current.style.transform = 'scale(1.12)'

                                        setTimeout(() => {

                                            let waitTime = wordVoiceList[repeatStep].duration * 1000

                                            if (repeatStep == 2) {
                                                audioList.excellentAudio.play()
                                                setTimeout(() => {
                                                    wordVoiceList[repeatStep].play();
                                                }, 1500);
                                                waitTime += 1500
                                            }
                                            else
                                                wordVoiceList[repeatStep].play();

                                            setTimeout(() => {

                                                showingImg.current.style.transform = 'scale(1)'

                                                if (repeatStep < 2)
                                                    showingImg.current.className = 'disappear'

                                                setTimeout(() => {
                                                    if (repeatStep < 2) {
                                                        let timeDur = 10;

                                                        if (!isFirefox) {
                                                            moveObj.visible = false
                                                            moveObj.setScale(lowerIconWidth[letterNum])
                                                        }
                                                        else {
                                                            iconRef.current.setClass('disappear')
                                                            iconRef.current.setStyle({ transform: 'scale(' + lowerIconWidth[letterNum] + ')' })
                                                        }

                                                        if (!isLowerDrawing) {
                                                            outLineRefList.map(item =>
                                                                item.current.setClass('disappear'))
                                                            drawingRef.current.className = 'disappear'
                                                            highlightRefList.map(item =>
                                                                item.current.setClass('disappear'))

                                                            setTimeout(() => {
                                                                drawingRef.current.style.WebkitMaskImage = 'url("' + prePathUrl() + 'images/' + lowerPrepath + 'gray.svg")'
                                                                drawingRef.current.style.WebkitMaskPosition = lowerMaskInfoList[letterNum].position
                                                                drawingRef.current.style.WebkitMaskSize = lowerMaskInfoList[letterNum].size
                                                                setTimeout(() => {
                                                                    drawingRef.current.className = 'appear'
                                                                }, 700);

                                                            }, 300);
                                                            timeDur = 1000
                                                        }

                                                        setTimeout(() => {
                                                            lastPosCount = 0;
                                                            addHighlightCount = lowerFirstPosList[letterNum][0].addCount ? lowerFirstPosList[letterNum][0].addCount : 0

                                                            lowerHighlightRefList.map((highlight, index) => {
                                                                if (index == 0 || index <= addHighlightCount)
                                                                    highlight.current.setClass('appear')
                                                                else
                                                                    highlight.current.setClass('disappear')
                                                            })

                                                            lowerCaseRef.current.className = 'appear'
                                                            setTimeout(() => {
                                                                lowerCaseRef.current.className = 'commonButton'
                                                            }, 300);

                                                            lowerOutlineRefList[1].current.setClass('disappear')

                                                            isLowerCaseShow = true
                                                            isLowerDrawing = true;
                                                            currentMovePath = isLowerDrawing ? lowerMovePath : movePath
                                                            currentFirstPosList = isLowerDrawing ? lowerFirstPosList : firstPosList
                                                            currentlineWidthList = isLowerDrawing ? lowerLineWidthList : lineWidthList
                                                            currentLetterPosList = isLowerDrawing ? lowerLetterPosList : letterPosList

                                                            // fomart values....

                                                            highCurrentNum = addHighlightCount
                                                            currentLingLength = currentlineWidthList[letterNum]
                                                            stepCount = 0;

                                                            currentPath = currentMovePath[letterNum][stepCount]

                                                            repeatStep++;
                                                            rememberX = currentPath[0].x

                                                            showingImg.current.className = 'appear'
                                                            lowerOutlineRefList[0].current.setClass('appear')

                                                            isFirst = true;
                                                            nearestStepNum = 0;

                                                            optimizedPosition = currentMovePath[letterNum][0][0]
                                                            //.............

                                                            circleObj.x = optimizedPosition.x;
                                                            circleObj.y = optimizedPosition.y;

                                                            lastObjectList.map(obj => {
                                                                if (obj != null) {
                                                                    obj.visible = false;
                                                                    obj.setFillStyle(brushColorList[repeatStep], 1)
                                                                }
                                                            })
                                                            firstObjectList.map(obj => {
                                                                if (obj != null) {
                                                                    obj.visible = false;
                                                                    obj.setFillStyle(brushColorList[repeatStep], 1)
                                                                }
                                                            })

                                                            if (!isFirefox) {
                                                                setTimeout(() => {
                                                                    moveObj.visible = true
                                                                    moveObj.x = optimizedPosition.x;
                                                                    moveObj.y = optimizedPosition.y
                                                                }, 150);

                                                            }
                                                            else {
                                                                iconRef.current.setPosInfo({
                                                                    l: circleObj.x / 1280 - 0.045,
                                                                    t: circleObj.y / 720 - 0.08,
                                                                })
                                                                setTimeout(() => {
                                                                    iconRef.current.setClass('showObject')
                                                                }, 300);

                                                            }


                                                            graphics.clear();
                                                            subGraphics.clear();

                                                            curve = new Phaser.Curves.Spline([currentFirstPosList[letterNum][0].x, currentFirstPosList[letterNum][0].y]);
                                                            curves = []


                                                            subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                                            subCurves = []

                                                            isTracingStarted = true;

                                                            timerList[0] = setTimeout(() => {
                                                                // audioList.letterAudio.play()

                                                                // timerList[3] = setTimeout(() => {
                                                                audioList.bodyAudio1.play();
                                                                playScaleFunc()

                                                                timerList[1] = setTimeout(() => {
                                                                    stopScaleFunc()

                                                                    // audioList.tapAudio.play()
                                                                    playTapAnimation()

                                                                    // timerList[2] = setTimeout(() => {
                                                                    startRepeatAudio();
                                                                    startRepeatScaleFunc()

                                                                    stopTapAnimation()

                                                                    // }, audioList.tapAudio.duration * 1000);
                                                                }, audioList.bodyAudio1.duration * 1000 + 500);
                                                                // }, audioList.letterAudio.duration * 1000);

                                                            }, 500);
                                                        }, timeDur);


                                                    }
                                                    else {
                                                        setTimeout(() => {
                                                            reviewFunc();

                                                            audioList.tapAudio.pause()
                                                            audioList.tapAudio.currentTime = 0;
                                                        }, 1000);

                                                    }

                                                    if (currentImgNumOriginal < 2) {
                                                        currentImgNumOriginal++
                                                        setRendering(currentImgNumOriginal);
                                                    }
                                                }, 500);
                                            }, waitTime + 1000);
                                        }, 1000);

                                    }
                                    else {
                                        let isHighShowPart = currentFirstPosList[letterNum][stepCount + 1].letter_start;
                                        let isConnected = currentFirstPosList[letterNum][stepCount + 1].disConnected ? false : true;
                                        let isPlayTing = currentFirstPosList[letterNum][stepCount + 1].hasTing;


                                        if (currentFirstPosList[letterNum][stepCount].lastObj != null) {
                                            lastObjectList[currentFirstPosList[letterNum][stepCount].lastObj].visible = true
                                        }

                                        curves.forEach(function (c) {
                                            c.draw(graphics, 100);
                                        });

                                        subCurves.forEach(function (c) {
                                            c.draw(subGraphics, 100);
                                        });

                                        let isSubLastPos = false;
                                        let lastPos

                                        if (letterNum == 24 && isLowerDrawing) {
                                            isSubLastPos = true
                                            lastPos = { x: 625, y: 335 }
                                        }

                                        if ((isHighShowPart
                                            && currentLetterPosList[letterNum].lastPosList
                                            && currentLetterPosList[letterNum].lastPosList.length > lastPosCount) || isSubLastPos) {

                                            if (!isSubLastPos)
                                                lastPos = currentLetterPosList[letterNum].lastPosList[lastPosCount]

                                            circleObj.x = lastPos.x;
                                            circleObj.y = lastPos.y;

                                            lastPosCount++

                                            if (!isFirefox) {
                                                moveObj.x = lastPos.x;
                                                moveObj.y = lastPos.y;
                                            }

                                            else
                                                iconRef.current.setPosInfo({
                                                    l: circleObj.x / 1280 - 0.045,
                                                    t: circleObj.y / 720 - 0.08,
                                                })
                                        }

                                        stepCount++

                                        if (isHighShowPart || isPlayTing) {
                                            audioList.audioTing.currentTime = 0;
                                            audioList.audioTing.play()
                                        }

                                        const drawNextStep = () => {
                                            if (isHighShowPart || !isConnected) {
                                                isTracingStarted = true;
                                                parentObject.current.style.pointerEvents = ''
                                            }

                                            currentPath = currentMovePath[letterNum][stepCount]
                                            rememberX = currentPath[0].x

                                            circleObj.x = currentMovePath[letterNum][stepCount][0].x;
                                            circleObj.y = currentMovePath[letterNum][stepCount][0].y;

                                            if (!isFirefox) {
                                                moveObj.x = currentMovePath[letterNum][stepCount][0].x;
                                                moveObj.y = currentMovePath[letterNum][stepCount][0].y;
                                            }

                                            else
                                                iconRef.current.setPosInfo({
                                                    l: circleObj.x / 1280 - 0.045,
                                                    t: circleObj.y / 720 - 0.08,
                                                })

                                            if (currentFirstPosList[letterNum][stepCount].letter_start) {

                                                addHighlightCount
                                                    = currentFirstPosList[letterNum][stepCount].addCount ? currentFirstPosList[letterNum][stepCount].addCount : 0
                                                let oldHighNum = highCurrentNum
                                                highCurrentNum = highCurrentNum + 1 + addHighlightCount



                                                if (isLowerDrawing) {
                                                    lowerHighlightRefList.map((value, index) => {
                                                        if (index > oldHighNum && index <= highCurrentNum)
                                                            value.current.setClass('appear')
                                                        else
                                                            value.current.setClass('disappear')
                                                    })
                                                }
                                                else {
                                                    highlightRefList.map((value, index) => {
                                                        if (index > oldHighNum && index <= highCurrentNum)
                                                            value.current.setClass('appear')
                                                        else
                                                            value.current.setClass('disappear')
                                                    })
                                                }
                                            }

                                            curve = new Phaser.Curves.Spline([currentFirstPosList[letterNum][stepCount].x, currentFirstPosList[letterNum][stepCount].y]);
                                            curves = []

                                            subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                            subCurves = []

                                            curves.push(curve);
                                            subCurves.push(subCurve)


                                            curve.addPoint(circleObj.x, circleObj.y);

                                            parentObject.current.style.pointerEvents = ''
                                            isTracingStarted = true

                                            startRepeatAudio()
                                            startRepeatScaleFunc();
                                        }

                                        if (isHighShowPart) {

                                            isMoving = false;
                                            isTracingStarted = false;
                                            parentObject.current.style.pointerEvents = 'none'

                                            setTimeout(() => {
                                                drawNextStep()
                                            }, 750);
                                        }

                                        else {
                                            if (isConnected)
                                                drawNextStep()
                                            else {
                                                isMoving = false;
                                                isTracingStarted = false;
                                                parentObject.current.style.pointerEvents = 'none'
                                                setTimeout(() => {

                                                    drawNextStep()
                                                }, 200);
                                            }


                                        }


                                    }
                                }

                                else {

                                    if (currentPath[currentMinDisIndex].w != null)
                                        currentLingLength = currentPath[currentMinDisIndex].w

                                    graphics.lineStyle(currentLingLength, brushColorList[repeatStep]);
                                    curve.addPoint(x, y);

                                    curves.forEach(function (c) {
                                        c.draw(graphics, 100);
                                    });

                                    circleObj.x = optimizedPosition.x;
                                    circleObj.y = optimizedPosition.y;



                                    if (!isFirefox) {
                                        moveObj.x = optimizedPosition.x;
                                        moveObj.y = optimizedPosition.y
                                    }
                                    else {
                                        iconRef.current.setPosInfo({
                                            l: optimizedPosition.x / 1280 - 0.045,
                                            t: optimizedPosition.y / 720 - 0.08,
                                        })
                                    }

                                    if (Phaser.Math.Distance.Between(optimizedPosition.x, optimizedPosition.y,
                                        currentPath[currentMinDisIndex].x, currentPath[currentMinDisIndex].y) < 3)
                                        completedIndex = currentMinDisIndex

                                }
                            }

                        }
                    }

                }
            }
        }


        // var fs = this.add.circle(firstPos.x, firstPos.y, 3, 0x000000, 0.5)
        path = new Phaser.Curves.Path(firstPos.x, firstPos.y);

        this.input.on('pointerdown1', function (pointer) {

            posList.push({ x: pointer.x, y: pointer.y })

            posList.map(pos => {
                path.lineTo(pos.x, pos.y);
            })

            console.log('{x:' + pointer.x.toFixed(0) + ', y:' + pointer.y.toFixed(0) + '},')
            // graphics.clear()

            posList = []


            graphics.lineStyle(2, 0x000000, 1);
            path.draw(graphics);
            graphics.fillStyle(0x000000, 1);

            path = new Phaser.Curves.Path(pointer.x, pointer.y);

        }, this);
    }


    function update() {

    }

    // highlight game

    function highlight_preload() {

        if (!isFirefox)
            this.load.image('icon', prePathUrl() + 'images/icons/sb02_tracing_icon.svg');

        // this.load.image('wOutLine', preName + 'White-Highlight.svg');
        // this.load.image('yOutLine', preName + 'Yellow-Highlight.svg');
    }

    function highlight_create() {

        if (!isFirefox) {
            let obj = this.add.sprite(currentMovePath[letterNum][0][0].x, currentMovePath[letterNum][0][0].y, 'icon');
            obj.setScale(lowerIconWidth[letterNum])
            moveObj = obj
        }
    }

    return (
        <div
            className="hideObject"
            ref={parentObject}
        >
            {/* <BaseImage
                    scale={0.05}
                    posInfo={{ r: 0.03 + 0.075, t: 0.05 }}
                    url="sb_04_hand_tool/hand.svg"
                /> */}

            <div
                ref={showingImg}
                className='hideObject'
                style={{
                    position: 'fixed', width: _geo.width * 0.12 + 'px',
                    height: _geo.height * 0.25 + 'px',
                    right: _geo.left + _geo.width * 0.13 + 'px',
                    bottom: _geo.top + _geo.height * 0.25 + 'px',

                    pointerEvents: 'none',
                }}>
                <BaseImage
                    scale={showingLayoutList[letterNum][currentImgNumOriginal].s}
                    posInfo={{
                        b: showingLayoutList[letterNum][currentImgNumOriginal].b,
                        r: showingLayoutList[letterNum][currentImgNumOriginal].r
                    }}
                    url={"prop/" + IconPrefix + textInfoList[letterNum][currentImgNumOriginal].text.replace('-', '') + ".svg"}

                />
                <span
                    style={{
                        position: 'absolute', width: '200%', textAlign: 'center',
                        height: '30%', left: -50 + textInfoList[letterNum][currentImgNumOriginal].left + '%',
                        top: '90%', fontFamily: 'popinBold',
                        fontSize: '3.7vw'
                    }}>

                    {
                        !textInfoList[letterNum][currentImgNumOriginal].isLast
                            ? <span >
                                <div style={{ color: 'red', display: 'inline-block' }}>{textInfoList[letterNum][currentImgNumOriginal].text[0]}</div>
                                <span style={{ color: 'black' }}>{textInfoList[letterNum][currentImgNumOriginal].text.replace('_', ' ').slice(1)}</span>
                            </span>
                            : <span style={{ color: 'black' }}>{textInfoList[letterNum][currentImgNumOriginal].text.replace('_', ' ').slice(0, textInfoList[letterNum][currentImgNumOriginal].text.length - 1)}
                                <span style={{ color: 'red' }}>{textInfoList[letterNum][currentImgNumOriginal].text.replace('_', ' ').slice(-1)}</span>
                            </span>
                    }

                </span>
            </div>
            {
                [0, 1, 2].map(value =>
                    <div
                        ref={reviewImgList[value]}
                        className='hideObject'
                        style={{
                            position: 'fixed', width: _geo.width * 0.14 + 'px',
                            height: _geo.height * 0.15 + 'px',
                            left: _geo.left + _geo.width * (0.1 + 0.32 * value) + 'px',
                            bottom: _geo.top + _geo.height * 0.24 + 'px',
                            pointerEvents: 'none',
                        }}>
                        <BaseImage
                            scale={showingLayoutList[letterNum][value].s}
                            posInfo={{
                                b: showingLayoutList[letterNum][value].b + 0.4,
                                r: showingLayoutList[letterNum][value].r
                            }}
                            url={"prop/" + IconPrefix + textInfoList[letterNum][value].text.replace('-', '') + ".svg"}
                        />
                        <span
                            style={{
                                position: 'absolute', width: '200%', textAlign: 'center',
                                height: '30%', left: -50 + textInfoList[letterNum][value].left + '%', top: '45%', fontFamily: 'popinBold',
                                fontSize: '4vw'
                            }}>
                            {
                                !textInfoList[letterNum][value].isLast
                                    ? <span>
                                        <div style={{ color: 'red', display: 'inline-block' }}>{textInfoList[letterNum][value].text[0]}
                                        </div>
                                        <span style={{ color: 'black' }}>{textInfoList[letterNum][value].text.replace('_', ' ').slice(1)}</span>
                                    </span>
                                    : <span style={{ color: 'black' }}>{textInfoList[letterNum][value].text.replace('_', ' ').slice(0, textInfoList[letterNum][value].text.length - 1)}
                                        <span style={{ color: 'red' }}>{textInfoList[letterNum][value].text.replace('_', ' ').slice(-1)}</span>
                                    </span>
                            }
                        </span>
                    </div>
                )
            }
            {
                <div
                    ref={sparkBaseRef}
                    style={{
                        position: 'fixed', width: _geo.width * 0.15 + 'px',
                        height: _geo.height * 0.15 + 'px',
                        left: _geo.left + _geo.width * (0.1) + 'px',
                        bottom: _geo.top + _geo.height * 0.2 + 'px',
                        pointerEvents: 'none',
                    }}>
                    {[0, 1, 2].map(value =>
                        <BaseImage
                            ref={sparkRefList[value]}
                            className='hideObject'
                            posInfo={{
                                b: 1,
                                l: 0.0
                            }}
                            style={{ transform: 'scale(' + [0.3, 1.7, 2.4][value] + ')' }}
                            url={"magic/sb_52_magic_wand_sparkels_" + (value + 1) + ".svg"}
                        />
                    )}
                </div>
            }
            <div

                ref={markBarRef}
                style={{
                    position: 'fixed',
                    width: _geo.width * 0.25 + 'px',
                    height: _geo.width * 0.25 + 'px',
                    right: _geo.width * (0.03) + 'px',
                    top: 0.05 * _geo.height + 'px',
                    pointerEvents: 'none'
                }}
            >
                <BaseImage

                    url="icons/sb02_progress_bar.svg"
                />

            </div>
            <div ref={markParentRef}>
                {
                    [0, 1, 2].map(value =>
                        <div
                            ref={markBaseList[2 - value]}
                            style={{
                                position: 'fixed',
                                width: _geo.width * 0.05 + 'px',
                                height: _geo.width * 0.05 + 'px',
                                right: _geo.width * (0.06 + 0.07 * value) + 'px',
                                top: 0.075 * _geo.height + 'px',
                                pointerEvents: 'none'
                            }}>
                            <BaseImage
                                ref={markRefList[2 - value]}
                                url="icons/sb02_progress_bar_gray_flower.svg"
                            />
                        </div>
                    )
                }
            </div>

            <div ref={drawingPanel}>
                <div
                    id='DrawingDiv'
                    ref={drawingRef}
                    style={{
                        position: 'fixed', width: _geo.width,
                        height: _geo.height,
                        left: _geo.left, top: _geo.top,
                        WebkitMaskImage: 'url("' + prePathUrl() + 'images/' + lowerPrepath + 'gray.svg")',
                        WebkitMaskPosition: lowerMaskInfoList[letterNum].position,
                        WebkitMaskSize: lowerMaskInfoList[letterNum].size,

                        WebkitMaskRepeat: "no-repeat",
                        overflow: 'hidden',
                        background: '#999999'
                    }}
                >
                </div>
                <div
                    ref={subObjectsRef}
                    style={{
                        position: 'fixed',
                        width: _geo.width, height: _geo.height,
                        left: _geo.left, top: _geo.top,
                        pointerEvents: 'none',
                    }}
                >
                    {
                        letterPosList[letterNum].highlight.map((value, index) =>
                            <BaseImage
                                ref={highlightRefList[index]}
                                scale={value.s}
                                posInfo={{
                                    t: value.t,
                                    l: value.l
                                }}
                                className={'hideObject'}
                                style={{ transform: letterNum == 24 ? 'rotateY(180deg) ' + 'rotateZ(' + [3, 0][index] + 'deg)' : '' }}
                                url={prePath + 'arrow_' + (index + 1) + '.svg'}
                            />
                        )
                    }
                    {
                        lowerLetterPosList[letterNum].highlight.map((value, index) =>
                            <BaseImage
                                ref={lowerHighlightRefList[index]}
                                scale={value.s}
                                posInfo={{
                                    t: value.t,
                                    l: value.l
                                }}

                                className={(index == 0 || index <= lowerFirstPosList[letterNum][0].addCount) ? '' : 'hideObject'}
                                url={lowerPrepath + 'arrow_0' + (index + 1) + '.svg'}
                            />
                        )
                    }




                    <BaseImage ref={lowerOutlineRefList[0]}
                        scale={lowerLetterPosList[letterNum].layout.s}
                        posInfo={{
                            t: lowerLetterPosList[letterNum].layout.t,
                            l: lowerLetterPosList[letterNum].layout.l
                        }}
                        className=''
                        url={lowerPrepath + 'white_glow.svg'}
                    />
                    <BaseImage ref={lowerOutlineRefList[1]}
                        scale={lowerLetterPosList[letterNum].layout.s}
                        posInfo={{
                            t: lowerLetterPosList[letterNum].layout.t,
                            l: lowerLetterPosList[letterNum].layout.l
                        }}
                        className='hideObject'
                        url={lowerPrepath + 'yellow_glow.svg'}
                    />
                    <BaseImage
                        ref={outLineRefList[0]}
                        scale={letterPosList[letterNum].layout.s}
                        posInfo={{
                            t: letterPosList[letterNum].layout.t,
                            l: letterPosList[letterNum].layout.l
                        }}
                        className='hideObject'
                        url={prePath + 'white_highlight.svg'}
                    />

                    <BaseImage
                        ref={outLineRefList[1]}
                        scale={letterPosList[letterNum].layout.s}
                        posInfo={{
                            t: letterPosList[letterNum].layout.t,
                            l: letterPosList[letterNum].layout.l
                        }}
                        className='hideObject'
                        url={prePath + 'yellow_highlight.svg'}
                    />


                    {
                        isFirefox &&
                        < BaseImage
                            ref={iconRef}
                            scale={0.09 * lowerIconWidth[letterNum]}
                            posInfo={{
                                l: currentMovePath[letterNum][0][0].x / 1280 - 0.045,
                                t: currentMovePath[letterNum][0][0].y / 720 - 0.08
                            }}
                            url={'icons/sb02_tracing_icon.svg'}
                        />
                    }

                </div>
                <div id='highlightDiv'
                    style={{
                        position: 'fixed',
                        width: _geo.width, height: _geo.height,
                        left: _geo.left, top: _geo.top,
                        pointerEvents: 'none',
                    }}
                >
                </div>

            </div>
            <div
                ref={lowerCaseRef}
                className="commonButton"

                onMouseEnter={stopTapAnimation}
                onClick={() => {
                    setTimeout(() => {
                        clickUpperCase();
                    }, 200);
                }}
                style={{
                    position: 'fixed',
                    width: _geo.width * 0.15 + 'px'
                    , height: _geo.width * 0.15 + 'px',
                    left: _geo.left + _geo.width * 0.08 + 'px',
                    top: _geo.top + _geo.height * 0.55 + 'px',
                    borderRadius: '35%'
                }}
            >
                <BaseImage
                    url={"icons/sb02_icon_" + letterTurnList[currentLetterNum].toLowerCase() + ".svg"}
                />
            </div>

            <div
                ref={animationRef}
                style={{
                    position: 'fixed',
                    width: _geo.width * animtionList[letterNum].scale,
                    left: _geo.left + _geo.width * animtionList[letterNum].left,
                    top: _geo.top + _geo.height * animtionList[letterNum].top,
                    pointerEvents: 'none',
                    overflow: 'visible'
                }}
            >
                <Player
                    ref={playerRef}
                    onEvent={(e) => {
                        if (e == 'complete' && !isTracingStarted)
                            showingDrawingPanel();
                    }}
                    keepLastFrame={true}

                    src={prePathUrl() + 'lottiefiles/main/' + letterTurnList[letterNum] + '_1.json'}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        left: '0%',
                        top: '0%',
                        pointerEvents: 'none',
                        overflow: 'visible'
                    }}
                >
                    {/* <Controls visible={false} buttons={['play', 'frame', 'debug']} /> */}
                </Player>
            </div>

            <div
                ref={skipButton}
                className='hideObject'
                onClick={() => {
                    clearTimeout(timerList[0])
                    clearTimeout(timerList[1])
                    audioList.bodyAudio1.pause()
                    playerRef.current.pause()
                    audioList.bodyAudio1.src = returnVoicePath(0, explainVoices[1])

                    setTimeout(() => {
                        showingDrawingPanel();
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
        </div >
    );
}


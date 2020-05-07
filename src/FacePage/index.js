/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';
import Camera from './Camera';
import Canva from './Canva';
import * as faceapi from 'face-api.js';
import filtro1 from './buttomicon/comida1.svg';
import filtro2 from './buttomicon/comida2.svg';
import filtro3 from './buttomicon/comida3.svg';
import filtro4 from './buttomicon/comida4.svg';
import filtro5 from './buttomicon/comida5.svg';
import filtro6 from './buttomicon/comida6.svg';
import filtro7 from './buttomicon/comida7.svg';
import filtro8 from './buttomicon/comida8.svg';
import filtro9 from './buttomicon/comida9.svg';
import filtro10 from './buttomicon/comida10.svg';
import filtro11 from './buttomicon/comida11.svg';
import filtro12 from './buttomicon/comida12.svg';
import filtro13 from './buttomicon/helado13.svg';
import filtro14 from './buttomicon/helado14.svg';
import filtro15 from './buttomicon/chocolate15.svg';

import './ScrollButton/scroll.css';

class FacePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controller: 'game',
            loading: false,
            authorized: false,
            checkAutorization: true,
            positionIndex: 0,
            filterName: 'Filtro_1',
            imageFilter: new Image(),
            showFilter: true,
            ejeXe: 0,
            ejeYe: 0,
            landStart:0,
            landEnd: 0
        }
        this.setVideoHandler = this.setVideoHandler.bind(this);
        this.isModelLoaded = this.isModelLoaded.bind(this);
    }

    async setVideoHandler() {
        if (this.isModelLoaded() !== undefined) {
            try {
                let result = await faceapi.detectSingleFace(this.props.video.current, this.props.detector_options).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
                if (result !== undefined) {
                    console.log("face detected", 1);
                    const dims = faceapi.matchDimensions(this.props.canvas.current, this.props.video.current, true);
                    const resizedResult = faceapi.resizeResults(result, dims);
                    faceapi.draw.drawDetections(this.props.canvas.current, resizedResult);
                    faceapi.draw.drawFaceLandmarks(this.props.canvas.current, resizedResult);

                    const currentCanvas = ReactDOM.findDOMNode(this.props.canvas.current);
                    var canvasElement = currentCanvas.getContext("2d");
                    this.addFilter(canvasElement, result);
                    this.addBoxIndexOfLandmark(canvasElement, result.landmarks.positions[this.state.positionIndex]);
                    this.addBackgroundInformation(canvasElement, result);
                    this.addGenderAndAgeInformation(canvasElement, result);
                    this.addEmotionInformation(canvasElement, resizedResult, result);

                } else {
                    console.log("face detected", 1);
                }
            } catch (exception) {
                console.log(exception);
            }
        }
        setTimeout(() => this.setVideoHandler());
    }

    addBoxIndexOfLandmark(canvasElement, landkmarkPosition) {
        let width = 10, height = 10;
        canvasElement.setTransform(1, 0, 0, 1, 0, 0);
        canvasElement.fillStyle = 'rgb(255, 87, 51)';
        canvasElement.fillRect(landkmarkPosition.x, landkmarkPosition.y, width, height);
        canvasElement.closePath();
        canvasElement.setTransform(1, 0, 0, 1, 0, 0);
    }

    addBackgroundInformation(canvasElement, result) {
        let positionX = result.landmarks.positions[8].x,
            positionY = result.landmarks.positions[8].y + 10;
        canvasElement.fillStyle = "black";
        canvasElement.fillRect(positionX-180, positionY-85, 90, 45);
        //canvasElement.fillRect(positionX - 45, positionY - 12, 90, 45);
    }

    addGenderAndAgeInformation(canvasElement, result) {
        // Edad y Sexo
        canvasElement.font = "10px Comic Sans MS";
        //canvasElement.font="30px Arial";
        canvasElement.fillStyle = "red";
        let positionX = result.landmarks.positions[8].x,
            positionY = result.landmarks.positions[8].y + 10,
            gender = (result.gender) === "male" ? "Hombre" : "Mujer",
            age = "Edad: " + result.age.toFixed();
        gender = "Sexo: " + gender;

        canvasElement.textAlign = "center";
        canvasElement.fillStyle = "white";
        canvasElement.fillText( gender, positionX-135,positionY-70 );
        canvasElement.fillText(age,positionX-135,positionY-57 );
        // canvasElement.fillText(gender, positionX, positionY);
        // canvasElement.fillText(age, positionX, positionY + 15);
    }

    addEmotionInformation(canvasElement, resizedResult, result) {
        const expressions = resizedResult.expressions;
        const maxValue = Math.max(...Object.values(expressions));
        let emotion = Object.keys(expressions).filter(
            item => expressions[item] === maxValue
        );
        emotion = emotion[0];
        emotion = (emotion === "happy") ? "feliz" : emotion;
        emotion = (emotion === "neutral") ? "neutral" : emotion;
        emotion = (emotion === "angry") ? "enojado" : emotion;
        emotion = (emotion === "sad") ? "triste" : emotion;
        emotion = (emotion === "surprised") ? "sorprendido" : emotion;
        emotion = (emotion === "fearful") ? "temeroso" : emotion;

        let positionX = result.landmarks.positions[8].x,
            positionY = result.landmarks.positions[8].y + 10;
        canvasElement.fillText( "Emocion: "+emotion, positionX-135,positionY-45 );
        // canvasElement.fillText("Emocion: " + emotion, positionX, positionY + 30);
    }

    addFilter(canvasElement, result) {
        // let startIndex = 0, endIndex = 16, ajustX = (this.state.ejeXe), ajustY = (this.state.ejeYe);
        let startIndex = (this.state.landStart), endIndex = (this.state.landEnd), ajustX = (this.state.ejeXe), ajustY = (this.state.ejeYe);
        let positionX1 = result.landmarks.positions[startIndex].x - ajustX,
            positionY1 = result.landmarks.positions[startIndex].y + ajustY,
            positionX2 = result.landmarks.positions[endIndex].x + ajustX,
            positionY2 = result.landmarks.positions[endIndex].y + ajustY,
            m = ((positionY2 - positionY1) / (positionX2 - positionX1)) * 100;

        let width = positionX2 - positionX1,
            height = width * 0.8;

        positionY1 -= (height / 4);
        positionY2 -= (height / 4);

        var TO_RADIANS = Math.PI / 180,
            angleInRad = (m / 2.5) * TO_RADIANS;
        console.log("TO_RADIANS", TO_RADIANS);

        canvasElement.setTransform(1, 0, 0, 1, 0, 0);
        canvasElement.translate(positionX1, positionY1 - 50);
        canvasElement.rotate(angleInRad);
        canvasElement.drawImage(this.state.imageFilter, 0, 0, width, height);
        /*canvasElement.translate(positionX1 ,positionY1) 
        canvasElement.translate(1,0,0,0,positionX1+(width/2),positionY1); 
        canvasElement.rotate(angleInRad);    */
        //canvasElement.drawImage(this.state.imageFilter,0,0,width,height);
        //canvasElement.restore();
        canvasElement.setTransform(1, 0, 0, 1, 0, 0);
        //this.rotateAndPaintImage(canvasElement, this.state.imageFilter, angleInRad, positionX1, positionY1,20,0 );
    }

    rotateAndPaintImage(context, image, angleInRad, positionX, positionY, axisX, axisY) {
        context.translate(positionX, positionY);
        context.rotate(angleInRad);
        context.drawImage(image, -axisX, -axisY);
        context.rotate(-angleInRad);
        context.translate(-positionX, -positionY);
    }

    isModelLoaded() {
        if (this.props.selected_face_detector === this.props.SSD_MOBILENETV1) return faceapi.nets.ssdMobilenetv1.params;
        if (this.props.selected_face_detector === this.props.TINY_FACE_DETECTOR) return faceapi.nets.tinyFaceDetector.params;
    }


    async componentDidMount() {
        console.log("height: " + window.screen.height + ", width: " + window.screen.width);

        // obtener parametros de configuracion y asignar el modelo que vamos a usar para reconocer rostros
        this.setDetectorOptions();
        this.props.SET_VIDEO_HANDLER_IN_GAME_FACENET(this.setVideoHandler);

        // asignar los archivos del model a face-api
        let modelFolder = "/models";

        let dirs = { 
            Filtro_1: '/filter/comida1.svg', 
            Filtro_2: '/filter/comida2.svg', 
            Filtro_3: '/filter/comida3.svg',
            Filtro_4: '/filter/comida4.svg',
            Filtro_5: '/filter/comida5.svg',
            Filtro_6: '/filter/comida6.svg',
            Filtro_7: '/filter/comida7.svg',
            Filtro_8: '/filter/comida8.svg',
            Filtro_9: '/filter/comida9.svg',
            Filtro_10: '/filter/comida10.svg',
            Filtro_11: '/filter/comida11.svg',
            Filtro_12: '/filter/comida12.svg',
            Filtro_13: '/filter/helado13.svg',
            Filtro_14: '/filter/helado14.svg',
            Filtro_15: '/filter/chocolate15.svg',
        }
        

        let valor = 'Filtro_1'
        try {
            await faceapi.loadFaceLandmarkModel(modelFolder);
            await faceapi.nets.ageGenderNet.loadFromUri(modelFolder);
            await faceapi.nets.faceExpressionNet.loadFromUri(modelFolder);
            if (this.props.selected_face_detector === this.props.SSD_MOBILENETV1) await faceapi.nets.ssdMobilenetv1.loadFromUri(modelFolder);
            if (this.props.selected_face_detector === this.props.TINY_FACE_DETECTOR) await faceapi.nets.tinyFaceDetector.load(modelFolder);

            this.state.imageFilter.src = (dirs[valor]);
            this.state.imageFilter.onload = function () {
                console.log("image is loaded");

            }
        } catch (exception) {
            console.log("exception", exception);
        }
    }


    async componentDidUpdate() {
        console.log('El estado ha cambiado')
        this.props.SET_VIDEO_HANDLER_IN_GAME_FACENET(this.setVideoHandler);

        // asignar los archivos del model a face-api
        let modelFolder = "/models";

        let dirs = { 
        Filtro_1: '/filter/comida1.svg', 
        Filtro_2: '/filter/comida2.svg', 
        Filtro_3: '/filter/comida3.svg',
        Filtro_4: '/filter/comida4.svg',        
        Filtro_5: '/filter/comida5.svg',
        Filtro_6: '/filter/comida6.svg',
        Filtro_7: '/filter/comida7.svg',
        Filtro_8: '/filter/comida8.svg',
        Filtro_9: '/filter/comida9.svg',
        Filtro_10: '/filter/comida10.svg',
        Filtro_11: '/filter/comida11.svg',
        Filtro_12: '/filter/comida12.svg',
        Filtro_13: '/filter/helado13.svg',
        Filtro_14: '/filter/helado14.svg',
        Filtro_15: '/filter/chocolate15.svg',
     }



        let valor = this.state.filterName
        try {
            await faceapi.loadFaceLandmarkModel(modelFolder);
            await faceapi.nets.ageGenderNet.loadFromUri(modelFolder);
            await faceapi.nets.faceExpressionNet.loadFromUri(modelFolder);
            if (this.props.selected_face_detector === this.props.SSD_MOBILENETV1) await faceapi.nets.ssdMobilenetv1.loadFromUri(modelFolder);
            if (this.props.selected_face_detector === this.props.TINY_FACE_DETECTOR) await faceapi.nets.tinyFaceDetector.load(modelFolder);

            this.state.imageFilter.src = (dirs[valor]);
            this.state.imageFilter.onload = function () {
                console.log("image is loaded");

            }
        } catch (exception) {
            console.log("exception", exception);
        }

    }
    setDetectorOptions() {
        let minConfidence = this.props.min_confidence,
            inputSize = this.props.input_size,
            scoreThreshold = this.props.score_threshold;

        // identificar el modelo previsamente entrenado para reconocer rostos.
        // el modelo por defecto es tiny_face_detector
        let options = this.props.selected_face_detector === this.props.SSD_MOBILENETV1
            ? new faceapi.SsdMobilenetv1Options({ minConfidence })
            : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
        this.props.SET_DETECTOR_OPTIONS_IN_GAME_FACENET(options);
    }

  
switchFilter(e){

    this.setState({ filterName: e.target.value, ejeX: 0, ejeYe:80 })

}
    render() {
        return (
            <div>
                <Camera />
                <Canva />

                <input type="number"
                    style={{ marginLeft: 1000 }}
                    value={this.state.positionIndex}
                    onChange={(event) => { this.setState({ positionIndex: event.target.value }) }} />

                <div className="scroll">
                    <button type="button" value='Filtro_1' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 20, ejeYe:-70, landStart:0, landEnd:16 }) }} ><img src={filtro1} width="20" height="20"></img>FILTRO 1</button>
                    <button type="button" value='Filtro_2' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 30, ejeYe:90, landStart:4, landEnd:8  }) }} ><img src={filtro2} width="20" height="20"></img>FILTRO 2</button>
                    <button type="button" value='Filtro_3' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 20, ejeYe:80, landStart:4, landEnd:13 }) }} ><img src={filtro3} width="20" height="20"></img>FILTRO 3</button>
                    <button type="button" value='Filtro_4' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 30, ejeYe:100, landStart:4, landEnd:13 }) }} ><img src={filtro4} width="20" height="20"></img>FILTRO 4</button>
                    <button type="button" value='Filtro_5' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 10, ejeYe:63, landStart:4, landEnd:63 }) }} ><img src={filtro5} width="20" height="20"></img>FILTRO 5</button>
                    <button type="button" value='Filtro_6' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 10, ejeYe:63, landStart:4, landEnd:63 }) }} ><img src={filtro6} width="20" height="20"></img>FILTRO 6</button>
                    <button type="button" value='Filtro_7' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 30, ejeYe:100, landStart:4, landEnd:13 }) }}><img src={filtro7} width="20" height="20"></img>FILTRO 7</button>
                    <button type="button" value='Filtro_8' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 10, ejeYe:63, landStart:4, landEnd:63 }) }}><img src={filtro8} width="20" height="20"></img>FILTRO 8</button>
                    <button type="button" value='Filtro_9' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 20, ejeYe:70, landStart:4, landEnd:60 }) }}><img src={filtro9} width="20" height="20"></img>FILTRO 9</button>
                    <button type="button" value='Filtro_10' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 40, ejeYe:90, landStart:4, landEnd:8 }) }}><img src={filtro10} width="20" height="20"></img>FILTRO 10</button>
                    <button type="button" value='Filtro_11' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 30, ejeYe:80, landStart:60, landEnd:13 }) }}><img src={filtro11} width="20" height="20"></img>FILTRO 11</button>
                    <button type="button" value='Filtro_12' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 20, ejeYe:90, landStart:6, landEnd:10 }) }}><img src={filtro12} width="20" height="20"></img>FILTRO 12</button>
                    <button type="button" value='Filtro_13' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 50, ejeYe:80, landStart:4, landEnd:60 }) }}><img src={filtro13} width="20" height="20"></img>FILTRO 13</button>
                    <button type="button" value='Filtro_14' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 40, ejeYe:90, landStart:7, landEnd:21 }) }}><img src={filtro14} width="20" height="20"></img>FILTRO 14</button>
                    <button type="button" value='Filtro_15' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 50, ejeYe:75, landStart:4, landEnd:60 }) }} ><img src={filtro15} width="20" height="20"></img>FILTRO 15</button>
                </div>

                <h1>{this.state.filterName}</h1>
                {/* <h1>{this.state.ejeX}</h1>
                <h1>{this.state.ejey}</h1> */}
        
                {/* <ScrollButton /> */}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacePage);
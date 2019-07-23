import {fract} from "../../comon/util";
import 'p5/lib/addons/p5.dom';
import React from 'react';
import ReactDOM from 'react-dom';
import './she.scss';
import {FControl} from "./components/FControl";
import {Graph} from "./graph";
import {Capture} from "./capture";

/**
 *
 * цвет фона
 * сохранение пресетов
 * новые пресеты (в т ч для х)
 * изменение шага для параметров
 * больше параметров для sq
 *
 * модуляция
 * морфинг
 * морфинг в пресет пока нажата кнопка, потом возвращение в начальное состояние (моментальное или морфинговое)
 * изменение размера
 */
const W = 240;
const H = 180;

export const she = fract(require('./she.html'), (props, root) => {

    const defF = x => x;
    const graph = new Graph({elementId: 'she-plot', w: W, h: H, f: defF});
    const capture = new Capture({canvasElId: 'she-canvas', videoElId: 'she-video', w: W, h: H});


    const handleUpdate = f => {
        graph.setData(f);
        capture.setF(f);
    };

    const init = ({slitMode, edgeMode, stackType}) => {
        capture.setEdgeMode(edgeMode);
        capture.setSlitMode(slitMode);
        capture.stack.setType(stackType);
    };

    ReactDOM.render(
        <FControl
            onInit={init}
            w={W}
            h={H}
            playing
            onVideoStop={capture.stop}
            onVideoStart={capture.start}

            onSlitModeChange={capture.setSlitMode}
            onEdgeModeChange={capture.setEdgeMode}
            onStackTypeChange={capture.stack.setType}
            onSave={capture.save}

            onUpdate={handleUpdate}/>, document.getElementById('formula'));

});
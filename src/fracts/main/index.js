import {fract} from "../../comon/util";
import 'p5/lib/addons/p5.dom';
import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import {Controls} from "./Controls";
import {Plot} from "./Plot";
import {Capture} from "./Capture";

export const main = fract(require('./main.html'), (props, root) => {

    const W = 240;
    const H = 180;

    const defF = x => x;
    const graph = new Plot({elementId: 'plot', w: W, h: H, f: defF});
    const capture = new Capture({canvasElId: 'canvas', videoElId: 'video', w: W, h: H});


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
        <Controls
            onInit={init}
            onSave={capture.save}
            onUpdate={handleUpdate}

            w={W}
            h={H}
            playing

            onVideoStop={capture.stop}
            onVideoStart={capture.start}

            onSlitModeChange={capture.setSlitMode}
            onEdgeModeChange={capture.setEdgeMode}
            onStackTypeChange={capture.stack.setType}

        />,
        document.getElementById('formula')
    );

});
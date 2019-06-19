import {byClassName, byId, fract, stylier} from "../../comon/util";
import * as P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import {get, PixelsStack, set} from "../../comon/pixels";
import * as vis from 'vis';
import React from 'react';
import ReactDOM from 'react-dom';
import './she.scss';


const W = 320;
const H = 240;

const Formulas = {
    xx: {
        text: 'x',
        f: () => x => x,
        scope: {}
    },
    yy: {
        text: 'y',
        f: () => (x, y) => y,
        scope: {}
    },
    sq: {
        text: 'sin(x / a) * cos(y / b) * c + f',
        f: ({a, b, c, h}) => (x, y) => (Math.sin(x / a) * Math.cos(y / b) * c + h),
        presets: {
            p1: {a: 3, b: 64, c: -77, h: 126},
            p2: {a: 11, b: 11, c: 140, h: 150},
            p3: {a: 14, b: 214, c: -135, h: 135},
            p4: {a: 54, b: 66, c: 159, h: 159},
        },
        scope: {
            a: {
                value: 25,
                min: 1,
                max: W
            },
            b: {
                value: 25,
                min: 1,
                max: H
            },
            c: {
                value: 50,
                min: -W,
                max: W
            },
            h: {
                value: 50,
                min: -H,
                max: H
            }
        }
    },
    sis2: {
        text: 'XA * sqrt((x - W / 2)^2 + (y - H / 2)^2)+ H + cosA * cos(sqrt((x * xN / xD - W / 2)^2 + (y * yN / yD - H / 2)^2)',
        f: ({cosA, h, xN, yN, xD, yD, XA, xdd, ydd}) => (x, y) =>
            XA * Math.sqrt(Math.pow(x - W / 2 + xdd, 2) + Math.pow(y - H / 2 + ydd, 2))
            + h
            + cosA * Math.cos(Math.sqrt(Math.pow(x * xN / xD - W / 2 + xdd, 2) + Math.pow(y * yN / yD - H / 2 + ydd, 2))),
        presets: {
            x8: {XA: -1.5, h: 111, cosA: 46, xN: 46, xD: 578, yN: 10, yD: 163, xdd: 0, ydd: 0},
            o: {XA: 8, h: -180, cosA: 0, xN: 0, xD: 1, yN: 0, yD: 1, xdd: 0, ydd: 0},
            p3: {XA: 0.9, h: 168, cosA: 131, xN: 266, xD: 1, yN: 329, yD: 100, xdd: -45, ydd: -1},
            c: {XA: 2.7, h: 149, cosA: 89, xN: 159, xD: 1, yN: 6, yD: 1, xdd: 0, ydd: 0},
            f: {XA: 2.1, h: 122, cosA: 79, xN: 1, xD: 1, yN: 21, yD: 1, xdd: 0, ydd: 22},
        },
        scope: {
            XA: {
                value: 1.6,
                min: -10,
                max: 10,
                step: 0.1
            },
            h: {
                value: 0,
                min: -W * 2,
                max: W * 2
            },
            cosA: {
                value: 0,
                min: 0,
                max: 200
            },
            xN: {
                value: 1,
                min: 0,
                max: W * 2
            },
            xD: {
                value: 1,
                min: 1,
                max: W * 2
            },
            yN: {
                value: 1,
                min: 0,
                max: W * 2
            },
            yD: {
                value: 1,
                min: 1,
                max: W * 2
            },
            xdd: {
                value: 0,
                min: -W * 2,
                max: W * 2
            },
            ydd: {
                value: 0,
                min: -H * 2,
                max: H * 2
            },
        }
    }
};

class Interface extends React.PureComponent {

    constructor(props) {
        super(props);

        const {formulas, value} = props;

        if (value) {
            this.state = {
                currentF: value,
                scope: formulas[value].scope
            };
            this.update();
        } else {
            this.state = {
                currentF: null,
                scope: {}
            };
        }
    }

    handleChangeScopeValue = e => {
        e.persist();
        const key = e.target.name;
        this.setState(state => ({
            scope: {
                ...state.scope,
                [key]: {
                    ...state.scope[key],
                    value: +e.target.value
                }
            }
        }), this.update);
    };
    handleIncScopeValue = key => e => {
        const scopeVar = this.state.scope[key];
        const newValue = scopeVar.value + (scopeVar.step || 1);
        if (newValue <= scopeVar.max)
            this.setState(state => ({
                scope: {
                    ...state.scope,
                    [key]: {
                        ...state.scope[key],
                        value: newValue
                    }
                }
            }), this.update);
    };
    handleDecScopeValue = key => e => {
        const scopeVar = this.state.scope[key];
        const newValue = scopeVar.value - (scopeVar.step || 1);
        if (newValue >= scopeVar.min)
            this.setState(state => ({
                scope: {
                    ...state.scope,
                    [key]: {
                        ...state.scope[key],
                        value: newValue
                    }
                }
            }), this.update);
    };


    update = () => {
        const {formulas} = this.props;
        const scope = Object.keys(this.state.scope).reduce((res, key) => ({
            ...res,
            [key]: this.state.scope[key].value
        }), {});
        this.props.onUpdate(formulas[this.state.currentF].f(scope));
    };

    handleChose = e => {
        const key = e.target.value;
        const {formulas} = this.props;
        const formula = formulas[key];
        this.setState({
            scope: formula.scope,
            currentF: key
        }, this.update);
    };

    handleVideoStop = () => {
        const {onVideoStop} = this.props;
        onVideoStop();
    };
    handleVideoStart = () => {
        const {onVideoStart} = this.props;
        onVideoStart();
    };

    handlePreset = preset => () =>
        this.setState(state => ({
            scope: Object.keys(preset).reduce((scope, key) => ({
                ...scope,
                [key]: {
                    ...scope[key],
                    value: preset[key]
                }
            }), state.scope)
        }), this.update);

    render() {
        const {formulas} = this.props;
        return (
            <div>
                <button onClick={this.handleVideoStop}>stop</button>
                <button onClick={this.handleVideoStart}>start</button>
                {/*<button onClick={this.update}>update</button>*/}
                <select
                    value={this.state.currentF}
                    onChange={this.handleChose}>
                    {Object.keys(formulas).map(key => (
                        <option key={key} value={key}>{formulas[key].text}</option>
                    ))}
                </select>
                <table>
                    <tbody>
                    {Object.keys(this.state.scope).map(key => (
                        <tr key={key} className={'she-scope-var'}>
                            <td className={'she-scope-var-key'}>{key}</td>
                            <td className={'she-scope-var-range'}>
                                <input
                                    type="range"
                                    name={key}
                                    value={this.state.scope[key].value}
                                    onChange={this.handleChangeScopeValue}
                                    step={this.state.scope[key].step || 1}
                                    min={this.state.scope[key].min}
                                    max={this.state.scope[key].max}/>
                                <button onClick={this.handleDecScopeValue(key)}>-</button>
                                <button onClick={this.handleIncScopeValue(key)}>+</button>
                            </td>
                            <td className={'she-scope-var-value'}>{this.state.scope[key].value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {Object.keys(formulas[this.state.currentF].presets || {}).map(presetKey => (
                    <button
                        key={presetKey}
                        onClick={this.handlePreset(formulas[this.state.currentF].presets[presetKey])}>{presetKey}</button>
                ))}
            </div>
        )
    }
}

class Graph {
    f;
    w;
    h;
    axisStep = 10;
    graph3d;

    static createDataByF = (w, h, f, step) => {
        let data = new vis.DataSet();
        if (!f) return data;
        for (let x = 0; x < w; x += step) {
            for (let y = 0; y < h; y += step) {
                const value = f(x, y);
                data.add({
                    x: x,
                    y: y,
                    z: value,
                    style: value
                });
            }
        }
        return data;
    };

    constructor(elementId, w, h, f) {

        this.w = w;
        this.h = h;

        const data = Graph.createDataByF(w, h, f, this.axisStep);

        const options = {
            width: W / 2 + 'px',
            height: H / 2 + 'px',
            style: 'surface',
            showPerspective: false,
            showGrid: true,
            showShadow: false,
            keepAspectRatio: true,
            verticalRatio: 0.5,
            xMax: w,
            xMin: 0,
            yMax: h,
            yMin: 0,
            zMax: w,
            zMin: 0,
            showXAxis: false,
            showYAxis: false,
            showZAxis: false,
        };
        const container = document.getElementById(elementId);

        this.graph3d = new vis.Graph3d(container, data, options);
    }

    setData = f => {
        const data = Graph.createDataByF(this.w, this.h, f, this.axisStep);
        this.graph3d.setData(data);
    }
}

class Capture {

    on;
    w;
    h;
    f;
    stack;
    capture;
    canvas;

    process = (pixelsStack, zf) => {
        let pixels = new Array(this.w * this.h * 4);
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                set(pixels, this.w, 4, x, y, get(pixelsStack[Math.round(zf(x, y, pixelsStack.length))], this.w, 4, x, y))
            }
        }
        return pixels;
    };

    constructor(canvasElId, videoElId, w, h, rate, f) {

        this.w = w;
        this.h = h;

        this.f = f || (x => x);
        this.stack = new PixelsStack(w);

        new P5(sketch => {
            let fps;
            sketch.setup = () => {
                sketch.pixelDensity(1);
                this.canvas = sketch.createCanvas(w, h);
                this.canvas.parent(canvasElId);
                this.capture = sketch.createCapture({
                    video: {
                        pixelDensity: 1,
                        mandatory: {
                            minWidth: w,
                            minHeight: h
                        },
                        optional: [{
                            maxFrameRate: rate
                        }]
                    },
                    audio: false
                });
                this.on = true;
                this.capture.parent(videoElId);
                this.capture.size(w / 2, h / 2);

                fps = sketch.frameRate();
                sketch.fill('red');
                sketch.stroke(0);
            };

            sketch.draw = () => {

                if (!this.on) return;

                //загрузка исходного изображения с камеры на канвас
                sketch.image(this.capture, 0, 0, w, h);
                sketch.loadPixels();

                //положили в кубический кадр изображение с канваса
                this.stack.push([...sketch.pixels]);

                //изменение пикселей на канвасе

                // const newPixels = this.process(this.stack.array, this.f);
                //  for (let i = 0; i < sketch.pixels.length; i++)
                //      sketch.pixels[i] = newPixels[i];

                const pixelsStack = this.stack.array;

                for (let x = 0; x < this.w; x++) {
                    for (let y = 0; y < this.h; y++) {
                        set(sketch.pixels, this.w, 4, x, y, get(pixelsStack[Math.round(this.f(x, y, pixelsStack.length))], this.w, 4, x, y))
                    }
                }

                // for (let x = 0; x < this.w; x++) {
                //     for (let y = 0; y < this.h; y++) {
                //         const p = get(this.stack[Math.round(this.f(x, y, this.stack.length))], this.w, 4, x, y);
                //         set(sketch.pixels, this.w, 4, x, y, p);
                //     }
                // }


                //применение изменений
                sketch.updatePixels();


                //console.log(sketch.frameRate());
            }
        });
    }

    setF = f => {
        this.f = f;
    };

    stop = () => {
        this.on = false;
        this.capture.stop();
    };
    start = () => {
        this.on = true;
        this.capture.loop()
    };
}

export const she = fract(require('./she.html'), (props, root) => {

    const defF = x => x;
    const graph = new Graph('she-plot', W, H, defF);
    const capture = new Capture('she-canvas', 'she-video', W, H, 60);


    const handleUpdate = f => {
        graph.setData(f);
        capture.setF(f);
    };

    const handleVideoStop = () => capture.stop();
    const handleVideoStart = () => capture.start();

    ReactDOM.render(
        <Interface
            playing
            onVideoStop={handleVideoStop}
            onVideoStart={handleVideoStart}
            value={'xx'}

            onUpdate={handleUpdate}
            formulas={Formulas}/>, document.getElementById('formula'));

});
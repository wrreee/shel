import {get, PixelsStack, set} from "./PixelsStack";
import * as P5 from "p5";
import {EdgeMode, SlitMode} from "../Controls/const";
import {throttled} from "../../../comon/util";
import {dateZs} from "../Controls/utils";

export class Capture {

    on;
    w;
    h;
    f;
    stack;
    capture;
    canvas;
    sketch;

    GetFrameN = {
        [EdgeMode.no]: (x, y, length) => Math.round(this.f(x, y, length)),
        [EdgeMode.top]: (x, y, length) => {
            let frameN = Math.round(this.f(x, y, length));
            if (frameN >= length) frameN = length - 1;
            return frameN;
        },
        [EdgeMode.bot]: (x, y, length) => {
            let frameN = Math.round(this.f(x, y, length));
            if (frameN < 0) frameN = 0;
            return frameN;
        },
        [EdgeMode.all]: (x, y, length) => {
            let frameN = Math.round(this.f(x, y, length));
            if (frameN >= length) frameN = length - 1;
            if (frameN < 0) frameN = 0;
            return frameN;
        },
    };

    GetPixel = {
        [SlitMode.Side]: (pixelsStack, x, y, frameN) =>
            get(pixelsStack[x], this.w, 4, frameN, y),
        [SlitMode.Front]: (pixelsStack, x, y, frameN) =>
            get(pixelsStack[frameN], this.w, 4, x, y)
    };


    slitMode = SlitMode.Side;
    getPixel = this.GetPixel[this.slitMode];

    edgeMode = EdgeMode.no;
    getFrameN = this.GetFrameN[this.edgeMode];


    constructor(props) {
        const {canvasElId, videoElId, w, h, f} = props;

        this.w = w;
        this.h = h;

        this.f = f || (x => x);
        this.stack = new PixelsStack(w);

        new P5(sketch => {
            this.sketch = sketch;
            this.capture = sketch.createCapture({
                video: {
                    mandatory: {
                        minWidth: w,
                        minHeight: h
                    },
                    optional: [{
                        maxFrameRate: 30
                    }]
                },
                audio: false
            });

            this.capture.parent(videoElId);
            this.capture.size(w, h);

            sketch.setup = () => {
                sketch.pixelDensity(1);
                this.canvas = sketch.createCanvas(w, h);
                this.canvas.parent(canvasElId);
                this.capture = sketch.createCapture({
                    video: {
                        mandatory: {
                            minWidth: w,
                            minHeight: h
                        },
                        optional: [{
                            maxFrameRate: 30
                        }]
                    },
                    audio: false
                });
                this.on = true;
                this.capture.parent(videoElId);
                this.capture.size(w, h);

                sketch.frameRate(30);
            };


            sketch.draw = () => {

                let time = performance.now();

                sketch.loadPixels();

                this.capture.loadPixels();

                this.stack.push(this.capture.pixels);

                let pixelsStack = this.stack.array;

                for (let x = 0; x < this.w; x++) {
                    for (let y = 0; y < this.h; y++) {
                        const frameN = this.getFrameN(x, y, pixelsStack.length);
                        set(
                            sketch.pixels,
                            this.w,
                            4, x, y,
                            this.getPixel(pixelsStack, x, y, frameN)
                        )
                    }
                }

                pixelsStack = null;

                sketch.updatePixels();
            }
        });
    }

    setSlitMode = mode => {
        this.slitMode = mode;
        this.getPixel = this.GetPixel[this.slitMode];

        !this.on && this.redraw();
    };

    setEdgeMode = mode => {
        this.edgeMode = mode;
        this.getFrameN = this.GetFrameN[this.edgeMode];

        !this.on && this.redraw();
    };

    redraw = throttled(60, () => this.sketch.redraw());

    setF = f => {
        this.f = f;

        !this.on && this.redraw();
    };

    stop = () => {
        this.on = false;

        this.sketch.noLoop();
        this.capture.stop();
    };
    start = () => {
        this.on = true;
        this.sketch.loop();
        this.capture.loop()
    };


    save = () => {
        this.sketch.save(this.canvas, dateZs());
    };
}
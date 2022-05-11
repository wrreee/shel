import * as vis from "vis";

export class Plot {
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
                    z: h - value,
                });
            }
        }
        return data;
    };

    constructor(props) {

        const {elementId, w, h, f} = props;

        this.w = w;
        this.h = h;

        const data = Plot.createDataByF(w, h, f, this.axisStep);

        const options = {
            width: w / 2 + 'px',
            height: h / 2 + 'px',
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
        const data = Plot.createDataByF(this.w, this.h, f, this.axisStep);
        this.graph3d.setData(data);
    }
}
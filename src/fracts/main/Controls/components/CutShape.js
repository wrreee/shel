import React from "react";
import {Canvas} from "./Canvas";

const fByPoints = (x1, y1, x2, y2) => {
    const k = (y1 - y2) / (x1 - x2);
    const b = y2 - k * x2;

    return x => k * x + b;
};

export class CutShape extends React.PureComponent {

    componentDidMount() {
        const {scope} = this.props;
        const {value} = scope;
        const img = this.refs.canvas.getImageData();

        for (let i = 0; i < img.data.length; i += 4) {

            var x = (i / 4) % img.width;
            var y = Math.floor((i / 4) / img.width);
            if (value[x] > y) {
                img.data[i] = 230;
                img.data[i + 1] = 230;
                img.data[i + 2] = 230;
                img.data[i + 3] = 255;
            } else {
                img.data[i] = 0;
                img.data[i + 1] = 0;
                img.data[i + 2] = 0;
                img.data[i + 3] = 255;
            }
        }

        this.refs.canvas.setImageData(img);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.scope.value !== this.props.scope.value) {

            const {scope} = nextProps;
            const {value} = scope;
            const img = this.refs.canvas.getImageData();

            for (let i = 0; i < img.data.length; i += 4) {

                var x = (i / 4) % img.width;
                var y = Math.floor((i / 4) / img.width);
                if (value[x] > y) {
                    img.data[i] = 230;
                    img.data[i + 1] = 230;
                    img.data[i + 2] = 230;
                    img.data[i + 3] = 255;
                } else {
                    img.data[i] = 0;
                    img.data[i + 1] = 0;
                    img.data[i + 2] = 0;
                    img.data[i + 3] = 255;
                }

            }

            this.refs.canvas.setImageData(img);
        }
    }

    clickProcessing = (e, ctx, canvas, prevE) => {
        const x = e.offsetX, y = e.offsetY;
        const {scope, onChange, name, h} = this.props;
        const {value} = scope;
        const newValue = [...value];
        newValue[x] = y;
        onChange(name, newValue);
    };
    drawProcessing = (e, ctx, canvas, prevE) => {
        if (!prevE) return;
        const x = e.offsetX, y = e.offsetY;
        const x0 = prevE.offsetX, y0 = prevE.offsetY;
        const {scope, onChange, name, h} = this.props;
        const {value} = scope;
        const newValue = [...value];


        const f = fByPoints(x, y, x0, y0);
        for (let i = Math.min(x0, x); i < Math.max(x0, x); i++) {
            newValue[i] = Math.round(f(i));
        }
        onChange(name, newValue);
    };

    render() {
        const {w, h} = this.props;
        return (
            <div>
                <Canvas
                    ref={"canvas"}
                    onClick={this.clickProcessing}
                    onDraw={this.drawProcessing}
                    width={w}
                    height={h}/>
            </div>
        );
    }

}
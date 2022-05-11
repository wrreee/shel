import React from 'react';
import resizeImageData from "resize-image-data";


// v1
export class Canvas extends React.Component {


    state = {
        drawing: false
    };

    canvas;
    ctx;

    prevE;

    mouseDownHandler = e => {
        this.setState({drawing: true});

        const {onDraw, onClick} = this.props;

        onDraw && onDraw(e, this.ctx, this.canvas);
        onClick && onClick(e, this.ctx, this.canvas);
    };

    mouseUpHandler = e => {
        if (this.state.drawing) {
            this.setState({drawing: false});

            this.prevE = null;
            const {onChange, onUp, width, height} = this.props;
            const imd = this.ctx.getImageData(0, 0, width, height);
            onChange && onChange(imd);
            onUp && onUp(imd);
        }
    };

    mouseLeaveHandler = e => {
        // if (this.state.drawing)
        //     this.mouseUpHandler();

        if (this.state.drawing) {
            const {onDraw} = this.props;

            onDraw && onDraw(e, this.ctx, this.canvas, this.prevE);
            this.prevE = e;
        }
    };

    mouseMoveHandler = e => {
        if (this.state.drawing) {
            const {onDraw} = this.props;

            onDraw && onDraw(e, this.ctx, this.canvas, this.prevE);
            this.prevE = e;
        }
    };

    componentDidMount() {
        this.canvas = this.refs.canvas;
        this.ctx = this.canvas.getContext("2d");


        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        document.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("mouseleave", this.mouseLeaveHandler);


        if (this.props.value) {
            this.ctx.putImageData(this.props.value, 0, 0);
        }

        // this.clear();
        // const {onChange, width, height} = this.props;
        // onChange && onChange(this.ctx.getImageData(0, 0, width, height));
    }


    componentWillReceiveProps(nextProps) {
        if ((nextProps.width !== this.props.width || nextProps.height !== this.props.height)) {
            const {onChange, width, height, resize} = this.props;
            let imageData = this.ctx.getImageData(0, 0, width, height);
            resize && (imageData = resizeImageData(imageData, nextProps.width, nextProps.height, resize));
            setTimeout(() => onChange && onChange(imageData), 0);
        }
        if (this.props.value !== nextProps.value) {
            if (!nextProps.value) {
                this.clear();
                const {onChange, width, height} = this.props;
                onChange && onChange(this.ctx.getImageData(0, 0, width, height));
            } else {
                this.ctx.putImageData(nextProps.value, 0, 0);
            }
        }
    }

    setImageData = image =>
        this.ctx.putImageData(image, 0, 0);

    drawImage = (...p) =>
        this.ctx.drawImage(...p);
    getCtx = () =>
        this.ctx;

    getImageData = () =>
        this.ctx.getImageData(0, 0, this.props.width, this.props.height);

    clear = () => {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.props.width, this.props.height);
    };

    render() {
        const {width, height, readonly} = this.props;
        return (
            <div className={"canvas" + (readonly ? " readonlyCanvas" : "")}>
                <canvas ref="canvas" width={width > 0 ? width : 1} height={height > 0 ? height : 1}/>
            </div>
        )
    }
}
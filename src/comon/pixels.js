export const StackType = {
    Right: "right",
    Left: "left",
    FromCenter: "fromcenter",
    ToCenter: "tocenter",
};

export class PixelsStack {

    array;
    type;

    constructor(size, type) {
        this.array = new Array(size);
        this.type = type || StackType.Right;
    }

    setType = type => this.type = type;

    push(newEl) {
        switch (this.type) {
            case StackType.Right:
                this.array.shift();
                this.array.push(newEl);
                break;
            case StackType.Left:
                this.array.pop();
                this.array.unshift(newEl);
                break;
            case StackType.FromCenter:
                this.array.pop();
                this.array.shift();
                this.array = [...this.array.slice(0, this.array.length / 2), newEl, newEl, ...this.array.slice(this.array.length / 2, this.array.length)]
                break;
            case StackType.ToCenter:
                this.array.push(newEl);
                this.array.unshift(newEl);
                this.array = [...this.array.slice(0, this.array.length / 2 - 1), ...this.array.slice(this.array.length / 2 + 1, this.array.length)]
                break;
            default:
                this.array.shift();
                this.array.push(newEl);
                break;
        }
    }
}


export const get = (pixels, width, d, x, y) => {
    return pixels ? [
        pixels[(x + y * width) * d],
        pixels[(x + y * width) * d + 1],
        pixels[(x + y * width) * d + 2],
        pixels[(x + y * width) * d + 3]
    ] : [0, 0, 0, 255];
};


export const set = (pixels, width, d, x, y, value) => {
    pixels[(x + y * width) * d] = value[0];
    pixels[(x + y * width) * d + 1] = value[1];
    pixels[(x + y * width) * d + 2] = value[2];
    pixels[(x + y * width) * d + 3] = value[3];
    return pixels;
};

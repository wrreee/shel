

export class PixelsStack {

    constructor(size) {
        this.array = new Array(size);
    }

    push(newEl) {
        const newArray = this.array.slice(1);
        newArray.push(newEl);
        this.array = newArray;
    }
}


export const get = (pixels, width, d, x, y) => {
    let pixel = new Array(d);
    if (!pixels)
        return [0, 0, 0, 255];
    for (let i = 0; i < d; i++)
        pixel[i] = pixels[(x + y * width) * d + i]
    return pixel
};


export const set = (pixels, width, d, x, y, value) => {
    for (let i = 0; i < d; i++)
        pixels[(x + y * width) * d + i] = value[i]
    return pixels;
};

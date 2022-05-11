export function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

export const randomZ = () => {
    const size0 = randomInteger(4, 11);

    let s = "";
    for (let i = 0; i < size0; i++) {
        const ff = randomInteger(1, 20) > 10;
        s += ff ? "Z" : "z"
    }

    return s;

};
const quadNumberFormat =
    (arr) =>
        (string, offset) => string
            .split(((0 + offset) % 4).toString()).join(arr[0])
            .split(((1 + offset) % 4).toString()).join(arr[1])
            .split(((2 + offset) % 4).toString()).join(arr[2])
            .split(((3 + offset) % 4).toString()).join(arr[3]);
// let offset = 0;
export const dateZs = () => {

    const date = new Date();

    let f = '32_9';
    //
    // if (date.getDay() === 4) {
    //     f = 'szSZ';
    // } else if (date.getDay() === 3) {
    //     f = 'rs2d';
    // } else {
    //     f = 'szSZ';
    // }

    // offset = (offset + 1) % 4;

    return quadNumberFormat(f)(date.getTime().toString(4), 0);

};
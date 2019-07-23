export const LS_FIELD = "state";

export const SlitMode = {
    Front: "front",
    Side: "side",
};

export const EdgeMode = {
    no: "00",
    top: "01",
    bot: "10",
    all: "11",
};

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
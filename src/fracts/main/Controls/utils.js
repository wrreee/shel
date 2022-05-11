const quadNumberFormat =
    (arr) =>
        (string, offset) => string
            .split(((0 + offset) % 4).toString()).join(arr[0])
            .split(((1 + offset) % 4).toString()).join(arr[1])
            .split(((2 + offset) % 4).toString()).join(arr[2])
            .split(((3 + offset) % 4).toString()).join(arr[3]);

export const getDateString = () => {

    const date = new Date();

    return quadNumberFormat(
        '32_9'
    )(
        date.getTime().toString(4),
        0
    );

};
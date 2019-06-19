export const renderDOM = element => text => {
    try {
        element.innerHTML = text;
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const fract = (html, game) =>
    (element, props) => renderDOM(element)(html) && game(props, element);

export const byClassName = (elem = document) => (name, first) =>
    first ? elem.getElementsByClassName(name)[0] : elem.getElementsByClassName(name);
export const byId = id => document.getElementById(id);


export const simpleHover = element => (...animation) => {
    let animationIn;
    element.addEventListener('mouseover', () => {
        animationIn = element.animate(...animation);
    });
    element.addEventListener('mouseout', () => {
        animationIn && animationIn.reverse();
    });
};


export const stylier = elem => styles => Object.assign(elem.style, styles);

export const addClass = element => name => {
    const arr = element.className.split(" ");
    arr.indexOf(name) === -1 && (element.className += " " + name);
};
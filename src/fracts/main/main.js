import {byClassName, byId, fract, stylier} from "../../comon/util";

export const main = fract(require('./main.html'), (props, root) => {
    const container = byId('bajan');
    const elems = byClassName(container)('br', true).getElementsByTagName('div');
    stylier(container)({height: 100 * elems.length + 'vh'});


    console.log(window.innerHeight, window.innerHeight * 4);
    document.addEventListener('scroll', (e) => {
        // console.log(window.scrollY);

        const curE = Math.trunc(window.scrollY / window.innerHeight);

        console.log(curE);

        for (let i = 0; i < elems.length; i++) {
            if (i < curE) {
                stylier(elems[i])({width: 0, left: 0});
            } else if (i === curE) {
                stylier(elems[i])({width: '50%', left: 0});
            } else {
                stylier(elems[i])({
                    width: 50 * Math.pow(.5, i - curE) + '%',
                    left: 100 - 50 * Math.pow(.5, i - curE) * 2 + '%'
                });
            }
        }
    });
});
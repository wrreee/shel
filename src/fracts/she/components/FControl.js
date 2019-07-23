import React from "react";
import _omit from "lodash/omit";
import {Select} from "./Select";
import {EdgeMode, LS_FIELD, SlitMode} from "./const";
import {Formulas, ParamTypeComponent} from "../formulas";
import {throttled} from "../utils";
import {GlobalHotKeys} from "react-hotkeys";
import {StackType} from "../../../comon/pixels";

export class FControl extends React.PureComponent {

    formulas;

    constructor(props) {
        super(props);

        const {onInit, w, h} = props;

        this.formulas = Formulas(w, h);

        const cF = Object.keys(this.formulas)[0];

        const stateFromLs = this.loadFromLs();


        // this.state = stateFromLs || {
        this.state =  {
            hotKeys: {},
            handlers: {},
            keys: {},
            cF: cF,
            scope: this.formulas[cF].scope,
            slitMode: SlitMode.Side,
            edgeMode: EdgeMode.no,
            stackType: StackType.Right
        };

        this.update();
        onInit && onInit(this.state);
    }

    saveToLs = () => {
        localStorage.setItem(LS_FIELD, JSON.stringify(this.state));
    };

    loadFromLs = () => {
        const s = localStorage.getItem(LS_FIELD);
        return s && JSON.parse(s);
    };

    handleSlitModeChange = slitMode => this.setState({slitMode}, () => {
        const {onSlitModeChange} = this.props;
        onSlitModeChange && onSlitModeChange(this.state.slitMode);
    });
    handleEdgeModeChange = edgeMode => this.setState({edgeMode}, () => {
        const {onEdgeModeChange} = this.props;
        onEdgeModeChange && onEdgeModeChange(this.state.edgeMode);
    });
    handleStackTypeChange = stackType => this.setState({stackType}, () => {
        const {onStackTypeChange} = this.props;
        onStackTypeChange && onStackTypeChange(this.state.stackType);
    });


    createMouseHandler = key => {
        let startE = null;
        let startValue = this.state.scope[key].value;
        //console.log(window.innerWidth);
        return throttled(30, e => {
            if (!startE) {
                startE = e;
                return;
            }

            const scope = this.state.scope[key];

            let value = startValue + (e.x - startE.x) * (scope.step || 1);
            if (value > scope.max) value = scope.max;
            if (value < scope.min) value = scope.min;

            // console.log(value, startValue);

            this.setState(state => ({
                scope: {
                    ...state.scope,
                    [key]: {
                        ...state.scope[key],
                        value: value
                    }
                }
            }), this.update);

            //console.log(key, e.x - startE.x);
        })
    };

    keydownHandler = e => {
        const code = e.key.charCodeAt(0);
        //console.log(e.key, e.key.charCodeAt(0), e.keyCode);

        if (!this.state.keys[code]) {
            //const handler = this.createMouseHandler(code);
            //document.addEventListener("mousemove", handler);

            //console.log(this.state.hotKeys, code);
            const handledKeys = Object.keys(this.state.hotKeys).filter(key => this.state.hotKeys[key] === code);
            //console.log(handledKeys);
            handledKeys.forEach(key => {
                const handler = this.createMouseHandler(key);
                document.addEventListener("mousemove", handler);
                this.setState(state => ({handlers: {...state.handlers, [key]: handler}}));
            });
            this.setState(state => ({keys: {...state.keys, [code]: true}}));
        }
    };

    keyupHandler = (e) => {
        const code = e.key.charCodeAt(0);
        //console.log(e.keyCode);
        // const handler = this.state.keys[code];
        // document.removeEventListener("mousemove", handler);

        const handledKeys = Object.keys(this.state.hotKeys).filter(key => this.state.hotKeys[key] === code);
        handledKeys.forEach(this.removeHandler);

        this.setState(state => ({keys: _omit(state.keys, code)}));
    };

    removeHandler = key => {
        document.removeEventListener("mousemove", this.state.handlers[key]);
        this.setState(state => ({handlers: _omit(state.handlers, key)}));
    };

    componentDidMount() {
        document.addEventListener("keydown", this.keydownHandler);
        document.addEventListener("keyup", this.keyupHandler);
    }

    handleChangeHotKeyValue = key => e => {

        const code = e.key.charCodeAt(0);

        if (code === 120) return this.setState(state => ({
            hotKeys: _omit(state.hotKeys, key)
        }), () =>
            this.removeHandler(key));

        if ([97, 115, 100, 113, 119, 101].indexOf(code) === -1) return;

        this.setState(state => ({
            hotKeys: {
                ...state.hotKeys,
                [key]: code
            }
        }));
    };

    handleChangeScopeValue = e => {
        e.persist();
        const key = e.target.name;
        let value = +e.target.value;
        if (value > this.state.scope[key].max) value = this.state.scope[key].max;
        if (value < this.state.scope[key].min) value = this.state.scope[key].min;
        this.setState(state => ({
            scope: {
                ...state.scope,
                [key]: {
                    ...state.scope[key],
                    value
                }
            }
        }), this.update);
    };
    handleChangeScopeValueCustom = (name, value) =>
        this.setState(state => ({
            scope: {
                ...state.scope,
                [name]: {
                    ...state.scope[name],
                    value
                }
            }
        }), this.update);

    handleIncScopeValue = key => e => {
        const scopeVar = this.state.scope[key];
        const newValue = scopeVar.value + (scopeVar.step || 1);
        if (newValue <= scopeVar.max)
            this.setState(state => ({
                scope: {
                    ...state.scope,
                    [key]: {
                        ...state.scope[key],
                        value: newValue
                    }
                }
            }), this.update);
    };
    handleDecScopeValue = key => e => {
        const scopeVar = this.state.scope[key];
        const newValue = scopeVar.value - (scopeVar.step || 1);
        if (newValue >= scopeVar.min)
            this.setState(state => ({
                scope: {
                    ...state.scope,
                    [key]: {
                        ...state.scope[key],
                        value: newValue
                    }
                }
            }), this.update);
    };


    update = () => {
        const scope = Object.keys(this.state.scope).reduce((res, key) => {
            res[key] = this.state.scope[key].value;
            return res;
        }, {});
        this.props.onUpdate(this.formulas[this.state.cF].f(scope));
    };

    handleChose = e => {
        const key = e.target.value;
        const formula = this.formulas[key];
        this.setState({
            scope: formula.scope,
            cF: key
        }, this.update);
    };

    handleVideoStop = () => {
        const {onVideoStop} = this.props;
        onVideoStop();
    };
    handleVideoStart = () => {
        const {onVideoStart} = this.props;
        onVideoStart();
    };

    handlePreset = preset => () =>
        this.setState(state => ({
            scope: Object.keys(preset).reduce((scope, key) => ({
                ...scope,
                [key]: {
                    ...scope[key],
                    value: preset[key]
                }
            }), state.scope)
        }), this.update);

    keyMap = {
        START: "1",
        STOP: "2",

    };

    hotKeysHandlers = {
        START: this.handleVideoStart,
        STOP: this.handleVideoStop,
    };

    render() {
        const {w, h, onSave} = this.props;
        return (
            <div>

                <GlobalHotKeys keyMap={this.keyMap} handlers={this.hotKeysHandlers}/>
                <button onClick={this.handleVideoStart}>start</button>
                <button onClick={this.handleVideoStop}>stop</button>
                <button onClick={onSave}>save image</button>
                <Select
                    onChange={this.handleSlitModeChange}
                    value={this.state.slitMode}
                    items={Object.values(SlitMode)}/>
                <Select
                    onChange={this.handleEdgeModeChange}
                    value={this.state.edgeMode}
                    items={Object.values(EdgeMode)}/>
                <Select
                    onChange={this.handleStackTypeChange}
                    value={this.state.stackType}
                    items={Object.values(StackType)}/>
                <select
                    value={this.state.cF}
                    onChange={this.handleChose}>
                    {Object.keys(this.formulas).map(key => (
                        <option key={key} value={key}>{this.formulas[key].text}</option>
                    ))}
                </select>
                <table>
                    <tbody>
                    {Object.keys(this.state.scope).map(key => {
                        const Component = ParamTypeComponent[this.state.scope[key].type];
                        return Component ? (
                            <tr key={key} className={'she-scope-var'}>
                                <td colSpan="6">
                                    <Component
                                        w={w}
                                        h={h}
                                        name={key}
                                        scope={this.state.scope[key]}
                                        onChange={this.handleChangeScopeValueCustom}/>
                                </td>
                            </tr>
                        ) : (
                            <tr key={key} className={'she-scope-var'}>
                                <td className={'she-scope-var-key'}>{key}</td>
                                <td className={'she-scope-var-range'}>
                                    <input
                                        type="range"
                                        name={key}
                                        value={this.state.scope[key].value}
                                        onChange={this.handleChangeScopeValue}
                                        step={this.state.scope[key].step || 1}
                                        min={this.state.scope[key].min}
                                        max={this.state.scope[key].max}/>

                                    <button onClick={this.handleDecScopeValue(key)}>-</button>
                                    <button onClick={this.handleIncScopeValue(key)}>+</button>
                                </td>
                                <td className={'she-scope-var-hotkey'}>
                                    <input
                                        type="text"
                                        value={String.fromCharCode(this.state.hotKeys[key])}
                                        onKeyDown={this.handleChangeHotKeyValue(key)}/>
                                </td>
                                <td className={'she-scope-var-value'}>{this.state.scope[key].value}</td>
                                <td className={'she-scope-var-value'}>[{this.state.scope[key].min};</td>
                                <td className={'she-scope-var-value'}>{this.state.scope[key].max}]</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {Object.keys(this.formulas[this.state.cF].presets || {}).map(presetKey => (
                    <button
                        key={presetKey}
                        onClick={this.handlePreset(this.formulas[this.state.cF].presets[presetKey])}>{presetKey}</button>
                ))}
                <br/>
                {/*<button onClick={this.saveToLs}>save state</button>*/}
            </div>
        )
    }
}

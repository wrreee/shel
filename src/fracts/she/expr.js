import React from "react";
import {parse} from "mathjs/src/entry/impureFunctionsAny.generated";

class Formula extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            newScopeVar: '',
            formula: '',
            scope: {}
        };
    }

    handleChangeFormula = (e) => {

        const formula = e.target.value;


        try {
            const node = parse(formula);
            const code = node.compile();

            console.log(node, code);
            const result = code.evaluate(this.state.scope);

            console.log(result);
        } catch (e) {

        }

        this.setState({formula})
    };


    handleChangeScopeValue = e => {
        e.persist();
        this.setState(state => ({scope: {...state.scope, [e.target.name]: e.target.value}}));
    };

    handleChangeNewScopeVarName = e => {
        e.persist();
        const newScopeVar = e.target.value;
        if (/^[a-z]+$/.test(newScopeVar) || newScopeVar.length === 0)
            this.setState({newScopeVar})
    };

    handleDeleteScopeValue = key => e => {
        e.persist();
        const {[key]: deleted, ...scope} = this.state.scope;
        this.setState({scope});

    }; 

    handleAddScopeValue = e => {
        this.setState(state => ({
            scope: {...state.scope, [state.newScopeVar]: 0},
            newScopeVar: ''
        }))
    };

    handleUpdateClick = () => {
        const code = parse(this.state.formula).compile();
        const f = (x, y) => code.evaluate({x, y, ...this.state.scope});
        this.props.onUpdate(f);
    };

    render() {
        return (
            <div>
                <button onClick={this.handleUpdateClick}>update</button>
                <input
                    value={this.state.formula}
                    onChange={this.handleChangeFormula}/>
                <div>
                    {Object.keys(this.state.scope).map(key => (
                        <div key={key}>
                            <div>{key}</div>
                            <div>{this.state.scope[key]}</div>
                            <input type="range"
                                   name={key}
                                   value={this.state.scope[key]}
                                   onChange={this.handleChangeScopeValue}
                                   min="0" max="100"/>

                            <button onClick={this.handleDeleteScopeValue(key)}>-</button>
                        </div>
                    ))}
                    <input
                        value={this.state.newScopeVar}
                        onChange={this.handleChangeNewScopeVarName}/>
                    <button onClick={this.handleAddScopeValue}
                            disabled={
                                !this.state.newScopeVar ||
                                Object.keys(this.state.scope).indexOf(this.state.newScopeVar) !== -1}>+
                    </button>
                </div>
            </div>
        )
    }
}
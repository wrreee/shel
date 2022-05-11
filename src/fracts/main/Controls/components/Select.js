import React from "react";

export class Select extends React.PureComponent {
    handleChose = value => e => {

        const {onChange} = this.props;
        onChange && onChange(value);
    };

    render() {
        const {value, items} = this.props;
        return (
            <div>
                {items.map(item => (
                    <button
                        className={"buttonControle"}
                        key={item}
                        onClick={this.handleChose(item)}
                    >
                        {item + (item === value ? "*" : "")}
                    </button>
                ))}
            </div>
        );
    }

}
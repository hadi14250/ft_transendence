import { Component } from '../../modules/onion/index.js';

export default class BaseButton extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.props = {
            buttonStylePath: "/styles/BaseButton.css",
            buttonClass: "base-button",
            isDisabled: false,
            isLoading: false
        }
    }

    render()
    {
        let buttonChildNode = this.props.isLoading ?
            String.raw`
                <span style="margin:2.5px;" class="d-flex spinner-border spinner-border-medium" role="status" aria-hidden="true"></span>
            `
            : this.props.text;
        return String.raw`
            <link rel="stylesheet" href="${this.props.buttonStylePath}">
            <button class="${this.props.buttonClass}" style="${this.props.style}" ${this.props.isDisabled ? "disabled" : ""} onClick="${this.props.onClick.name}">${buttonChildNode}</button>
        `;
    }
}
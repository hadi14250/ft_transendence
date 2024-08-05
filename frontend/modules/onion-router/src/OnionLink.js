import Onion, { Component } from "../../onion/index.js";

export default class Link extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.props = {
            style: ""
        };
    }

    handleClick(event)
    {
        event.preventDefault();
        this.context.navigate(this.props.to);
    }

    render()
    {
        return String.raw`
            <a style="${this.props.style}" href="${this.props.to}" onClick="${this.handleClick.name}">
                ${Onion.Children.combine(this.props.children)}
            </a>
        `;
    }
}
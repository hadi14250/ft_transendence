import Onion, { Component } from "../../onion/index.js";

export default class Routes extends Component
{
    renderChild(location)
    {
        if (!location)
            return "";

        let element, match;

        Onion.Children.forEach(this.props.children, (child) => {
            if (!match && Onion.isValidElement(child))
            {
                const path = child.getAttribute('path');
                const exact = child.getAttribute('exact') !== null;
                match = exact ? location === path : location.startsWith(path);
                if (match)
                    element = child;
            }
        });
        if (!element)
            return "";

        return element.outerHTML;
    }

    render()
    {
        return String.raw`
            ${this.renderChild(this.context.location)}
        `;
    }
}
import Onion, { Component } from "../../onion/index.js";

export default class Route extends Component
{
    renderComponent(location, partialProps)
    {
        const { path, component } = this.props;
        const exact = !!(this.props.exact != undefined && this.props.exact != null);
        const match = exact ? location === path : location.startsWith(path);

        if (match)
        {
            const passedProps = Onion.propsToObject(this.props.componentProps);
            const mergedProps = Object.assign({}, passedProps || {}, partialProps || {});
            const newProps = Onion.objectToProps(mergedProps);

            return String.raw`<div className="${component}" ${newProps}></div>`;
        }
        return "";
    }

    render()
    {
        return String.raw`
            ${this.renderComponent(this.context.location, this.context.props)}
        `;
    }
}
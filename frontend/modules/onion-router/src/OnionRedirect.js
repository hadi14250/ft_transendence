import { Component } from "../../onion/index.js";

export default class Redirect extends Component
{
    onMount()
    {
        this.context.navigate(this.props.to);
    }

    render()
    {
        return null;
    }
}
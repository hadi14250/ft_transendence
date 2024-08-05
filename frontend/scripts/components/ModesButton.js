import { Component } from '../../modules/onion/index.js';

export default class ModesButton extends Component
{
    render()
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/ModesButton.css">
            <div class="modes-button" onClick="${this.props.onClick.name}">${this.props.text}</div>
        `;
    }
}
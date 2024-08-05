import { Component } from '../../modules/onion/index.js';

export default class CloseButton extends Component
{
    render()
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/CloseButton.css">
            <div class="close-button" onClick="${this.props.onClick.name}"></div>
        `;
    }
}
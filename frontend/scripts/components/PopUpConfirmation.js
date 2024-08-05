import { Component } from '../../modules/onion/index.js';

export default class PopUpConfirmation extends Component
{
    render()
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/PopUpConfirmation.css">
            <div class="modal">
                <div class="modal-content">
                    <p>${this.props.message}</p>
                    <button class="modal-button yes-button" onClick="${this.props.onClickDone.name}">${this.context.localizeText('YES')}</button>
                    <button class="modal-button no-button" onClick="${this.props.onClickClose.name}">${this.context.localizeText('NO')}</button>
                </div>
            </div>
        `;
    }
}
import { Component } from '../../modules/onion/index.js';

export default class PlayerInfo extends Component
{
    render()
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/PlayerInfo.css">
            <div id="playerInfo">
                <div class="playerName">${this.props.playerOne}</div>
                <div id="score">${this.props.scoreOne} : ${this.props.scoreTwo}</div>
                <div class="playerName">${this.props.playerTwo}</div>
            </div>
        `;
    }
}
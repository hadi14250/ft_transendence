import { Component } from "../../modules/onion/index.js";
import BaseButton from "../components/BaseButton.js";
import ConfettiEffect from "../components/ConfettiEffect.js";
import PongLogo from "../components/PongLogo.js";

export default class Winner extends Component
{
    handleButtonClickMainMenu() 
    {
        this.context.navigate('/main-menu');
    }
    
    render()
    {   
        return String.raw`
            <link rel="stylesheet" href="/styles/Winner.css">
            <div className="${PongLogo.name}"></div>
            <h2 style="font-size: 70pt; color: #FFD335;">${this.context.localizeText('VICTORY')}</h2>
            <img style="width: 4%; margin-bottom: 10px;" src="./assets/icons/CrownIcon.svg" alt="Crown Icon">

            <div class="winner-name" id="winner-name">${this.props.playerName}</div>
            <div buttonstylepath="/styles/BaseButton.css" buttonclass="base-button" className="${BaseButton.name}" text="${this.context.localizeText('MAIN_MENU')}" onClick="${this.handleButtonClickMainMenu.name}"></div>
            <div className="${ConfettiEffect.name}"></div>
        `;
    }
}

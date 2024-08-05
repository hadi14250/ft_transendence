import { Component } from "../../modules/onion/index.js";
import BaseButton from "../components/BaseButton.js";
import PongLogo from "../components/PongLogo.js";

export default class Loser extends Component
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
            <h2 style="font-size: 70pt; color: #FF4A4A;">${this.context.localizeText('DEFEATED')}</h2>
            <img id="angry-bot" style="width: 4%; margin-bottom: 10px;" src="./assets/icons/Ai_icon_angry.svg" alt="Crown Icon">
            
            <div class="bot-name" id="winner-name">${this.context.localizeText('BY_AI')}</div>
            <div buttonstylepath="/styles/BaseButton.css" buttonclass="base-button" className="${BaseButton.name}" text="${this.context.localizeText('MAIN_MENU')}" onClick="${this.handleButtonClickMainMenu.name}"></div>
        `;
    }
}

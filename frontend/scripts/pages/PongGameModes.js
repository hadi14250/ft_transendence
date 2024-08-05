import { Component } from "../../modules/onion/index.js";
import CloseButton from "../components/CloseButton.js";
import ModesButton from "../components/ModesButton.js";

export default class PongGameModes extends Component
{
    handleAIButtonClick() 
    {
        this.context.navigate('/game-ai');
    }

    handlePvPButtonClick() 
    {
        this.context.navigate('/game-pvp');
    }

    handleCloseButtonClick()
    {
        this.context.navigate('/main-menu');
    }

    render()
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/PongGameModes.css">
            <div class="window">
                <div class="window-header">
                    <div className="${CloseButton.name}" onClick="${this.handleCloseButtonClick.name}"></div>
                </div>        
                <div class="window-mode-content">
                    <h2>${this.context.localizeText('MODE')}</h2>
                    <div className="${ModesButton.name}" text="PvP" onClick="${this.handlePvPButtonClick.name}"></div>
                    <div className="${ModesButton.name}" text="AI" onClick="${this.handleAIButtonClick.name}"></div>
                </div>
            </div>
        `;
    }
}
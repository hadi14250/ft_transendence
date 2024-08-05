import { Component } from "../../modules/onion/index.js";
import BaseButton from "../components/BaseButton.js";
import CloseButton from "../components/CloseButton.js";

export default class TournamentRegistration extends Component
{
    handleButtonStart() 
    {
        const playerIds = ['player1', 'player2', 'player3', 'player4'];
        const players = playerIds.map(id => document.getElementById(id).value.trim());

        if (!this.areValidNames(players))
            return;

        this.shufflePlayers(players);
        const tournament = this.createTournamentData(players);
        this.context.navigate('/tournament/rankings', { tournament });
    }

    areValidNames(players)
    {
        // Check for empty player names
        if (players.some(player => !player)) {
            alert(this.context.localizeText('VALID_PLAYER'));
            return false;
        }
        // Check for duplicate player names
        const uniquePlayers = new Set(players);
        if (uniquePlayers.size !== players.length) {
            alert(this.context.localizeText('UNIQUE_PLAYER'));
            return false;
        }
        return true;
    }

    shufflePlayers(players)
    {
        for (let i = players.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }
    }

    createTournamentData(players)
    {
        const matches = [];

        if (players.length < 2)
        {
            console.error("Cannot register with less than two tournament players");
            return null;
        }
        if (players.length % 2 != 0)
        {
            console.error("Cannot register tournament players with old count");
            return null;
        }
        for (let i = 0; i < players.length; i += 2)
        {
            const matchPlayers = players.slice(i, i + 2);
            matches.push({
                id: `match_${i + 1}`,
                players: matchPlayers,
                status: 'Pending',
                winner: ""
            });
        }
        matches.push({
            id: `match_${players.length}`,
            players: [ "", "" ],
            status: 'Pending',
            winner: ""
        });
        return { matches };
    }

    handleCloseButtonClick()
    {
        this.context.navigate('/main-menu');
    }

    render()
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/TournamentRegistration.css">
            <div class="window">
                <div class="window-header">
                    <div className="${CloseButton.name}" onClick="${this.handleCloseButtonClick.name}"></div>
                </div>        
                <div class="window-content">
                    <h2>${this.context.localizeText('ALIAS_NAME')}</h2>
                    <div>
                        <input type="text" class="alias-input" placeholder="${this.context.localizeText('PLAYER')} 1" maxlength="10"  id="player1">
                        <input type="text" class="alias-input" placeholder="${this.context.localizeText('PLAYER')} 2" maxlength="10" id="player2">
                    </div>
                    <div>
                        <input type="text" class="alias-input" placeholder="${this.context.localizeText('PLAYER')} 3" maxlength="10" id="player3">
                        <input type="text" class="alias-input" placeholder="${this.context.localizeText('PLAYER')} 4" maxlength="10" id="player4">
                    </div>
                    <div buttonstylepath="/styles/BaseButton.css" buttonclass="base-button" className="${BaseButton.name}" text="${this.context.localizeText('START')}" onClick="${this.handleButtonStart.name}"></div>
                </div>
            </div>
        `;
    }
}
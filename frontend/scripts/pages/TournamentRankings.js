import { Component } from "../../modules/onion/index.js";
import BackButton from "../components/BackButton.js";
import ConfettiEffect from "../components/ConfettiEffect.js";
import PopUpConfirmation from "../components/PopUpConfirmation.js";

export default class TournamentRankings extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            isLoading: true,
            showModal: false,
            isCompleted: false
        };
        this.activeMatchIndex = -1;
    }

    onMount()
    {
        if (!this.props.tournament || !this.props.tournament.matches)
        {
            alert(this.context.localizeText('TOURNAMENT_MSG'));
            this.context.navigate('/main-menu');
        }
        else
        {
            this.initializeMatch(this.props.tournament.matches);
            this.setState({ isLoading: false });
        }
    }

    initializeMatch(matches)
    {
        if (!matches || matches.length != 3)
        {
            console.error("Tournament rankings is only compatible with three matches data");
            return;
        }

        // Match 1
        if (matches[0].status === 'Pending')
        {
            matches[0].status = 'Active';
            this.activeMatchIndex = 0;
            return;
        }
        if (matches[0].status === 'Active')
        {
            this.activeMatchIndex = 0;
            return;
        }
        
        // Match 2
        if (matches[1].status === 'Pending')
        {
            matches[1].status = 'Active';
            this.activeMatchIndex = 1;
            return;
        }
        if (matches[1].status === 'Active')
        {
            this.activeMatchIndex = 1;
            return;
        }

        // Match 3
        if (matches[2].status === 'Pending')
        {
            matches[2].players = [ matches[0].winner, matches[1].winner ];
            matches[2].status = 'Active';
            this.activeMatchIndex = 2;
            return;
        }
        if (matches[2].status === 'Active')
        {
            this.activeMatchIndex = 2;
            return;
        }
        if (matches[2].status === 'Done')
        {
            this.setState({ isCompleted: true });
        }

        this.props.tournament.matches = matches;
    }

    handleModalOpen()
    {
        this.setState({showModal: true});
    }

    handleModalClose()
    {
        this.setState({showModal: false});
    }

    handleModalDone()
    {
        this.context.navigate("/main-menu");
    }

    handleContinueButtonClick()
    {
        const tournament = this.props.tournament;
        tournament.activeMatchIndex = this.activeMatchIndex;
        this.context.navigate("/tournament/game", { tournament });
    }

    handleFinishButtonClick()
    {
        this.context.navigate("/main-menu");
    }

    createMatchPair(match, index)
    {
        const matchNum = index + 1;
        let [selectClassMatch, selectClassHeader, selectClassOne, selectClassTwo] = ["", "", "", ""];
    
        if (match.status === 'Active')
        {
            [selectClassMatch, selectClassHeader, selectClassOne, selectClassTwo] = ["current", "current", "current", "current"];
        }
        else if (match.status === 'Done')
        {
            selectClassMatch = "current";
            selectClassOne = match.winner === match.players[0] ? "winner" : "loser";
            selectClassTwo = match.winner === match.players[1] ? "winner" : "loser";
        }
    
        return String.raw`
            <div class="match ${selectClassMatch}">
                <h2 class="sub-header ${selectClassHeader}">${this.context.localizeText('MATCH')} ${matchNum}</h2>
                <div class="player ${selectClassOne}">${match.players[0]}</div>
                <div class="player ${selectClassTwo}">${match.players[1]}</div>
            </div>
        `;
    }

    createNextButton()
    {
        if (this.state.isCompleted)
        {
            return String.raw`
                <button class="btn-finish" id="FinishButton" onClick="${this.handleFinishButtonClick.name}">${this.context.localizeText('FINISH')}</button>   
            `;
        }
        return String.raw`
            <button class="btn-start" id="StartButton" onClick="${this.handleContinueButtonClick.name}">${this.context.localizeText('CONTINUE')}</button>
        `;
    }

    render()
    {
        if (this.state.isLoading)
        {
            return String.raw`<span style="margin:2.5px;" class="d-flex spinner-border spinner-border-medium" role="status" aria-hidden="true"></span>`;
        }
        const { tournament } = this.props;
        const matches = tournament.matches;

        return String.raw`
            <link rel="stylesheet" href="/styles/TournamentRankings.css">
            <div className="${BackButton.name}" text="▲" onClick="${this.handleModalOpen.name}">▲</div>
            <div class="container">
                <h1 class="header">${this.context.localizeText('TOURNAMENT')}</h1>
                <div class="matches">
                    ${this.createMatchPair(matches[0], 0)}
                    ${this.createMatchPair(matches[1], 1)}
                </div>
                ${this.createMatchPair(matches[2], 2)}
                <div class="match ${this.state.isCompleted ? "current" : ""}">
                    <img style="width: 20%; margin-bottom: 10px;" src="/assets/icons/CrownIcon.svg" alt="Crown Icon">
                    <h2 class="sub-header">${this.context.localizeText('WINNER')}</h2>
                    <div class="player ${this.state.isCompleted ? "current" : ""}">${matches[2].winner}</div>
                </div>
                ${this.createNextButton()}
            </div>
            ${this.state.isCompleted ? String.raw`<div className="${ConfettiEffect.name}"></div>` : ""}
            ${this.state.showModal ? String.raw`<div className="${PopUpConfirmation.name}" message="${this.context.localizeText('YOU_SURE')}" onClickClose="${this.handleModalClose.name}" onClickDone="${this.handleModalDone.name}"></div>` : ""}
        `;
    }
}
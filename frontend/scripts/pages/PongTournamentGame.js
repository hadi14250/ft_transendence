import { Component } from "../../modules/onion/index.js";
import BackButton from "../components/BackButton.js";
import PlayerInfo from "../components/PlayerInfo.js";
import PongGameBoard from "../components/PongGameBoard.js";
import PopUpConfirmation from "../components/PopUpConfirmation.js";

export default class PongTournamentGame extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            isLoading: true,
            scoreOne: 0,
            scoreTwo: 0,
            showModal: false
        };
        this.maxScore = 5;
        this.playerOneName = "Player 1";
        this.playerTwoName = "Player 2";
    }

    onMount()
    {
        if (!this.props.tournament || !this.props.tournament.matches)
        {
            alert(this.context.localizeText('TOURNAMENT_GAME_MSG'));
            this.context.navigate('/main-menu');
        }
        else
        {
            this.setState({ isLoading: false });
        }
    }

    updateScore(scoreOne, scoreTwo)
    {
        if (this.state.scoreOne != scoreOne || this.state.scoreTwo != scoreTwo)
        {
            if (scoreOne >= this.maxScore || scoreTwo >= this.maxScore)
            {
                const { tournament } = this.props;
                const match = tournament.matches[tournament.activeMatchIndex];
                
                match.winner = scoreOne >= this.maxScore ? this.playerOneName : this.playerTwoName;
                match.status = 'Done';
                
                this.context.navigate('/tournament/rankings', { tournament });
                return;
            }
            this.setState({ scoreOne, scoreTwo });
        }
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

    render()
    {
        const { scoreOne, scoreTwo, showModal, isLoading } = this.state;
        if (isLoading)
        {
            return String.raw`<span style="margin:2.5px;" class="d-flex spinner-border spinner-border-medium" role="status" aria-hidden="true"></span>`;
        }
        const { tournament } = this.props;

        const matchIndex = tournament.activeMatchIndex;
        const match = tournament.matches[matchIndex];
        this.playerOneName = match.players[0];
        this.playerTwoName = match.players[1];

        return String.raw`
            <link rel="stylesheet" href="/styles/PongNormalGame.css">
            <div className="${BackButton.name}" text="▲" onClick="${this.handleModalOpen.name}">▲</div>
            <div class="gameContainer">
                <div class="matchInfo">${this.context.localizeText('MATCH')} ${matchIndex + 1}</div>
                <div className="${PlayerInfo.name}" playerOne="${this.playerOneName}" playerTwo="${this.playerTwoName}" scoreOne="${scoreOne}" scoreTwo="${scoreTwo}"></div>
                <div className="${PongGameBoard.name}" pause="${showModal}" onClickUpdateScore="${this.updateScore.name}" scoreOne="${scoreOne}" scoreTwo="${scoreTwo}"></div>
            </div>
            ${showModal ? String.raw`<div className="${PopUpConfirmation.name}" message="${this.context.localizeText('YOU_SURE')}" onClickClose="${this.handleModalClose.name}" onClickDone="${this.handleModalDone.name}"></div>` : ""}
        `;
    }
}

import { Component } from "../../modules/onion/index.js";
import BaseButton from "../components/BaseButton.js";
import PongLogo from "../components/PongLogo.js";
import PopUpConfirmation from "../components/PopUpConfirmation.js";

export default class MainMenu extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            showModal: false
        };
    }

    handleButtonClickPlay() 
    {
        this.context.navigate("/game-mode");
    }
    
    handleButtonClickTournament() 
    {
        this.context.navigate("/tournament/register");
    }

    handleButtonClickSettings() 
    {
        this.context.navigate("/settings");
    }

    handleButtonClickLogOut() 
    {
        this.setState({showModal: true});
    }

    handleModalClose()
    {
        this.setState({showModal: false});
    }

    async handleModalDone()
    {
        localStorage.setItem('token', null);
        localStorage.setItem('user', null);
        try
        {
            await fetch('https://localhost:8000/oauth/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.context.token.access_token}`
                }
            });
        
            this.context.navigate('/login');
        }
        catch (error)
        {
            console.error(error.message || error);
            this.context.navigate('/login');
        }
    }

    render()
    {
        const profilePic = this.context.user?.profile_picture_url || '/assets/icons/DefaultProfilePicture.svg';

        return String.raw`
            <link rel="stylesheet" href="/styles/MainMenu.css">
            <div class="profile-container">
                <img id="profile-picture" class="profile-picture" src="${profilePic}" alt="Profile Picture">
                <div id="username" class="username">${this.context.user.username}</div>
            </div>
            <div className="${PongLogo.name}"></div>
            <div buttonStylePath="/styles/PlayButton.css" buttonClass="play-button" className="${BaseButton.name}" text="${this.context.localizeText('PLAY')}" onClick="${this.handleButtonClickPlay.name}"></div>
            <div style="font-size: 20pt" className="${BaseButton.name}" text="${this.context.localizeText('TOURNAMENT')}" onClick="${this.handleButtonClickTournament.name}"></div>
            <div style="font-size: 20pt" className="${BaseButton.name}" text="${this.context.localizeText('SETTINGS')}" onClick="${this.handleButtonClickSettings.name}"></div>
            <div buttonStylePath="/styles/LogoutButton.css" buttonClass="logout-button" className="${BaseButton.name}" text="${this.context.localizeText('LOGOUT')}" onClick="${this.handleButtonClickLogOut.name}"></div>
            ${this.state.showModal ? String.raw`<div className="${PopUpConfirmation.name}" message="Are you sure you want to logout?" onClickClose="${this.handleModalClose.name}" onClickDone="${this.handleModalDone.name}"></div>` : ""}
        `;
    }
}
import { Component } from '../modules/onion/index.js';
import { Router, Routes, Route } from '../modules/onion-router/index.js';

import LanguageProvider from './components/LanguageProvider.js';
import ProtectedRoute from './components/ProtectedRoute.js';

import Login from './pages/Login.js';
import MainMenu from './pages/MainMenu.js';
import Settings from './pages/Settings.js';
import PongGameModes from './pages/PongGameModes.js';
import TournamentRankings from './pages/TournamentRankings.js';
import PongNormalGame from './pages/PongNormalGame.js';
import PongAIGame from './pages/PongAIGame.js';
import TournamentRegistration from './pages/TournamentRegistration.js';
import PongTournamentGame from './pages/PongTournamentGame.js';
import Auth from './pages/Auth.js';
import TwoFactorAuth from './pages/TwoFactorAuth.js';

export default class App extends Component
{
    render()
    {
        return String.raw`
            <div class="d-flex justify-content-center flex-column align-items-center vh-100">
                <div className="${Router.name}">
                    <div className="${LanguageProvider.name}">
                        <div className="${Routes.name}">
                            <div className="${Route.name}" path="/login" component="${Login.name}"></div>
                            <div className="${Route.name}" path="/oauth/callback" component="${Auth.name}"></div>
                            <div className="${Route.name}" path="/2fa" component="${TwoFactorAuth.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/main-menu" component="${MainMenu.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/game-mode" component="${PongGameModes.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/game-pvp" component="${PongNormalGame.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/game-ai" component="${PongAIGame.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/tournament/register" component="${TournamentRegistration.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/tournament/rankings" component="${TournamentRankings.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/tournament/game" component="${PongTournamentGame.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/settings" component="${Settings.name}"></div>
                            <div className="${ProtectedRoute.name}" path="/" component="${MainMenu.name}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
import App from './App.js';
import LanguageProvider from './components/LanguageProvider.js';
import BaseButton from './components/BaseButton.js';
import ModesButton from "./components/ModesButton.js";
import CloseButton from './components/CloseButton.js';
import BackButton from './components/BackButton.js';
import Login from './pages/Login.js';
import TwoFactorAuth from './pages/TwoFactorAuth.js';
import MainMenu from './pages/MainMenu.js';
import TournamentRankings from './pages/TournamentRankings.js';
import Winner from './pages/Winner.js';
import Loser from './pages/Loser.js';
import PongGameModes from './pages/PongGameModes.js';
import TournamentRegistration from './pages/TournamentRegistration.js';
import PopUpConfirmation from './components/PopUpConfirmation.js';
import Settings from './pages/Settings.js';
import PongLogo from './components/PongLogo.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import PongNormalGame from './pages/PongNormalGame.js';
import PongAIGame from './pages/PongAIGame.js';
import PlayerInfo from './components/PlayerInfo.js';
import PongGameBoard from './components/PongGameBoard.js';
import ConfettiEffect from './components/ConfettiEffect.js';
import PongTournamentGame from './pages/PongTournamentGame.js';
import AILogo from './components/AILogo.js';
import Auth from './pages/Auth.js';

// Main
window.App = App;
window.LanguageProvider = LanguageProvider;
window.ProtectedRoute = ProtectedRoute;

// Components
window.BaseButton = BaseButton;
window.ModesButton = ModesButton;
window.CloseButton = CloseButton;
window.BackButton = BackButton;
window.PongLogo = PongLogo;
window.ConfettiEffect = ConfettiEffect;
window.PlayerInfo = PlayerInfo;
window.PongGameBoard = PongGameBoard;
window.PopUpConfirmation = PopUpConfirmation;
window.AILogo = AILogo;

// Pages
window.Login = Login;
window.Auth = Auth;
window.TwoFactorAuth = TwoFactorAuth;
window.MainMenu = MainMenu;
window.PongGameModes = PongGameModes;
window.PongNormalGame = PongNormalGame;
window.PongAIGame = PongAIGame;
window.Winner = Winner;
window.Loser = Loser;
window.TournamentRegistration = TournamentRegistration;
window.TournamentRankings = TournamentRankings;
window.PongTournamentGame = PongTournamentGame;
window.Settings = Settings;
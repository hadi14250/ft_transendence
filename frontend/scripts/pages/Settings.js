import { Component } from "../../modules/onion/index.js";
import CloseButton from "../components/CloseButton.js";

export default class Settings extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            isLoading: true,
            is2faEnabled: false,
            language: 'en'
        };
    }

    onMount()
    {
        this.setState({
            isLoading: false,
            is2faEnabled: this.context.user.is_2fa_enabled,
            language: this.context.user.language_preference.toLowerCase()
        });
    }

    handleLanguageChangeToEn()
    {   
        this.updatePrefs(this.state.is2faEnabled, 'en');
    }

    handleLanguageChangeToFr()
    {
        this.updatePrefs(this.state.is2faEnabled, 'fr');
    }

    handleLanguageChangeToEs()
    {
        this.updatePrefs(this.state.is2faEnabled, 'es');
    }

    handle2FAChange() 
    {
        const checkbox = document.getElementById('2fa');
        this.updatePrefs(checkbox.checked, this.state.language);
    }

    async updatePrefs(is2faEnabled, language)
    {
        try
        {
            const response = await fetch('https://localhost:8000/preferences/save-prefs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.context.token.access_token}`
                },
                body: JSON.stringify({
                    language_preference: language,
                    is_2fa_enabled: is2faEnabled,
                })
            });
        
            if (response.ok)
            {
                this.setState({ is2faEnabled, language });
                this.context.setLanguage(language);
            }
            else
            {
                alert(this.context.localizeText('AUTH_MSG'));
                this.context.navigate('/login');
            }
        }
        catch (error)
        {
            console.error(error.message || error);
            this.context.navigate('/login');
        }
    }

    handleCloseButtonClick()
    {
        this.context.navigate("/main-menu");
    }

    render()
    {
        const { is2faEnabled, language, isLoading } = this.state;

        if (isLoading)
        {
            return String.raw`<span style="margin:2.5px;" class="d-flex spinner-border spinner-border-medium" role="status" aria-hidden="true"></span>`;
        }
        return String.raw`
            <link rel="stylesheet" href="/styles/Settings.css">
            <div class="window">
                <div class="window-header">
                    <div className="${CloseButton.name}" onClick="${this.handleCloseButtonClick.name}"></div>
                </div>
                <div class="window-content">
                    <h2>${this.context.localizeText('SETTINGS')}</h2>
                    <div class="setting">
                        <span>${this.context.localizeText('2FA')}</span>
                        <input type="checkbox" id="2fa" onClick="${this.handle2FAChange.name}" ${is2faEnabled ? "checked" : ""}>
                    </div>
                    <div class="setting">
                        <span>${this.context.localizeText('LANGUAGE')}</span>
                        <img ${language === "en" ? "class='selected'" : ""} src="./assets/icons/Flag_of_the_United_States.svg" alt="English" id="lang-en" onClick="${this.handleLanguageChangeToEn.name}">
                        <img ${language === "fr" ? "class='selected'" : ""} src="./assets/icons/Flag_of_France.svg" alt="French" id="lang-fr" onClick="${this.handleLanguageChangeToFr.name}">
                        <img ${language === "es" ? "class='selected'" : ""} src="./assets/icons/Flag_of_Spain.svg" alt="Spanish" id="lang-es" onClick="${this.handleLanguageChangeToEs.name}">
                    </div>
                </div>
            </div>
        `;
    }
}
import { Component } from "../../modules/onion/index.js";
import BaseButton from "../components/BaseButton.js";
import CloseButton from "../components/CloseButton.js";

export default class TwoFactorAuth extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            isLoading: true,
            disableBtn: false,
            loadSendBtn: false,
            loadConfirmBtn: false,
        };
    }

    async onMount()
    {
        const { token, user } = this.props;
        if (!token || !user)
        {
            alert(this.context.localizeText('2FA_LOGIN_EXPIRED'));
            this.context.navigate('/login');
        }
        else 
        {
            let isLoading = !await this.sendOtp();
            this.setState({isLoading});
        }
    }

    async handleButtonConfirm() 
    {
        this.setState({disableBtn: true, loadConfirmBtn: true});

        const { token, user } = this.props;

        const username = user.username;
        const otp_code = document.getElementById("otp_code").value;
        try
        {
            const response = await fetch('https://localhost:8000/preferences/verify-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access_token}`
                },
                body: JSON.stringify({
                    username: username,
                    otp: otp_code,
                })
            });
        
            if (response.ok)
            {
                localStorage.setItem('token', JSON.stringify(token));
                this.context.navigate('/main-menu');
            }
            else
            {
                alert(this.context.localizeText('2FA_OTP_FAILED'));
                this.setState({disableBtn: false, loadConfirmBtn: false});
            }
        }
        catch (error)
        {
            console.error(error.message || error);
            this.context.navigate('/login');
        }
    }
    
    async handleButtonSendAgain() 
    {
        this.setState({disableBtn: true, loadSendBtn: true});
        await this.sendOtp();
    }

    async sendOtp()
    {
        const { token } = this.props;
        try
        {
            const response = await fetch('https://localhost:8000/preferences/send-otp/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.access_token}`
                }
            });
        
            this.setState({disableBtn: false, loadSendBtn: false});
            if (response.ok)
            {
                alert(this.context.localizeText('2FA_OTP_SENT'));
                return true;
            }
            else
            {
                console.error('Failed to send-otp:', response.status, response.statusText);
                alert(this.context.localizeText('2FA_ERROR_MSG'));
            }
        }
        catch (error)
        {
            console.error(error.message || error);
            this.context.navigate('/login');
        }
        return false;
    }

    handleCloseButtonClick()
    {
        this.context.navigate("/login");
    }

    render()
    {
        if (this.state.isLoading)
        {
            return String.raw`<span style="margin:2.5px;" class="d-flex spinner-border spinner-border-medium" role="status" aria-hidden="true"></span>`;
        }
        return String.raw`
            <link rel="stylesheet" href="/styles/TwoFactorAuth.css">
            <div class="window">
                <div class="window-header">
                    <div className="${CloseButton.name}" onClick="${this.handleCloseButtonClick.name}"></div>
                </div>        
                <div class="window-content">
                    <h2>${this.context.localizeText('ENTER_OTP')}</h2>
                    <input type="text" class="code-input" placeholder="******" maxlength="6" id="otp_code">
                    <div className="${BaseButton.name}" text="${this.context.localizeText('SEND_AGAIN')}" onClick="${this.handleButtonSendAgain.name}" isDisabled="${this.state.disableBtn}" isLoading="${this.state.loadSendBtn}"></div>
                    <div buttonStylePath="/styles/PlayButton.css" buttonClass="play-button" className="${BaseButton.name}" text="${this.context.localizeText('CONFIRM')}" onClick="${this.handleButtonConfirm.name}" isDisabled="${this.state.disableBtn}" isLoading="${this.state.loadConfirmBtn}"></div>
                </div>
            </div>
        `;
    }
}
import { Component } from "../../modules/onion/index.js";
import { Redirect, Route } from "../../modules/onion-router/index.js";

export default class ProtectedRoute extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            isAuthenticated: false,
            isLoading: true
        };
        this.user = null;
    }

    async onMount()
    {
        const prevToken = JSON.parse(localStorage.getItem('token'));
        const newToken = this.context.props.token;

        if (!prevToken && !newToken)
        {
            this.setState({ isAuthenticated: false, isLoading: false });
            return;
        }
        
        const accessToken = newToken?.access_token || prevToken.access_token;
        
        try
        {
            const response = await fetch('https://localhost:8000/preferences/me/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        
            if (response.ok)
            {
                this.user = await response.json();
                localStorage.setItem('user', JSON.stringify(this.user));
                await this.context.setLanguageSilently(this.user.language_preference);
                if (newToken)
                {
                    if (this.user.is_2fa_enabled)
                    {
                        this.context.navigate("/2fa", { user: this.user, token: newToken });
                    }
                    else
                    {
                        localStorage.setItem('token', JSON.stringify(newToken));
                        this.setState({ isAuthenticated: true, isLoading: false });
                    }
                }
                else
                {
                    this.setState({ isAuthenticated: true, isLoading: false });
                }
            }
            else
            {
                console.error('Failed to fetch me:', response.status, response.statusText);
                alert(this.context.localizeText('AUTH_MSG'));
                this.setState({ isAuthenticated: false, isLoading: false });
            }
        }
        catch (error)
        {
            console.error(error.message || error);
            this.setState({ isAuthenticated: false, isLoading: false });
        }
    }

    render()
    {
        this.context.user = this.user;

        if (this.state.isLoading)
        {
            return String.raw`<span style="margin:2.5px;" class="d-flex spinner-border spinner-border-medium" role="status" aria-hidden="true"></span>`;
        }
        if (this.state.isAuthenticated)
        {
            this.context.token = JSON.parse(localStorage.getItem('token'));
            return String.raw`
                <div className="${Route.name}" ${this.props.exact ? "exact": ""} path="${this.props.path}" component="${this.props.component}" componentProps="${this.props.componentProps}"></div>
            `;
        }
        // if (this.state.is2fa)
        // {
        //     this.context.token = this.token;
        //     console.log(this.context.token);
        //     return String.raw`
        //         <div className="${TwoFactorAuth.name}" path="/2fa" component="${TwoFactorAuth.name}"></div>
        //     `;
        // }
        return String.raw`
            <div className="${Redirect.name}" to="/login"></div>
        `;
    }
}
import { Component } from '../../modules/onion/index.js';

export default class ConfettiEffect extends Component
{
    createConfetti()
    {
        const confettiCount = 150; // Increase number of confetti elements
        const colors = ['#FFD335', '#FF4A4A', '#00E7FD', '#7100FE'];
        let confettiHTML = '';
    
        for (let i = 0; i < confettiCount; i++) {
            const left = `${Math.random() * 100}vw`;
            const animationDelay = `${Math.random() * 3}s`;
            const backgroundColor = colors[i % colors.length];
    
            confettiHTML += String.raw`<div class="confetti" style="left: ${left}; animation-delay: ${animationDelay}; background-color: ${backgroundColor};"></div>`;
        }
    
        return confettiHTML;
    }

    render()
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/ConfettiEffect.css">
            ${this.createConfetti()}
        `;
    }
}
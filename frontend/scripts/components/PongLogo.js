import { Component } from '../../modules/onion/index.js';

export default class PongLogo extends Component
{
    render()
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/PongLogo.css">
            <div id="pong-logo-animation">
                <svg width="574" height="205" viewBox="0 0 574 205" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#FFD335;stop-opacity:1"></stop>
                            <stop offset="100%" style="stop-color:#7100FE;stop-opacity:1"></stop>
                        </linearGradient>
                    </defs>
                    <g fill="url(#gradient)" class="gradient-fill">
                        <rect id="letterN1" x="290" y="35" width="32" height="134"></rect>
                        <rect id="letterN2" x="393" y="35" width="32" height="134"></rect>
                        <rect id="letterN3" x="297.888" y="55.4001" width="31.5842" height="148.803" transform="rotate(-40.2332 297.888 55.4001)"></rect>
                        <rect id="letterO1" x="149" y="35" width="32" height="134"></rect>
                        <rect id="letterO2" x="251" y="35" width="32" height="134"></rect>
                        <rect id="letterO3" x="149" y="169" width="32" height="134" transform="rotate(-90 149 169)"></rect>
                        <rect id="letterO4" x="149" y="67" width="32" height="134" transform="rotate(-90 149 67)"></rect>
                        <rect id="letterP1" x="39" y="67" width="32" height="103" transform="rotate(-90 39 67)"></rect>
                        <rect id="letterP2" x="39" y="137" width="32" height="103" transform="rotate(-90 39 137)"></rect>
                        <rect id="letterP3" x="142" y="137" width="32" height="102" transform="rotate(180 142 137)"></rect>
                        <rect id="letterG1" x="471" y="67" width="32" height="103" transform="rotate(-90 471 67)"></rect>
                        <rect id="letterG2" x="507" y="118" width="32" height="67" transform="rotate(-90 507 118)"></rect>
                        <rect id="letterG3" x="471" y="168" width="32" height="103" transform="rotate(-90 471 168)"></rect>
                        <rect id="letterG4" x="542" y="86" width="32" height="82"></rect>
                        <rect id="line1" x="0" y="66" width="32" height="134" stroke="white" stroke-width="2" fill="none"></rect>
                        <rect id="line2" x="432" y="0" width="32" height="134" stroke="white" stroke-width="2" fill="none"></rect>
                        <rect id="ball" x="205" y="113" width="22" height="22" fill="white" transform="rotate(-90 205 113)"></rect>
                    </g>
                </svg>
            </div>
        `;
    }
}
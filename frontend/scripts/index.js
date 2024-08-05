import './global-setup.js';
import { createRoot } from '../modules/onion-dom/index.js';
import App from "./App.js";

const root = createRoot(document.getElementById('root'));

root.render(String.raw`
    <div className="${App.name}"></div>
`);
import { rerender } from "../src/OnionDOMRenderer.js";

export function listenToAllSupportedEvents()
{
    document.addEventListener('component.stateChange', onComponentStateChangeEvent);
}

export function unlistenToAllSupportedEvents()
{
    document.removeEventListener('component.stateChange', onComponentStateChangeEvent);
}

function onComponentStateChangeEvent(event)
{
    // console.log("On component state change event triggered!");
    // console.log("Event detail:", event.detail);
    
    let detail = event.detail;
    rerender(detail.instance, detail.state, detail.callback);
}
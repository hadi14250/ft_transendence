import { isValidContainer } from "./OnionDOMContainer.js";
import { createContainer, updateContainer } from "../../onion-node/src/OnionNodeContainer.js";
import { Root } from "../../onion-node/shared/OnionRootTags.js";
import { isContainerMarkedAsRoot, markContainerAsRoot, unmarkContainerAsRoot } from "./OnionDOMComponentTree.js";
import { getNodeListFromHTML } from "./OnionDOMParser.js";
import { listenToAllSupportedEvents, unlistenToAllSupportedEvents } from "../events/OnionDOMEventSystem.js";

function OnionDOMRoot(nodeRoot)
{
    this._internalRoot = nodeRoot;
}

export function createRoot(container)
{
    if (!isValidContainer(container))
        throw new Error('Target container is not a DOM element.');

    warnIfContainerMarkedAsRoot(container);

    const root = createContainer(container, Root);
    markContainerAsRoot(root.current, container);

    listenToAllSupportedEvents();

    return new OnionDOMRoot(root);
}

OnionDOMRoot.prototype.render = function(HTMLString, callback)
{
    const root = this._internalRoot;
    if (root === null)
        throw new Error('Cannot update an unmounted root.');

    const children = getNodeListFromHTML(HTMLString);
    updateContainer(children, root, callback);
}

OnionDOMRoot.prototype.unmount = function()
{
    const root = this._internalRoot;
    if (root !== null)
    {
        this._internalRoot = null;
        const container = root.containerInfo;
        updateContainer(null, root, null);
        unmarkContainerAsRoot(container);
        unlistenToAllSupportedEvents();
    }
}

function warnIfContainerMarkedAsRoot(container)
{
    if (isContainerMarkedAsRoot(container))
    {
        console.error(
            'You are calling OnionDOMClient.createRoot() on a container that ' +
            'has already been passed to createRoot() before. Instead, call ' +
            'root.render() on the existing root instead if you want to update it.',
        );
    }
}
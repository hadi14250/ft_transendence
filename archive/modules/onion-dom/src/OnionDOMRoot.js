import { isValidContainer } from "./OnionDOMContainer.js";
import { createContainer, updateContainer } from "../../onion-node/src/OnionContainer.js";
import { Root } from "../../onion-node/shared/OnionRootTags.js";
import { markContainerAsRoot } from "./OnionDOMComponentTree.js";
import { getNodeListFromHTML } from "./OnionDOMParser.js";

function OnionDOMRoot(nodeRoot)
{
    this._internalRoot = nodeRoot;
}

export function createRoot(container)
{
    if (!isValidContainer(container))
        throw new Error('Target container is not a DOM element.');

    const root = createContainer(container, Root);
    markContainerAsRoot(root.current, container);

    return new OnionDOMRoot(root);
}

OnionDOMRoot.prototype.render = function(HTMLString, callback)
{
    const root = this._internalRoot;
    if (root === null) {
      throw new Error('Cannot update an unmounted root.');
    }
    const children = getNodeListFromHTML(HTMLString);
    updateContainer(children, root, null, callback);
}
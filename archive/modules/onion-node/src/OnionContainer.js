import { createRootNode } from "./OnionNodeRoot.js";
import { createUpdate, enqueueUpdate } from "./OnionNodeUpdateQueue.js";
import { get as getInstance } from "../../onion-shared/OnionInstanceMap.js";
import { renderUpdateOnNode } from "./OnionNodeRenderer.js";

export function createContainer(containerInfo, tag)
{
    return createRootNode(containerInfo, tag, null);
}

export function updateContainer(element, container, parentComponent)
{
	return updateContainerImp(container.current, element, container, parentComponent);
}

function updateContainerImp(rootNode, element, container, parentComponent, callback)
{
    const update = createUpdate();
    update.payload = {element};

    const context = getContextForSubtree(parentComponent);
    if (container.context === null)
      container.context = context;
    else
      container.pendingContext = context;

    callback = (callback === undefined) ? null : callback;
    if (callback !== null)
    {
        if (typeof callback !== 'function')
        {
            console.error(
              'Expected the last optional `callback` argument to be a ' +
                'function. Instead received: %s.',
              callback,
            );
        }
        update.callback = callback;
    }

    const root = enqueueUpdate(rootNode, update);
    if (root !== null)
        renderUpdateOnNode(root, rootNode);
}

function getContextForSubtree(parentComponent)
{
    if (!parentComponent)
        return {}; // Empty Context

    let node = getInstance(parentComponent);
    const parentContext = findCurrentUnmaskedContext(node);

    return parentContext;
}
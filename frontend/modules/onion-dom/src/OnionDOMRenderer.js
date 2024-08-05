import { updateNode, isCurrentlyProcessingUpdate } from "../../onion-node/src/OnionNodeContainer.js";

let queue = Promise.resolve();

export function rerender(instance, partialState, callback)
{
    queue = queue.then(() => processRerender(instance, partialState, callback));
}

async function processRerender(instance, partialState, callback)
{
    let node = instance.__onionInternals;

    // Wait until isCurrentlyProcessingUpdate() is false
    while (isCurrentlyProcessingUpdate())
    {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    if (!isMounted(node))
    {
        console.error(`Cannot perform state update on an unmounted component ${instance.name}. ` +
            'Please make sure that the component is mounted before calling this.setState');
        return;
    }

    updateNode(node, null, partialState, callback);
}

function isMounted(node)
{
    return !!(node && node.parentContainer);
}
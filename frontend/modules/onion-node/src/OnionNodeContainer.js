import { createRootNode } from "./OnionNodeRoot.js";
import { updateOnNodes, updateNodeProps, updateNodeState } from "./OnionNodeUpdates.js";
import { render } from "./OnionNodeRender.js";

let currentlyProcessingUpdate = false;

export function createContainer(containerInfo, tag)
{
    return createRootNode(containerInfo, tag);
}

export function updateContainer(nodeList, container, callback)
{
	updateContainerImp(container.current, nodeList, container, callback);
}

function updateContainerImp(rootNode, nodeList, container, callback)
{
    if (currentlyProcessingUpdate)
        console.error("Cannot perform root node update because onion is busy rendering");

    currentlyProcessingUpdate = true;

    updateOnNodes(rootNode, nodeList);
    render(rootNode, container.containerInfo);
    
    currentlyProcessingUpdate = false;

    if (callback)
        callback.call();
}

export function updateNode(node, pendingProps, pendingState, callback)
{
    if (currentlyProcessingUpdate)
        console.error("Cannot perform node update because onion is busy rendering");

    currentlyProcessingUpdate = true;

    updateNodeProps(node, pendingProps);
    updateNodeState(node, pendingState);
    render(node, node.parentContainer);

    currentlyProcessingUpdate = false;

    if (callback)
        callback.call();
}

export function isCurrentlyProcessingUpdate()
{
    return currentlyProcessingUpdate;
}
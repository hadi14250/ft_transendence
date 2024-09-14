import { createHostRootNode } from "./OnionNode.js";
import { initializeUpdateQueue } from "./OnionNodeUpdateQueue.js";

function RootNode(containerInfo, tag)
{
    this.containerInfo = containerInfo;
    this.tag = tag;
    this.pendingChildren = null;
    this.current = null;
    this.context = null;
    this.pendingContext = null;
}

export function createRootNode(containerInfo, tag, initialChildren)
{
    const root = new RootNode(containerInfo, tag);

    const uninitializedNode = createHostRootNode();
    root.current = uninitializedNode;
    uninitializedNode.stateNode = root;

    const initialState = {
        element: initialChildren
    };
    uninitializedNode.memoizedState = initialState;

    initializeUpdateQueue(uninitializedNode);

    return root;
}
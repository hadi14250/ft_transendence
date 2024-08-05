import { createHostRootNode } from "./OnionNode.js";

function RootNode(containerInfo, tag)
{
    this.containerInfo = containerInfo;
    this.tag = tag;
    this.current = null;
}

export function createRootNode(containerInfo, tag)
{
    const root = new RootNode(containerInfo, tag);

    const uninitializedNode = createHostRootNode();
    root.current = uninitializedNode;
    uninitializedNode.stateNode = root;

    return root;
}
import { HostRoot } from "../shared/OnionNodeTags.js";

export function getNearestMountedNode(sourceNode)
{
    let node = sourceNode;
    let nearestMounted = sourceNode;

    while (node.parent)
        node = node.parent;

    if (node.tag === HostRoot)
    {
        return nearestMounted;
    }
    // If we didn't hit the root, that means that we're in an disconnected tree
    // that has been unmounted.
    return null;
}

export function isNodeMounted(node)
{
    return getNearestMountedNode(node) === node;
}
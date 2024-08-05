import { isValidNamePropsNode } from "./OnionNodeProps.js";

export function resolveNodeRef(node, refName)
{
    while (node)
    {
        let stateNode = node.stateNode;
        if (!isValidNamePropsNode(node, refName) &&
            stateNode && Object.prototype.hasOwnProperty.call(stateNode, refName))
        {
            return stateNode[refName];
        }
        node = node.parent;
    }
    return null;
}
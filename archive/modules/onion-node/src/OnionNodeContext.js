import { HostRoot, ClassComponent } from "../shared/OnionNodeTags.js";
import { isNodeMounted } from "./OnionNodeReflection.js";

export function findCurrentUnmaskedContext(node)
{
    if (!isNodeMounted(node) || node.tag !== ClassComponent)
    {
        throw new Error(
          'Expected subtree parent to be a mounted class component. ' +
            'This error is likely caused by a bug in Onion. Please file an issue.',
        );
    }

    let currNode = node;
    do {
        switch (node.tag)
        {
            case HostRoot:
                return node.stateNode.context;
            case ClassComponent:
            {
                const Component = node.type;
                //TODO: Implement context provider
                return null;
            }
        }
        currNode = node.parent;
    } while (currNode !== null);

    throw new Error(
        'Found unexpected detached subtree parent. ' +
          'This error is likely caused by a bug in Onion. Please file an issue.',
    );
}
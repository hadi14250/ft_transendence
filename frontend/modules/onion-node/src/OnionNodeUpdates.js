import { HostRoot, ClassComponent, HostComponent } from "../shared/OnionNodeTags.js";

export function updateOnNodes(node, nodeList)
{
    // Nothing to update
    if (!nodeList)
        return;
    if (node.children)
    {
        console.error(`Expected a clean ${node.type} node before calling updateOnNodes.` +
            " This error is likely caused by a bug in Onion. Please file an issue.");
    }

    node.children = [];
    for (let i = 0; i < nodeList.length; i++)
    {
        let childNode = nodeList[i];
        childNode.parent = node;
        updateNodeContext(childNode, node.context);
        node.children.push(childNode);
    }
}

export function getRootForUpdatedNode(sourceNode)
{
    let node = sourceNode;
    let parent = node.parent;
    while (parent !== null)
    {
        node = parent;
        parent = node.parent;
    }
    return node.tag === HostRoot ? node.stateNode : null;
}

export function updateNodeFromNodeList(node, nodeList)
{
    // console.log(node);
    let newNodeList = [];
    for (let i = 0; i < nodeList.length; i++)
    {
        let newNode = nodeList[i];
        let newStateNode = newNode.stateNode;
        let found = false;
        for (let j = 0; j < node.children.length; j++)
        {
            let oldNode = node.children[j];
            let oldStateNode = oldNode.stateNode;
            // console.log("--------");
            // console.log(`${newNode.tag}, ${newNode.tag === oldNode.tag}`);
            // console.log(`${newNode.type}, ${newNode.type === oldNode.type}`);
            // console.log(`${newNode.key}, ${newNode.key === oldNode.key}`);
            // console.log(`${newStateNode.outerHTML}\n\n${oldStateNode.outerHTML}\nresult=${oldStateNode.outerHTML === newStateNode.outerHTML}`);
            // console.log("--------");
            if (oldStateNode.outerHTML === newStateNode.outerHTML) // Exactly same, do nothing
            {
                found = true;

                node.children.splice(j, 1);
                newNodeList.push(oldNode);
                break;
            }
            else if (newNode.tag == ClassComponent && newNode.tag === oldNode.tag && newNode.type === oldNode.type && newNode.key === oldNode.key)
            {
                found = true;

                let pendingProps = newNode.pendingProps;
                oldNode.pendingProps = Object.assign({}, oldNode.pendingProps || {}, pendingProps || {});

                let pendingState = Object.assign({}, newNode.pendingState, { __outerHTML: newNode.stateNode.outerHTML });
                oldNode.pendingState = Object.assign({}, oldNode.pendingState || {}, pendingState || {});
                
                node.children.splice(j, 1);
                newNodeList.push(oldNode);
                break;
            }
        }
        if (!found)
        {
            newNodeList.push(newNode);
        }
    }
    return newNodeList;
}

export function updateNodeProps(node, pendingProps)
{
    if (!pendingProps)
        return;

    node.pendingProps = Object.assign({}, pendingProps || {}, node.pendingProps || {});
}

export function updateNodeState(node, partialState)
{
    if (!partialState)
        return;

    if (typeof partialState === 'function')
    {
        partialState = partialState.call(node.memoizedState);
    }
    node.pendingState = Object.assign({}, partialState || {}, node.pendingState || {});
}

export function updateNodeContext(node, partialContext)
{
    if (!partialContext)
        return;

    if (typeof partialContext !== 'object')
    {
        console.error("Context can only be of an object type.");
    }
    node.context = Object.assign({}, node.context || {}, partialContext || {});
}
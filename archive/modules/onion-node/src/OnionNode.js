import { HostRoot, ClassComponent, HostComponent } from "../shared/OnionNodeTags.js";
import { createClassComponent } from "./OnionNodeClassComponent.js";

const className = "className";

function Node(tag, key, pendingProps)
{
    this.tag = tag;
    this.key = key;
    this.type = null;
    this.elementType = null;
    this.stateNode = null;

    this.parent = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;

    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
}

function createNode(tag, key, pendingProps)
{
    return new Node(tag, key, pendingProps);
}

export function createHostRootNode()
{
    return createNode(HostRoot, null, null);
}

export function createNodeFromDOMElement(element)
{
    let nodeTag = HostComponent;
    let type = element.nodeType;
    let key = element.key;
    let pendingProps = {};
    let componenetName = null;

    if (componenetName = element.getAttribute(className))
    {
        nodeTag = ClassComponent;
        let lowerCaseClassName = className.toLowerCase();
        for (let attr of element.attributes)
        {
            let name = attr.name.toLowerCase();
            if (name === "key")
                key = attr.value;
            else if (name != lowerCaseClassName)
                pendingProps[attr.name] = attr.value;
        }
    }
    else
        pendingProps = element.attributes;
    
    let node = createNode(nodeTag, key, pendingProps);
    if (nodeTag == ClassComponent)
    {
        node.type = componenetName;
        node.stateNode = createClassComponent(node, componenetName, pendingProps);
        node.elementType = type;
    }
    else
    {
        node.type = type;
        node.stateNode = element;
        node.elementType = node.stateNode.localName;
    }
    return node;
}
import { HostRoot, HostComponent, ClassComponent } from "../shared/OnionNodeTags.js";
import { createClassComponent } from "./OnionNodeClassComponent.js";
import { convertStringToType } from "../../shared/StringConverter.js";
import { COMMENT_NODE, TEXT_NODE } from "../../onion-dom/shared/HTMLNodeType.js";

const className = "className";

function Node(tag, key, pendingProps)
{
    this.tag = tag;
    this.key = key;
    this.type = null;
    this.stateNode = null;

    this.parent = null;
    this.children = null;

    this.pendingProps = pendingProps;
    this.pendingState = null;
    this.memoizedProps = null;
    this.memoizedState = null;

    this.context = null;
    this.parentContainer = null;
}

function createNode(tag, key, pendingProps)
{
    return new Node(tag, key, pendingProps);
}

export function createHostRootNode()
{
    return createNode(HostRoot, null, null);
}

export function createNodeFromDOMElement(element, htmlString)
{
    let key = element.key;
    let elementType = element.nodeType;
    let nodeTag = null;
    let type = null;
    let pendingProps = {};
    let stateNode = null;

    if (type = getComponentNameFromDOMElement(element))
    {
        nodeTag = ClassComponent;
        let options = { element: element, children: element.childNodes, htmlString: htmlString };
        stateNode = createClassComponent(type, options);
    }
    else
    {
        nodeTag = HostComponent;
        type = element.localName;
        stateNode = element;
    }
    
    if (elementType != TEXT_NODE && elementType != COMMENT_NODE)
    {
        for (let attr of element.attributes)
        {
            let name = getCorrectCaseProp(htmlString, attr.name);
            let value = convertStringToType(attr.value);
            if (attr.name === "key")
                key = value;
            else if (attr.value != type)
                pendingProps[name] = value;
        }
    }
    
    let node = createNode(nodeTag, key, pendingProps);
    
    node.elementType = elementType;
    node.type = type;
    node.stateNode = stateNode;
    node.memoizedProps = stateNode.props;
    node.memoizedState = stateNode.state;
    
    stateNode.__onionInternals = node;

    return node;
}

function getComponentNameFromDOMElement(element)
{
    return (element.nodeType != TEXT_NODE && element.getAttribute(className.toLowerCase()));
}

function getCorrectCaseProp(htmlString, lowercasedProp)
{
    const propPattern = new RegExp(`\\s(${lowercasedProp})="`, 'gi');
    let match;
    const props = new Set();
    
    while ((match = propPattern.exec(htmlString)) !== null)
    {
        props.add(match[1]);
    }
  
    if (props.size > 0)
    {
        return [...props][0];
    }
    return lowercasedProp;
}
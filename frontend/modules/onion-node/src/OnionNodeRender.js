import { getNodeListFromHTML, getNodeListFromDOMElements } from "../../onion-dom/src/OnionDOMParser.js";
import { HostRoot, ClassComponent, HostComponent } from "../shared/OnionNodeTags.js";
import { updateOnNodes, updateNodeFromNodeList, updateNodeContext } from "./OnionNodeUpdates.js";
import { resolveNodeFunction } from "./OnionNodeFunctionBind.js";
import { resolveNodeRef } from "./OnionNodeRef.js";

export function render(node, container)
{
    renderImp(node, container, null);
}

function renderImp(node, container, renderHTML)
{
    switch (node.tag)
    {
        case HostRoot:
            renderOnChildNode(node, container, renderHTML);
            break;
        case ClassComponent:
            renderOnClassNode(node, container);
            break;
        case HostComponent:
            renderOnHostNode(node, container, renderHTML);
            break;
        default:
            break;
    }
}

function renderOnChildNode(node, container, renderHTML)
{
    // Nothing to render
    if (!node.children)
        return;

    for (let i = 0; i < node.children.length; i++)
    {
        let childNode = node.children[i];
        renderImp(childNode, container, renderHTML);
    }
}

function renderOnClassNode(node, container)
{
    let stateNode = node.stateNode;    
    let newNodeMount = warnIsNodeNotMounted(node, container);
    let pendingContext = node.context;
    let pendingProps = node.pendingProps;
    let pendingState = node.pendingState;

    // Don't render if there are no changes
    if (!stateNode || (!newNodeMount && !pendingContext && !pendingProps && !pendingState))
        return;

    if (pendingContext)
    {
        stateNode.context = Object.assign({}, stateNode.context || {}, pendingContext || {});
    }

    if (!newNodeMount && !stateNode.shouldComponentUpdate(pendingProps, pendingState))
        return;
    
    if (pendingProps)
    {
        processSpecialClassProps(node, pendingProps);
        
        node.memoizedProps = Object.assign({}, stateNode.props || {}, pendingProps || {});
        node.pendingProps = null;
    }

    if (pendingState)
    {
        // Exract outerHTML from state
        if (pendingState.__outerHTML)
        {
            stateNode.outerHTML = pendingState.__outerHTML;
            delete pendingState.__outerHTML;
        }

        node.memoizedState = Object.assign({}, stateNode.state || {}, pendingState || {});
        node.pendingState = null;
    }

    let prevProps = stateNode.props;
    let prevState = stateNode.state;
    
    stateNode.props = node.memoizedProps;
    stateNode.state = node.memoizedState;
    
    if (!newNodeMount)
        stateNode.onPreUpdate(prevProps, prevState);
    
    let renderHTML = stateNode.render();
    let nodeList = getNodeListFromHTML(renderHTML);

    if (!newNodeMount)
    {
        nodeList = updateNodeFromNodeList(node, nodeList);
        unmountOnChildNode(node, container);
    }

    updateNodeContext(node, stateNode.context);
    updateOnNodes(node, nodeList);
    renderOnChildNode(node, container, renderHTML);

    if (newNodeMount)
        stateNode.onMount();

    if (!newNodeMount)
        stateNode.onUpdate(prevProps, prevState);
}

function renderOnHostNode(node, container, renderHTML)
{    
    let prevStateNode = node.stateNode;
    let newNodeMount = warnIsNodeNotMounted(node, container);
    let pendingProps = node.pendingProps;
    let pendingState = node.pendingState;
    let newStateNode = null;

    // Don't render if there are no changes
    if (!newNodeMount && !pendingProps && !pendingState)
        return;
    
    if (pendingState)
    {
        // Exract outerHTML from state
        if (pendingState.__outerHTML)
        {
            newStateNode = createStateNodeFromOuterHTML(pendingState.__outerHTML);
            node.stateNode = newStateNode;
            delete pendingState.__outerHTML;
        }

        node.memoizedState = Object.assign({}, node.memoizedState || {}, pendingState || {});
        node.pendingState = null;
    }

    let nodeList = getNodeListFromDOMElements(node.stateNode.childNodes, renderHTML);
    // Remove child nodes, will render it manually
    cloneNodeFromStateNode(node, false);
    
    if (!newNodeMount)
    {
        nodeList = updateNodeFromNodeList(node, nodeList);
        for (let i = 0; i < node.children.length; i++)
        {
            let childNode = node.children[i];
            container.removeChild(childNode.stateNode);
        }
    }

    if (pendingProps)
    {
        processSpecialHostProps(node, pendingProps);

        node.memoizedProps = Object.assign({}, node.memoizedProps || {}, pendingProps || {});
        node.pendingProps = null;
    }
    
    if (newStateNode)
        container.replaceChild(node.stateNode, prevStateNode);
    else
        container.appendChild(node.stateNode);
    
    updateOnNodes(node, nodeList);
    renderOnChildNode(node, node.stateNode, renderHTML);
}

function processSpecialClassProps(node, props)
{
    for (const key in props)
    {
        if (key.startsWith('onClick'))
        {
            let value = props[key];
            let funcName = value.split('(')[0];
            let boundFunction = resolveNodeFunction(node, funcName);
            if (!boundFunction)
            {
                console.error(`Passed function ${funcName} on ${node.type} component, but the parent nodes does not have this function implemented.`);
                return;
            }
            props[key] = boundFunction;
        }
    }
}

function processSpecialHostProps(node, props)
{
    let value;

    if (value = props.onClick)
    {
        let funcName = value.split('(')[0];
        let boundFunction = resolveNodeFunction(node, funcName);
        if (!boundFunction)
        {
            console.error(`Passed function ${funcName} on ${node.type} component, but the parent nodes does not have this function implemented.`);
            return;
        }
        node.stateNode.onclick = boundFunction;
    }
    if (value = props.ref)
    {
        let refObject = resolveNodeRef(node, value);
        if (!refObject)
        {
            console.error(`Passed ref ${value} on ${node.type} component, but the parent nodes does not have this property defined.`);
            return;
        }
        refObject.current = node.stateNode;
    }
}

function unmountNode(node, container)
{
    switch (node.tag)
    {
        case HostRoot:
            unmountOnChildNode(node, container);
            break;
        case ClassComponent:
            unmountOnClassNode(node, container);
            break;
        case HostComponent:
            unmountOnHostNode(node, container);
            break;
        default:
            break;
    }
}

function unmountOnChildNode(node, container)
{
    if (!node.children)
        return;

    for (let i = 0; i < node.children.length; i++)
    {
        let childNode = node.children[i];
        unmountNode(childNode, container);
    }
    delete node.children;
}

function unmountOnClassNode(node, container)
{
    unmountOnChildNode(node, container);
    node.stateNode.onUnmount();
    //TODO: remove any styles with it
    delete node.stateNode;
}

function unmountOnHostNode(node, container)
{
    unmountOnChildNode(node, node.stateNode);
    container.removeChild(node.stateNode);
    delete node.stateNode;
}

function warnIsNodeNotMounted(node, container)
{
    let newNodeMount = !node.parentContainer;
    if (newNodeMount)
    {
        node.parentContainer = container;
    }
    else if (node.parentContainer != container)
    {
        console.error('Updating an already mounted node to another container, ' +
            'need to cleanup the node first. This error is likely caused by a ' +
            'bug in Onion. Please file an issue.');
    }
    return newNodeMount;
}

function cloneNodeFromStateNode(node, allowChildren)
{
    const clonedNode = node.stateNode.cloneNode(allowChildren);
    node.stateNode = clonedNode;
}

function createStateNodeFromOuterHTML(outerHTML)
{
    var tempContainer = document.createElement('div');
    tempContainer.innerHTML = outerHTML;
    return tempContainer.firstElementChild;
}
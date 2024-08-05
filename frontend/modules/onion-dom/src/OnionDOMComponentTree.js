const randomKey = Math.random().toString(36).slice(2);
const internalInstanceKey = '__onionNode$' + randomKey;
const internalPropsKey = '__onionProps$' + randomKey;
const internalContainerInstanceKey = '__onionContainer$' + randomKey;

export function precacheNode(hostInst, node)
{
    node[internalInstanceKey] = hostInst;
}

export function getCurrentPropsFromNode(node)
{
    return node[internalPropsKey] || null;
}

export function updateNodeProps(node, props)
{
    node[internalPropsKey] = props;
}

export function markContainerAsRoot(hostRoot, node)
{
    node[internalContainerInstanceKey] = hostRoot;
}

export function unmarkContainerAsRoot(node)
{
    node[internalContainerInstanceKey] = null;
}

export function isContainerMarkedAsRoot(node)
{
    return !!node[internalContainerInstanceKey];
}
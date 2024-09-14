const randomKey = Math.random().toString(36).slice(2);
const internalContainerInstanceKey = '__onionContainer$' + randomKey;

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
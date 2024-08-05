export function resolveNodeFunction(node, funcName)
{
    if (!funcName)
        return null;

    while (node)
    {
        // Check in memoizedProps
        let props = node.memoizedProps;
        for (let key in props)
        {
            if (Object.prototype.hasOwnProperty.call(props, key))
            {
                const propValue = props[key];
                if (typeof propValue === 'function' && propValue.name === funcName)
                {
                    return propValue;
                }
                if (typeof propValue === 'string' && propValue === funcName)
                {
                    // Recursively check the parent node
                    return resolveNodeFunction(node.parent, funcName);
                }
            }
        }
        // Check in stateNode
        let stateNode = node.stateNode;
        if(stateNode)
        {
            // Ensure consistent handling of "bound " prefix
            const originalFuncName = funcName.replace(/^bound /, '');
            const boundFuncName = `bound ${originalFuncName}`;
        
            if (typeof stateNode[boundFuncName] === 'function')
            {
                return stateNode[boundFuncName];
            }
            if (typeof stateNode[originalFuncName] === 'function')
            {
                stateNode[boundFuncName] = stateNode[originalFuncName].bind(stateNode);
                return stateNode[boundFuncName];
            }
        }
        node = node.parent;
    }
    return null;
}
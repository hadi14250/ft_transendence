export function isValidNamePropsNode(node, propName)
{
    if (!node.memoizedProps)
        return false;
    
    const key = findKeyByValue(node.memoizedProps, propName);
    return !!(key && node.memoizedProps[key]);
}

function findKeyByValue(object, value)
{
    return Object.keys(object).find(key => object[key] === value);
}
export default function getComponentNameFromType(type)
{
    if (type == null)
        return null;
    if (typeof type === 'function')
        return type.displayName || type.name || null;
    if (typeof type === 'string')
        return type;
    if (typeof type === 'object')
    {
        if (typeof type.tag === 'number')
            console.error('Received an unexpected object in getComponentNameFromType() This is likely a bug in Onion. Please file an issue.');
        switch (type.$$typeof)
        {
            
        }
    }
    return null;
}
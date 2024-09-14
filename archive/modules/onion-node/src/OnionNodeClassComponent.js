let instanceId = 0; // Generate unique instance id

const generateId = () =>
{
    return instanceId += 1;
}
    
export function createClassComponent(node, className, props)
{
    const ComponentClass = window[className];
    if (!ComponentClass)
    {
        throw new Error(`Class ${className} not found, please make sure the class in registed in global-setup.js`);
    }
    
    let context = null;
    props["instanceId"] = generateId();
    
    const instance = new ComponentClass(props, context);
    instance.__onionInternals = node;
    
    return instance;
}
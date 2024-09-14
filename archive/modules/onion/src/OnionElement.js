import { ONION_ELEMENT_TYPE } from "../../onion-shared/OnionSymbols.js";
import { checkStringCoercion } from "../../onion-shared/CheckStringCoercion.js";

function getOwner() {
    //TODO: implement dispatcher to get owner
    return null;
}

function OnionElement(type, key, owner, props)
{
    return ({
        $$typeof: ONION_ELEMENT_TYPE,
        type,
        key,
        props,
        _owner: owner,
    });
}

export function createElement(type, config, children)
{
    if (!isValidElementType(type))
    {
        let info = '';
        if (type === undefined || (typeof type === 'object' && type !== null && Object.keys(type).length === 0))
            info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";

        let typeString;
        if (type === null)
            typeString = 'null';
        else if (Array.isArray(type))
            typeString = 'array';
        else if (type !== undefined && type.$$typeof === ONION_ELEMENT_TYPE)
        {
            typeString = `<className=${getComponentNameFromType(type.type) || 'Unknown'} />`;
            info = ' Did you accidentally export a html literal instead of a component?';
        }
        else
            typeString = typeof type;

        console.error(
            'Onion.createElement: type is invalid -- expected a string (for ' +
            'built-in components) or a class/function (for composite ' +
            'components) but got: %s.%s',
            typeString,
            info
        );
    }

    let propName;
    const props = {};
    let key = null;

    if (config != null)
    {
        if (hasValidKey(config))
        {
            checkStringCoercion('key', config.key);
            key = '' + config.key;
        }

        for (propName in config)
        {
            if (Object.prototype.hasOwnProperty.call(config, propName) &&
                // Skip over reserved prop names
                propName !== 'key' &&
                propName !== '__self' &&
                propName !== '__source')
            {
                if (propName === 'ref')
                    props.ref = coerceStringRef(config[propName], getOwner(), type);
                else
                    props[propName] = config[propName];
            }
        }
    }

    // Transfer children onto the newly allocated props object
    props.children = children;

    // Resolve default props
    if (type && type.defaultProps)
    {
        const defaultProps = type.defaultProps;
        for (propName in defaultProps)
        {
            if (props[propName] === undefined)
                props[propName] = defaultProps[propName];
        }
    }

    return OnionElement(type, key, getOwner(), props);
}

export function isValidElementType(object)
{
    return (typeof object === 'object' && object !== null && object.$$typeof === ONION_ELEMENT_TYPE);
}

function hasValidKey(config)
{
    if (Object.prototype.hasOwnProperty.call(config, 'key'))
    {
        const getter = Object.getOwnPropertyDescriptor(config, 'key').get;
        if (getter && getter.isOnionWarning)
            return false;
    }
    return config.key !== undefined;
}

function coerceStringRef(mixedRef, owner, type)
{ 
    let stringRef;
    if (typeof mixedRef === 'string')
      stringRef = mixedRef;
    else
    {
        if (typeof mixedRef === 'number' || typeof mixedRef === 'boolean')
        {
            checkStringCoercion('ref prop', mixedRef);
            stringRef = '' + mixedRef;
        }
        else
            return mixedRef;
    }
  
    const callback = stringRefAsCallbackRef.bind(null, stringRef, owner);
    // This is used to check whether two callback refs conceptually represent
    // the same string ref, and can therefore be reused by the reconciler. Needed
    // for backwards compatibility with old Meta code that relies on string refs
    // not being reattached on every render.
    callback.__stringRef = stringRef;
    callback.__type = type;
    callback.__owner = owner;
    return callback;
}

function stringRefAsCallbackRef(stringRef, owner, value)
{
    if (!owner) {
        throw new Error(
            `Element ref was specified as a string (${stringRef}) but no owner was set. This could happen` +
            " when adding a ref to a component that was not created inside a component's render method."
        );
    }

    const inst = owner.stateNode;
    if (!inst)
    {
        throw new Error(
            `Missing owner for string ref ${stringRef}. This error is likely caused by a ` +
            'bug in Onion. Please file an issue.',
        );
    }

    const refs = inst.refs;
    if (value === null)
        delete refs[stringRef];
    else
        refs[stringRef] = value;
}
import { ONION_ELEMENT_TYPE } from "../../shared/OnionSymbols.js";

export function createElement(element)
{
    if (typeof element === 'object' && element !== null)
    {
        element.$$typeof = ONION_ELEMENT_TYPE;
    }
    return element;
}

export function isValidElement(object)
{
    return (
        typeof object === 'object' &&
        object !== null &&
        object.$$typeof === ONION_ELEMENT_TYPE
    );
}
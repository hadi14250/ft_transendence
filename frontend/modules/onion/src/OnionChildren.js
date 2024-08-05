import { getElementsFromHTML } from "../../onion-dom/src/OnionDOMParser.js";

function mapIntoArray(children, array, callback)
{
    if (children == null)
        return array;

    children.forEach(child => {
        const elements = getElementsFromHTML(child);
        elements.forEach(element => {
            array.push(callback(element));
        });
    });

    return array;
}

function forEachChildren(children, forEachFunc, forEachContext)
{
    mapChildren(children, function() {
        forEachFunc.apply(this, arguments);
    }, forEachContext);
}

function countChildren(children)
{
    let n = 0;
    mapChildren(children, () => {
        n++;
    });
    return n;
}

function mapChildren(children, func, context)
{
    if (children == null)
        return children;

    const result = [];
    let count = 0;
    mapIntoArray(children, result, function(child) {
        return func.call(context, child, count++);
    });
    return result;
}

function toArray(children)
{
    return mapChildren(children, child => child) || [];
}

function combine(children)
{
    return children.join('');
}

export {
    forEachChildren as forEach,
    mapChildren as map,
    countChildren as count,
    toArray,
    combine
}
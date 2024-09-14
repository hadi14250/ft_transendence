import { isValidContainer } from "./OnionDOMContainer.js";
import { createNodeFromDOMElement } from "../../onion-node/src/OnionNode.js";

export function getNodeListFromHTML(htmlString)
{
    const domElements = parseHtmlString(htmlString);

    let nodeList = [];
    for (let index in domElements)
    {
        let domElement = domElements[index];
        let node = createNodeFromDOMElement(domElement);
        nodeList.push(node);
    }
    return nodeList;
}

function parseHtmlString(htmlString)
{
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const bodyContent = doc.body;

    let children = [];
    while (bodyContent.firstChild)
    {
        let element = bodyContent.firstChild;
        if (!isValidContainer(element))
            console.warn(`Unsupport or invalid element, skipped rendering for: ${element}`);
        else
            children.push(element);
        bodyContent.removeChild(element);
    }
    return children;
}
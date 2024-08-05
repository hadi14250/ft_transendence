import { isValidContainer } from "./OnionDOMContainer.js";
import { createNodeFromDOMElement } from "../../onion-node/src/OnionNode.js";
import { createElement } from "../../onion/index.js";
import { TEXT_NODE, COMMENT_NODE } from "../shared/HTMLNodeType.js";

export function getNodeListFromHTML(htmlString)
{
    if (!htmlString)
        return null;
    
    const domElements = getElementsFromHTML(htmlString, true);
    return getNodeListFromDOMElements(domElements, htmlString);
}

export function getNodeListFromDOMElements(elements, caseSensitiveString)
{
    let nodeList = [];
    for (let i= 0; i < elements.length; i++)
    {
        let domElement = elements[i];
        if (isValidDOMElement(domElement))
        {
            let node = createNodeFromDOMElement(domElement, caseSensitiveString);
            nodeList.push(node);
        }
    }
    return nodeList;
}

export function getElementsFromHTML(htmlString, addStylesheet)
{
    let cleanedHtml = removeWhitespaceBetweenTags(htmlString);
    return parseHtmlString(cleanedHtml, addStylesheet);
}

function removeWhitespaceBetweenTags(html) {
    // Regular expression to match whitespace between HTML tags
    const pattern = />\s+</g;
    
    // Replaces the whitespace between tags with a single "><"
    let cleanedHtml = html.replace(pattern, '><');
    
    // Trim whitespace from the start and end of the string
    cleanedHtml = cleanedHtml.trim();
    
    return cleanedHtml;
}

function parseHtmlString(htmlString, addStylesheet)
{
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const bodyContent = doc.body;

    // Find all link elements in the parsed document
    const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');

    if (addStylesheet)
    {
        linkElements.forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if the stylesheet already exists in the current document
            const isStylesheetAlreadyPresent = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                .some(existingLink => existingLink.getAttribute('href') === href);
            
            // Append the link element if it doesn't already exist
            if (!isStylesheetAlreadyPresent) {
                document.head.appendChild(link.cloneNode(true));
            }
        });
    }

    let children = [];
    while (bodyContent.firstChild)
    {
        let element = bodyContent.firstChild;
        if (isValidDOMElement(element))
        {
            let onionElement = createElement(element);
            children.push(onionElement);
        }
        bodyContent.removeChild(element);
    }
    return children;
}

export function isValidDOMElement(node)
{
    return (node && (isValidContainer(node) ||
        node.nodeType === TEXT_NODE ||
        node.nodeType === COMMENT_NODE
    ));
}
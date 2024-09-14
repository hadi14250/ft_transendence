import { ELEMENT_NODE, COMMENT_NODE, DOCUMENT_NODE, DOCUMENT_FRAGMENT_NODE } from "../shared/HTMLNodeType.js";

export function isValidContainer(node)
{
    return (node && (node.nodeType === ELEMENT_NODE ||
        node.nodeType === COMMENT_NODE ||
        node.nodeType === DOCUMENT_NODE ||
        node.nodeType === DOCUMENT_FRAGMENT_NODE
    ));
}
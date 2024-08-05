import { TEXT_NODE } from "../../onion-dom/shared/HTMLNodeType.js";

let instanceId = 0; // Generate unique instance id

const generateId = () =>
{
    return instanceId += 1;
}
    
export function createClassComponent(className, options)
{
    const ComponentClass = window[className];
    if (!ComponentClass)
    {
        throw new Error(`Class ${className} not found, please make sure the class in registed in global-setup.js`);
    }

    let children = getChildrenOuterHTML(options.children);
    children = restoreCase(options.htmlString, children);
    
    let context = {};
    let props = {instanceId: generateId(), children: children};
    
    const instance = new ComponentClass(props, context);
    instance.props = Object.assign({}, instance.props || {}, props || {});
    instance.outerHTML = options.element.outerHTML;
    
    return instance;
}

function getChildrenOuterHTML(children)
{
    return Array.from(children, element => 
        element.nodeType === TEXT_NODE ? element.textContent : element.outerHTML
    );
}

function restoreCase(originalStr, lowerCaseArr) {
    // Extract all tags from the original string, including quotes
    const originalTokens = originalStr.match(/<[^>]+>/g);
    if (!originalTokens) return lowerCaseArr;

    // console.log("Original Tokens:", originalTokens);

    // Create a map of lower-cased tokens to original tokens
    const tokenMap = new Map();
    originalTokens.forEach(token => {
        tokenMap.set(normalizeToken(token), token);
    });

    // console.log("Token Map:", Array.from(tokenMap.entries()));

    return lowerCaseArr.map(lowerCaseStr => {
        let restoredStr = lowerCaseStr;
        const lowerCaseTokens = lowerCaseStr.match(/<[^>]+>/g);

        if (!lowerCaseTokens) return restoredStr;

        // console.log("Lower Case Tokens:", lowerCaseTokens);

        // Match lower case tokens with original tokens in sequence
        lowerCaseTokens.forEach(token => {
            const normalizedToken = normalizeToken(token);
            if (tokenMap.has(normalizedToken)) {
                const correctCaseToken = tokenMap.get(normalizedToken);
                // console.log(`Replacing lower case token "${token}" with correct case token "${correctCaseToken}"`);

                // Use a global regex to replace all occurrences of the token
                const regex = new RegExp(escapeRegExp(token), 'g');
                restoredStr = restoredStr.replace(regex, correctCaseToken);
            }
            // else
            // {
            //     console.log(`No match found for lower case token "${token}"`);
            // }
        });

        return restoredStr;
    });
}

// Normalize token by removing quotes and making it lower case
function normalizeToken(token) {
    return token.toLowerCase().replace(/['"]/g, '');
}

// Helper function to escape special characters for regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
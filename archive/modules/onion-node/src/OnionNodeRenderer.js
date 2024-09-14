import { ClassComponent, HostComponent } from "../shared/OnionNodeTags.js";
import { processUpdateQueue } from "./OnionNodeUpdateQueue.js";

export function renderUpdateOnNode(root, node)
{
    console.log(root);
    processUpdateQueue(node, null, null);
    renderUpdateQueue(root, node);
}

function renderUpdateQueue(root, node)
{
    console.log(node);
    let baseState = node.updateQueue.baseState;
    if (!baseState)
        return;

    for (let index in baseState.element)
    {
        let element = baseState.element[index];
        if (element.tag == ClassComponent)
        {
            let renderText = element.stateNode.render();
            console.log(renderText);
            root.containerInfo.appendChild(element.stateNode);
        }
        else if (element.tag == HostComponent)
        {
            if (element.parent != null)
            {
                
            }
            root.containerInfo.appendChild(element.stateNode);
        }
        else
        {
            console.error(
                'Tag not support %s',
                element.tag,
            );
        }
    }
}
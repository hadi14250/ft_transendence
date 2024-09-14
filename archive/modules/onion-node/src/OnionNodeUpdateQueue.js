import { HostRoot } from "../shared/OnionNodeTags.js";

export const UpdateState = 0;
export const ForceUpdate = 2;

let hasForceUpdate = false;
let didWarnUpdateInsideUpdate = false;
let currentlyProcessingQueue = null;

export let resetCurrentlyProcessingQueue = () =>
{
    currentlyProcessingQueue = null;
}

export function initializeUpdateQueue(node)
{
    const queue = {
        baseState: node.memoizedState,
        baseUpdate: null,
        shared: {
            pending: null,
        },
        callbacks: null,
    };
    node.updateQueue = queue;
}

export function createUpdate()
{
    const update = {
  
      tag: UpdateState,
      payload: null,
      callback: null,
  
      next: null,
    };
    return update;
}

export function enqueueUpdate(node, update)
{
    const updateQueue = node.updateQueue;
    if (updateQueue === null) // Only occurs if the node has been unmounted.
        return null;

    const sharedQueue = updateQueue.shared;

    if (currentlyProcessingQueue === sharedQueue && !didWarnUpdateInsideUpdate)
    {
        const componentName = node.elementType;
        console.error(
            'An update (setState, replaceState, or forceUpdate) was scheduled ' +
              'from inside an update function. Update functions should be pure, ' +
              'with zero side-effects. Consider using componentDidUpdate or a ' +
              'callback.\n\nPlease update the following component: %s',
            componentName,
        );
        didWarnUpdateInsideUpdate = true;
    }

    const pending = sharedQueue.pending;
    if (pending === null) // This is the first update. Create a circular list.
      update.next = update;
    else
    {
      update.next = pending.next;
      pending.next = update;
    }
    sharedQueue.pending = update;

    return getRootForUpdateNode(node);
}

function getRootForUpdateNode(sourceNode)
{
    let node = sourceNode;
    let parent = node.parent;
    while (parent !== null)
    {
        node = parent;
        parent = node.parent;
    }
    return node.tag === HostRoot ? node.stateNode : null;
}

export function processUpdateQueue(node, props, instance)
{
    const queue = node.updateQueue;

    hasForceUpdate = false;
    currentlyProcessingQueue = queue.shared;

    let baseUpdate = queue.baseUpdate;

    // Check if there are pending updates. If so, transfer them to the base queue.
    let pendingQueue = queue.shared.pending;
    if (pendingQueue !== null)
    {
        queue.shared.pending = null;

        // The pending queue is circular. Disconnect the pointer between first
        // and last so that it's non-circular.
        const lastPendingUpdate = pendingQueue;
        const firstPendingUpdate = lastPendingUpdate.next;
        lastPendingUpdate.next = null;

        // Append pending updates to base queue
        if (baseUpdate === null)
            baseUpdate = firstPendingUpdate;
        else
            baseUpdate.next = firstPendingUpdate;
        baseUpdate = lastPendingUpdate;
    }

    if (baseUpdate !== null)
    {
        let newState = queue.baseState;
        let update = baseUpdate;
        do
        {
            // Process this update.
            newState = getStateFromUpdate(update, newState, props, instance);
            const callback = update.callback;
            if (callback !== null)
            {
                const callbacks = queue.callbacks;
                if (callbacks === null)
                  queue.callbacks = [callback];
                else
                  callbacks.push(callback);
            }

            // We bail out when we get a null
            update = update.next;
            if (update === null)
            {
                pendingQueue = queue.shared.pending;
                if (pendingQueue === null)
                    break;
                else
                {
                    const lastPendingUpdate = pendingQueue;
                    const firstPendingUpdate = lastPendingUpdate.next;
                    lastPendingUpdate.next = null;
                    update = firstPendingUpdate;
                    queue.baseUpdate = lastPendingUpdate;
                    queue.shared.pending = null;
                }
            }
        } while (true);

        queue.baseState = newState;
        node.memoizedState = newState;
    }

    currentlyProcessingQueue = null;
}

function getStateFromUpdate(update, prevState, nextProps, instance)
{
    switch (update.tag)
    {
        case UpdateState:
        {
            const payload = update.payload;
            let partialState;
            if (typeof payload === 'function')
                partialState = payload.call(instance, prevState, nextProps);
            else
                partialState = payload;
            if (partialState === null || partialState === undefined)
                return prevState;
            return Object.assign({}, prevState, partialState);
        }
        case ForceUpdate:
        {
            hasForceUpdate = true;
            return prevState;
        }
    }
    return prevState;
}

export function resetHasForceUpdateBeforeProcessing()
{
    hasForceUpdate = false;
}
  
export function checkHasForceUpdateAfterProcessing()
{
    return hasForceUpdate;
}
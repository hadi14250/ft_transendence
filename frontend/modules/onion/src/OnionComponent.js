function Component(props, context)
{
    this.props = props;
    this.context = context;
}

//Mount Phase
Component.prototype.onMount = function()
{
    //console.log(`${this.__onionInternals.parent.type}.${this.__onionInternals.type} mounted`);
};

//Update Phase
Component.prototype.shouldComponentUpdate = function(nextProps, nextState)
{
    return true;
};

Component.prototype.onPreUpdate = function(prevProps, prevState){};

Component.prototype.render = function(){};

Component.prototype.onUpdate = function(prevProps, prevState)
{
    //console.log(`${this.__onionInternals.parent.type}.${this.__onionInternals.type} updated`);
};

//Unmount Phase
Component.prototype.onUnmount = function()
{
    //console.log(`${this.__onionInternals.parent.type}.${this.__onionInternals.type} unmounted`);
};

//Hooks
Component.prototype.setState = function (partialState, callback)
{
    if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState != null)
        throw new Error('takes an object of state variables to update or a function which returns an object of state variables.');

    const onStateChangeEvent = new CustomEvent('component.stateChange', {
        detail: {
            instance: this,
            state: partialState,
            callback: callback
        }
    });

    document.dispatchEvent(onStateChangeEvent);
};

Component.prototype.forceUpdate = function (callback)
{
    const onStateChangeEvent = new CustomEvent('component.stateChange', {
        detail: {
            instance: this,
            state: { __forceUpdate: true },
            callback: callback
        }
    });
    document.dispatchEvent(onStateChangeEvent);
}

export { Component };
import { ONION_CONSUMER_TYPE, ONION_PROVIDER_TYPE, ONION_CONTEXT_TYPE } from "../../shared/OnionSymbols.js";

export function createContext(defaultValue)
{
    const context = {
        $$typeof: ONION_CONTEXT_TYPE,
        _currentValue: defaultValue,
        Provider: null,
        Consumer: null
    };

    context.Provider = {
        $$typeof: ONION_PROVIDER_TYPE,
        _context: context,
    };
    const Consumer = {
        $$typeof: ONION_CONSUMER_TYPE,
        _context: context,
    };
    Object.defineProperties(Consumer, {
        Provider: {
            get()
            {
              return context.Provider;
            },
            set(_Provider)
            {
              context.Provider = _Provider;
            },
        },
        _currentValue: {
            get()
            {
              return context._currentValue;
            },
            set(_currentValue)
            {
              context._currentValue = _currentValue;
            },
        },
        Consumer: {
            get()
            {
              return context.Consumer;
            },
        },
    });
    context.Consumer = Consumer;
    
    return context;
}
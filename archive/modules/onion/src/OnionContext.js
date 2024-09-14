export function createContext(defaultValue)
{
    const context = {
        _currentValue: defaultValue
    };
    return context;
}
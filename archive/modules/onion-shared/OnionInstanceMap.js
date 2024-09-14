export function remove(key)
{
    key.__onionInternals = undefined;
}

export function get(key)
{
    return key.__onionInternals;
}

export function has(key)
{
    return key.__onionInternals !== undefined;
}

export function set(key, value)
{
    key.__onionInternals = value;
}
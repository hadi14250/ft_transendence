function typeName(value)
{
    const hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    return (hasToStringTag && value[Symbol.toStringTag]) || value.constructor.name || 'Object';
}

function willCoercionThrow(value)
{
    try
    {
        testStringCoercion(value);
        return false;
    }
    catch (e)
    {
        return true;
    }
}

function testStringCoercion(value)
{
    return '' + value;
}

export function checkStringCoercion(name, value)
{
    if (willCoercionThrow(value))
    {
        console.error(
            'The provided %s is an unsupported type %s.' +
            ' This value must be coerced to a string before using it here.',
            name,
            typeName(value),
        );
        return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
}
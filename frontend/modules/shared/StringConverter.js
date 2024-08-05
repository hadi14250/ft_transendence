export function convertStringToType(value)
{
    // Trim the value to avoid issues with leading/trailing spaces
    let trimValue = value.trim();

    // Check if the value is a number
    if (!isNaN(trimValue) && value !== '')
	{
        return parseFloat(trimValue);
    }
    
    // Check if the value is a boolean
    if (trimValue.toLowerCase() === 'true')
	{
        return true;
    }
	if (trimValue.toLowerCase() === 'false')
	{
        return false;
    }

    // Check if the value is a JSON object or array
    if ((trimValue.startsWith('{') && trimValue.endsWith('}')) || (trimValue.startsWith('[') && trimValue.endsWith(']'))) {
        try {
            return JSON.parse(trimValue);
        } catch (e) {
            // Do nothing if parsing fails, it will return the original string
        }
    }
    
    // If none of the above, return the original value as a string
	return value;
}
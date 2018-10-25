const memoize = fn => {
    const cache = {};
    return (...args) => {
        const strigyfiedArgs = JSON.stringify(args);
        const result = cache[strigyfiedArgs] = cache[strigyfiedArgs] || fn(...args);
        // if no configuration is passed to validator it will call it imidiatelly
        if (typeof args[0] !== 'object') {return result();}

        return result;
    };
};

const stringValidator = memoize(({ message } = { message: 'Field value has to be string' }) =>
    value => !value ? undefined : typeof value === 'string' ? undefined : message);
const booleanValidator = memoize(({ message } = { message: 'Field value has to be boolean' }) =>
    value => !value ? undefined : typeof value === 'boolean' ? undefined : value === 'true' || value === 'false' ? undefined : message);

export const patternValidator = memoize(({
    pattern = /^.*&/,
    message = 'Value must match pattern',
    showPattern = true
} = {
    pattern: /^.*&/,
    message: 'Value must match pattern',
    showPattern: true
}) => {
    let verifiedPattern = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return value =>
        !value ? undefined : value.toString().match(verifiedPattern)
            ? undefined
            : `${message}${showPattern ? `: ${pattern.toString()}` : ''}`;
});

export const dataTypeValidator = type => ({
    string: options => stringValidator({ message: 'Field value has to be string', ...options }),
    integer: options => patternValidator({ pattern: /^\d*$/, message: 'Value must be integer', ...options, showPattern: false }),
    boolean: options => booleanValidator({ message: 'Field value has to be boolean', ...options }),
    number: options => patternValidator({ pattern: /^\d*[.]{0,1}\d*$/, message: 'Values mut be number', ...options, showPattern: false })
})[type];

export const required = memoize(({ message } = { message: 'Required' }) => value => value && value.length > 0 ? undefined : message);

export const minLength = memoize(({ treshold } = { treshold: 1 }) =>
    value => !value ? undefined : value.length >= treshold
        ? undefined
        : `Should be atleast ${treshold} long`);

export const minValue = memoize(({ message = 'Should be greater or equal to:', value } = { message: 'Should be greater or equal to:' }) =>
    number => !number ? undefined : number >= value ? undefined : `${message} ${value}`);

export const maxValue = memoize(({ message = 'Should be less or equal to:', value } = { message: 'Should be less or equal to:' }) =>
    number => !number ? undefined : number <= value ? undefined : `${message} ${value}`);

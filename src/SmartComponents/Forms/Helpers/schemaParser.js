/**Fields component placeholders */
const TEXT_FIELD = 'text-field';
const TEXTAREA_FIELD = 'textarea-field';
const FIELD_ARRAY = 'field-array';
const SELECT_COMPONENT = 'select-field';
const FIXED_LIST = 'fixed-list';
const CHECKBOX = 'checkbox-field';
const SUB_FORM = 'sub-form';
const RADIO = 'radio-field';

/**Validator functions placeholder */
const REQUIRED = 'required-validator';
const MIN_LENGTH = 'min-length-validator';
const MIN_ITEMS_VALIDATOR = 'min-items-validator';
const MIN_NUMBER_VALUE = 'min-number-value';
const MAX_NUMBER_VALUE = 'max-number-value';

let autofocusField = undefined;
let definitions = undefined;
let defaultValues = {};

const validatorBuilder = ({ schema, fields = {}, key }) => {
    const result = [];
    if (schema.required && schema.required.includes(key)) {
        result.push({ type: REQUIRED });
    }

    if (fields[key] && fields[key].minLength) {
        result.push({ type: MIN_LENGTH, treshold: fields[key].minLength });
        delete fields[key].minLength;
    }

    if (schema.minItems) {
        result.push({ type: MIN_ITEMS_VALIDATOR, treshold: schema.minItems });
    }

    return result;
};

const componentMapper = (type, dataType) => ({
    string: { component: TEXT_FIELD, type: 'text', dataType },
    color: { component: TEXT_FIELD, type: 'color', dataType },
    hidden: { component: TEXT_FIELD, type: 'hidden', dataType },
    tel: { component: TEXT_FIELD, type: 'tel', dataType },
    email: { component: TEXT_FIELD, type: 'email', dataType },
    password: { component: TEXT_FIELD, type: 'password', dataType },
    integer: { component: TEXT_FIELD, type: 'number', step: 1, dataType },
    updown: { component: TEXT_FIELD, type: 'number', dataType },
    number: { component: TEXT_FIELD, type: 'number', dataType },
    range: { component: TEXT_FIELD, type: 'range', dataType },
    textarea: { component: TEXTAREA_FIELD, dataType },
    select: { component: SELECT_COMPONENT, dataType },
    boolean: { component: CHECKBOX, type: 'checkbox', dataType },
    checkbox: { component: CHECKBOX, type: 'checkbox', dataType },
    checkboxes: { component: CHECKBOX, type: 'checkbox', dataType },
    radio: { component: RADIO, type: 'radio', dataType }
})[type];

const createFieldOptions = (options = {}) => {
    const result = {};
    const uiOption = options['ui:options'] || {};
    if (options['ui:disabled']) {
        result.isDisabled = true;
    }

    if (options['ui:readonly']) {
        result.isReadOnly = true;
    }

    if (uiOption.inline) {
        result.inline = true;
    }

    if (uiOption.rows) {
        result.rows = uiOption.rows;
    }

    return result;
};

/**create fields from object */
const createFieldsFromObject = (schema, uiSchema) => Object.keys(schema.properties).map(key => {
    const fields = schema.properties;
    /**
     * redirect to definitions if fielas have external definition
     */
    if (fields[key].items && fields[key].items.$ref) {
        const definition = definitions[fields[key].items.$ref.split('#/definitions/').pop()];
        const field = { ...fields[key] };
        delete fields[key].items.$ref;
        return convertSchema(
            {
                ...field,
                items: definition
            },
            uiSchema[key],
            key
        );
    } else if (fields[key] && fields[key].$ref) {
        const definition = definitions[fields[key].$ref.split('#/definitions/').pop()];
        delete fields[key].$ref;
        return createFieldsFromObject({
            properties: { [key]: { ...fields[key], ...definition }}
        }, uiSchema).pop();

    }

    if (fields[key].type === 'array' && fields[key].items && fields[key].items.type === 'object') {
        return {
            title: fields[key].title,
            component: SUB_FORM,
            ...convertSchema({ ...fields[key] }, uiSchema[key], key)
        };
    } else if (fields[key].type === 'array' && Array.isArray(fields[key].items) && fields[key].additionalItems) {
        return {
            title: fields[key].title,
            component: FIXED_LIST,
            ...convertSchema(
                { ...fields[key], type: 'array', items: fields[key].items, additionalItems: fields[key].additionalItems },
                uiSchema[key], key
            )
        };
    } else if (fields[key].type === 'array' && fields[key].items && typeof fields[key].items === 'object') {
        return {
            ...convertSchema(
                { ...fields[key], items: fields[key].items, type: 'array', title: fields[key].title },
                uiSchema[key],
                key
            )
        };
    } else if (fields[key].properties && typeof fields[key].properties === 'object') {
        return {
            name: key,
            title: uiSchema[key] && uiSchema[key]['ui:title'] || fields[key].title,
            component: SUB_FORM,
            autofocus: autofocusField === key,
            validate: validatorBuilder({ schema, fields, key }),
            description: uiSchema[key] && uiSchema[key]['ui:description'],
            helperText: uiSchema[key] && uiSchema[key]['ui:help'],
            ...convertSchema({
                properties: fields[key].properties,
                type: 'object'
            },  uiSchema[key], key)
        };
    }

    const field = {
        name: key,
        label: uiSchema[key] && uiSchema[key]['ui:title'] || fields[key].title,
        autofocus: autofocusField === key,
        validate: validatorBuilder({ schema, fields, key }),
        description: uiSchema[key] && uiSchema[key]['ui:description'],
        helperText: uiSchema[key] && uiSchema[key]['ui:help'],
        ...fields[key],
        ...componentMapper(
            (uiSchema[key] && uiSchema[key]['ui:widget'])
            || (uiSchema[key] && uiSchema[key]['ui:options'] && uiSchema[key]['ui:options'].inputType)
            || fields[key].enum && 'select' || fields[key].type, fields[key].type
        ),
        ...createFieldOptions(uiSchema[key])
    };

    if (field.dataType === 'number' || field.dataType === 'integer') {
        if (field.minimum) {
            field.validate = [ ...field.validate, {
                type: MIN_NUMBER_VALUE,
                value: field.minimum
            }];
            delete field.minimum;
        }

        if (field.maximum) {
            field.validate = [ ...field.validate, {
                type: MAX_NUMBER_VALUE,
                value: field.maximum
            }];
            delete field.maximum;
        }

        if (field.multipleOf) {
            field.step = field.multipleOf;
            delete field.multipleOf;
        }
    }

    if (field.hasOwnProperty('enum')) {
        // TODO determine enum option object
    }

    if (field.component === SELECT_COMPONENT) {
        if (!field.enum) {
            field.enum = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
            field.options = [ ...field.enum ];
        } else {
            field.options = field.enum.map((item, index) => ({
                value: item,
                label: field.enumNames && field.enumNames[index] || item
            }));
        }

        field.options.unshift({
            label: 'Please Choose',
            disabled: true
        });
        delete field.enum;
        delete field.enumNames;
    }

    // FIX ME should be replaced by proper options mapper after the format is known
    if (field.enum) {
        if (field.component === SELECT_COMPONENT) {
            console.log('select');
        } else {
            field.options = field.enum;
            delete field.enum;
        }
    }

    return field;
});

const convertSchema = (schema, uiSchema = {}, key) => {
    let result = {};
    const meta = {};
    if (schema.definitions) {
        definitions = schema.definitions;
    }

    if (schema.title) {
        meta.title = schema.title;
    }

    if (schema.description) {
        meta.description = schema.description;
    }

    if (schema.type === 'array') {
        let nestedSchema = {};
        /**
         * Nested schema
         */
        if (schema.items && schema.items.type === 'object') {
            meta.title = schema.title;
            nestedSchema = convertSchema(schema.items, uiSchema.items, key);
            nestedSchema.validate = validatorBuilder({ schema, fields: schema.items.properties, key });
            nestedSchema.component = FIELD_ARRAY;
        /**
         * Multiple choice list
         */
        } else if (schema.items && schema.items.enum) {
            nestedSchema = {
                ...componentMapper(uiSchema['ui:widget'] || schema.items.type, schema.items.type),
                validate: validatorBuilder({ schema, key }),
                options: schema.items.enum
            };
        } else if (schema.items && Array.isArray(schema.items) && schema.additionalItems) {
            nestedSchema.fields = [
                ...schema.items.map(({ type, title, ...rest }, index) => {
                    const options = rest;
                    if (type === 'boolean') {
                        if (!(!rest.enum && uiSchema.items && !uiSchema.items[index] || !rest.enum && !uiSchema.items)) {
                            options.options = rest.enum || uiSchema.items && uiSchema.items[index]['ui:widget'] === 'select' ? [{
                                label: 'Please Choose',
                                value: undefined,
                                disabled: true
                            }, { label: 'Yes', value: true }, { label: 'No', value: false }] : [ 'Yes', 'No' ];
                        }
                    }

                    return {
                        validate: validatorBuilder({ schema, key: `${key}.items` }),
                        label: title,
                        name: `${key}.items.${index}`,
                        ...componentMapper(uiSchema.items && uiSchema.items[index]['ui:widget'] || type, type),
                        ...options
                    };
                })
            ];
            nestedSchema.additionalItems = convertSchema(
                { type: 'array', items: schema.additionalItems },
                { items: uiSchema.additionalItems }, `${key}.additionalItems`
            );
            nestedSchema.component = FIXED_LIST;
        } else if (schema.items && typeof schema.items === 'object' && schema.items.type === 'array') {
            nestedSchema.component = FIELD_ARRAY;
            nestedSchema.fields = [ convertSchema({
                ...schema.items
            }, uiSchema && uiSchema.items, `${key}.items`) ];
        } else if (schema.items && typeof schema.items === 'object') {
            nestedSchema.component = FIELD_ARRAY;
            nestedSchema.validate = validatorBuilder({ schema, fields: schema.items, key: `${key}` }),
            nestedSchema.fields = [{
                label: schema.items.title,
                ...componentMapper(uiSchema.items && uiSchema.items['ui:widget'] || schema.items.type, schema.items.type),
                validate: validatorBuilder({ schema: schema.items, fields: schema.items, key: `${key}.items` })
            }];
        }

        return {
            ...meta,
            ...nestedSchema,
            ...result,
            key
        };
    }

    if (schema.type === 'object') {
        autofocusField = Object.keys(uiSchema).filter(key => uiSchema[key] && uiSchema[key]['ui:autofocus']).pop();
        result.fields = createFieldsFromObject(schema, uiSchema, key);
        return {
            ...meta,
            ...result,
            key
        };
    }
};

const orderSchema = (schema, order) => {
    let orderedSchema = schema;
    let orderedProperties = {};
    const initialOrder = Object.keys(schema.properties);
    const endingIndex = order.indexOf('*');

    const startingFields = [ ...order.slice(0, endingIndex) ];
    const endingFields = [ ...order.slice(endingIndex + 1) ];
    const unOrdered = initialOrder.filter(item => !order.find(orderedItem => item === orderedItem));
    /**
     * Order starting fields
     */
    startingFields.forEach(fieldKey => {
        orderedProperties[fieldKey] = schema.properties[fieldKey];
    });
    /**
     * Insert unurdered fields into middle
     */
    unOrdered.forEach(fieldKey => {
        orderedProperties[fieldKey] = schema.properties[fieldKey];
    });
    /**
     * append ending fields to the end
     */
    endingFields.forEach(fieldKey => {
        orderedProperties[fieldKey] = schema.properties[fieldKey];
    });

    return { ...orderedSchema, properties: { ...orderedProperties }};
};

const initialize = (schema, uiSchema) => {
    autofocusField = undefined;
    definitions = undefined;
    defaultValues = {};
    let inputSchema = schema;
    if (uiSchema['ui:order']) {
        inputSchema = orderSchema(schema, uiSchema['ui:order']);
    }

    return convertSchema(inputSchema, uiSchema);
};

export default initialize;

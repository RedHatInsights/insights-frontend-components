/**Fields component placeholders */
const TEXT_FIELD = 'text-field';
const TEXTAREA_FIELD = 'textarea-field';
const FIELD_ARRAY = 'field-array';
const CHOICES = 'choices-component';
const SELECT_COMPONENT = 'select-component';
const FIXED_LIST = 'fixed-list';
const CHECKBOX = 'checkbox';

/**Validator functions placeholder */
const REQUIRED = 'required-validator';
const MIN_LENGTH = 'min-length-validator';

let autofocusField = undefined;

const validatorBuilder = ({ schema, fields, key }) => {
    const result = [];
    if (schema.required && schema.required.includes(key)) {
        result.push({ type: REQUIRED });
    }

    if (fields[key].minLength) {
        result.push({ type: MIN_LENGTH, treshold: fields[key].minLength });
    }

    return result;
};

const componentMapper = type => ({
    string: { component: TEXT_FIELD, type: 'text' },
    tel: { component: TEXT_FIELD, type: 'tel' },
    password: { component: TEXT_FIELD, type: 'password' },
    integer: { component: TEXT_FIELD, type: 'number' },
    updown: { component: TEXT_FIELD, type: 'number' },
    textarea: { component: TEXTAREA_FIELD },
    choices: { component: CHOICES },
    select: { component: SELECT_COMPONENT },
    boolean: { component: CHECKBOX, type: 'checkbox' }
})[type];

/**create fields from object */
const createFieldsFromObject = (schema, uiSchema) => Object.keys(schema.properties).map(key => {
    const fields = schema.properties;
    if (fields[key].type === 'array') {
        console.log('should not build other fields', fields[key]);
        return convertSchema(fields[key].items, uiSchema[key], key);
    }

    return {
        name: key,
        label: fields[key].title,
        autofocus: autofocusField === key,
        validate: validatorBuilder({ schema, fields, key }),
        description: uiSchema[key] && uiSchema[key]['ui:description'],
        helperText: uiSchema[key] && uiSchema[key]['ui:help'],
        ...componentMapper(
            (uiSchema[key] && uiSchema[key]['ui:widget'])
            || (uiSchema[key] && uiSchema[key]['ui:options'] && uiSchema[key]['ui:options'].inputType)
            || fields[key].type
        )
    };
});

const widgetMapper = type => ({
    checkboxes: 'choices'
})[type];

const choiceMapper = type => ({
    checkboxes: 'checkbox'
})[type];

const convertSchema = (schema, uiSchema = {}, key = 'root') => {
    let result = {};
    const meta = { title: schema.title, description: schema.description };

    if (schema.type === 'array') {
        let nestedSchema = {};
        if (schema.items && schema.items.type === 'object') {
            console.log('nested object');
            nestedSchema = convertSchema(schema.items, uiSchema.items);
            nestedSchema.component = FIELD_ARRAY;
        } else if (schema.items && schema.items.enum) {
            nestedSchema = {
                ...componentMapper(widgetMapper(uiSchema['ui:widget']) || schema.items.type),
                options: schema.items.enum,
                type: choiceMapper(uiSchema['ui:widget'])
            };
        } else if (schema.items && Array.isArray(schema.items) && schema.additionalItems) {
            nestedSchema.fields = [
                ...schema.items.map(({ type, title, ...rest }, index) => {
                    const options = rest;
                    if (type === 'boolean') {
                        options.options = rest.enum || uiSchema.items && uiSchema.items[index]['ui:widget'] === 'select' ? [{
                            label: 'Please Choose',
                            value: undefined,
                            disabled: true
                        }, { label: 'Yes', value: true }, { label: 'No', value: false }] : [ 'Yes', 'No' ];
                    }

                    return {
                        name: `${key}.items.${index}`,
                        ...componentMapper(uiSchema.items && uiSchema.items[index]['ui:widget'] || type),
                        ...options
                    };
                })
            ];
            nestedSchema.additionalItems = convertSchema({ type: 'array', items: schema.additionalItems }, { items: uiSchema.additionalItems }, `${key}.additionalItems`);
            nestedSchema.component = FIXED_LIST;
        } else if (schema.items && typeof schema.items === 'object') {
            nestedSchema.component = FIELD_ARRAY;
            nestedSchema.fields = [{ ...componentMapper(uiSchema.items && uiSchema.items['ui:widget'] || schema.items.type) }];
        }

        return {
            ...nestedSchema,
            ...result,
            ...meta,
            key
        };
    }

    if (schema.type === 'object') {
        autofocusField = Object.keys(uiSchema).filter(key => uiSchema[key] && uiSchema[key]['ui:autofocus']).pop();
        console.log('non-nested: ', schema, key);
        result.fields = createFieldsFromObject(schema, uiSchema);
        return {
            ...result,
            ...meta,
            key
        };
    }
};

export default convertSchema;

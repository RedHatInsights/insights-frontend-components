export const simpleSchemaResult = {
    title: 'A registration form',
    description: 'A simple form example.',
    fields: [{
        name: 'firstName',
        label: 'First name',
        title: 'First name',
        component: 'text-field',
        type: 'text',
        autofocus: true,
        validate: [{
            type: 'required-validator'
        }]
    }, {
        name: 'lastName',
        component: 'text-field',
        label: 'Last name',
        title: 'Last name',
        validate: [{
            type: 'required-validator'
        }],
        type: 'text',
        autofocus: false
    }, {
        name: 'age',
        label: 'Age of person',
        title: 'Age',
        description: '(earthian year)',
        component: 'text-field',
        type: 'number',
        autofocus: false,
        validate: []
    }, {
        name: 'bio',
        component: 'textarea-field',
        label: 'Bio',
        title: 'Bio',
        autofocus: false,
        validate: [],
        type: 'string'
    }, {
        name: 'password',
        label: 'Password',
        title: 'Password',
        component: 'text-field',
        type: 'password',
        autofocus: false,
        minLength: 3,
        helperText: 'Hint: Make it strong!',
        validate: [{
            type: 'min-length-validator',
            treshold: 3
        }]
    }, {
        name: 'telephone',
        label: 'Telephone',
        title: 'Telephone',
        minLength: 10,
        autofocus: false,
        component: 'text-field',
        type: 'tel',
        validate: [{
            type: 'min-length-validator',
            treshold: 10
        }]
    }]
};

export const nestedSchemaResult = {
    title: 'A list of tasks',
    fields: [{
        name: 'title',
        autofocus: false,
        validate: [{
            type: 'required-validator'
        }],
        label: 'Task list title',
        title: 'Task list title',
        component: 'text-field',
        type: 'text'
    }, {
        component: 'field-array',
        validate: [],
        title: 'Tasks',
        key: 'tasks',
        fields: [{
            name: 'title',
            label: 'Title',
            title: 'Title',
            type: 'text',
            description: 'A sample title',
            component: 'text-field',
            validate: [{
                type: 'required-validator'
            }],
            autofocus: false
        }, {
            name: 'details',
            label: 'Task details',
            title: 'Task details',
            description: 'Enter the task details',
            component: 'textarea-field',
            type: 'string',
            validate: [],
            autofocus: false
        }, {
            name: 'done',
            label: 'Done?',
            title: 'Done?',
            default: false,
            component: 'checkbox',
            type: 'checkbox',
            autofocus: false,
            validate: []
        }]
    }]
};

export const arraySchemaResult = {
    fields: [{
        title: 'A list of strings',
        key: 'listOfStrings',
        component: 'field-array',
        validate: [],
        fields: [{
            component: 'text-field',
            type: 'text',
            validate: []
        }]
    }, {
        key: 'multipleChoicesList',
        title: 'A multiple choices list',
        component: 'choices-component',
        validate: [],
        options: [
            'foo',
            'bar',
            'fuzz',
            'qux'
        ],
        type: 'checkbox'
    }, {
        key: 'fixedItemsList',
        title: 'A list of fixed items',
        component: 'fixed-list',
        fields: [{
            name: 'fixedItemsList.items.0',
            label: 'A string value',
            component: 'textarea-field',
            default: 'lorem ipsum',
            validate: []
        }, {
            name: 'fixedItemsList.items.1',
            label: 'a boolean value',
            validate: [],
            component: 'select-component',
            options: [{
                disabled: true,
                label: 'Please Choose'
            }, {
                label: 'Yes',
                value: true
            }, {
                label: 'No',
                value: false
            }]
        }],
        additionalItems: {
            key: 'fixedItemsList.additionalItems',
            validate: [],
            component: 'field-array',
            fields: [{
                label: 'Additional item',
                component: 'text-field',
                type: 'number',
                validate: []
            }]
        }
    }, {
        key: 'minItemsList',
        component: 'field-array',
        title: 'A list with a minimal number of items',
        validate: [{
            type: 'min-items-validator',
            treshold: 3
        }],
        fields: [{
            name: 'name',
            default: 'Default name',
            component: 'text-field',
            type: 'text',
            validate: [],
            autofocus: false
        }]
    }, {
        key: 'defaultsAndMinItems',
        component: 'field-array',
        title: 'List and item level defaults',
        validate: [{
            type: 'min-items-validator',
            treshold: 5
        }],
        fields: [{
            component: 'text-field',
            type: 'text',
            validate: []
        }]
    }, {
        key: 'nestedList',
        title: 'Nested list',
        component: 'field-array',
        fields: [{
            title: 'Inner list',
            component: 'field-array',
            validate: [],
            key: 'nestedList.items',
            fields: [{
                component: 'text-field',
                validate: [],
                type: 'text'
            }]
        }]
    }, {
        component: 'field-array',
        key: 'unorderable',
        title: 'Unorderable items',
        validate: [],
        fields: [{
            component: 'text-field',
            type: 'text',
            validate: []
        }]
    }, {
        key: 'unremovable',
        title: 'Unremovable items',
        component: 'field-array',
        validate: [],
        fields: [{
            component: 'text-field',
            type: 'text',
            validate: []
        }]
    }, {
        key: 'noToolbar',
        title: 'No add, remove and order buttons',
        component: 'field-array',
        validate: [],
        fields: [{
            component: 'text-field',
            type: 'text',
            validate: []
        }]
    }, {
        key: 'fixedNoToolbar',
        title: 'Fixed array without buttons',
        component: 'fixed-list',
        fields: [{
            name: 'fixedNoToolbar.items.0',
            label: 'A number',
            default: 42,
            component: 'text-field',
            type: 'number',
            validate: []
        }, {
            name: 'fixedNoToolbar.items.1',
            label: 'A boolean',
            component: 'checkbox',
            type: 'checkbox',
            validate: [],
            default: false
        }],
        additionalItems: {
            component: 'field-array',
            key: 'fixedNoToolbar.additionalItems',
            validate: [],
            fields: [{
                component: 'text-field',
                label: 'A string',
                type: 'text',
                validate: []
            }]
        }
    }]
};

export const numbersSchemaResult = {
    title: 'Number fields & widgets',
    fields: [{
        component: 'text-field',
        name: 'number',
        type: 'number',
        label: 'Number',
        title: 'Number',
        validate: [],
        autofocus: false
    }, {
        name: 'integer',
        autofocus: false,
        component: 'text-field',
        type: 'number',
        title: 'Integer',
        label: 'Integer',
        validate: []
    }, {
        name: 'numberEnum',
        label: 'Number enum',
        title: 'Number enum',
        autofocus: false,
        component: 'select-component',
        type: 'number',
        enum: [ 1, 2, 3 ],
        validate: []
    }, {
        name: 'numberEnumRadio',
        label: 'Number enum',
        title: 'Number enum',
        autofocus: false,
        enum: [ 1, 2, 3 ],
        component: 'radio-component',
        validate: [],
        type: 'radio'
    }, {
        name: 'integerRange',
        label: 'Integer range',
        title: 'Integer range',
        minimum: 42,
        maximum: 100,
        validate: [],
        component: 'text-field',
        type: 'range',
        autofocus: false
    }, {
        name: 'integerRangeSteps',
        label: 'Integer range (by 10)',
        title: 'Integer range (by 10)',
        minimum: 50,
        maximum: 100,
        multipleOf: 10,
        validate: [],
        component: 'text-field',
        type: 'range',
        autofocus: false
    }]
};

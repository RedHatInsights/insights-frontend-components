export const simple = {
  title: 'A registration form',
  description: 'A simple form example.',
  type: 'object',
  required: [
    'firstName',
    'lastName',
  ],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
    },
    age: {
      type: 'integer',
      title: 'Age',
    },
    bio: {
      type: 'string',
      title: 'Bio',
    },
    password: {
      type: 'string',
      title: 'Password',
      minLength: 3,
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
    }
  },
};

export const uiSchemaSimple = {
  firstName: {
    'ui:autofocus': true,
    'ui:emptyValue': '',
  },
  age: {
    'ui:widget': 'updown',
    'ui:title': 'Age of person',
    'ui:description': '(earthian year)',
  },
  bio: {
    'ui:widget': 'textarea',
  },
  password: {
    'ui:widget': 'password',
    'ui:help': 'Hint: Make it strong!',
  },
  date: {
    'ui:widget': 'alt-datetime',
  },
  telephone: {
    'ui:options': {
      inputType: 'tel',
    },
  },
};

/**
 * Lauras form usecases
 */

export const lauraSchema1 = {
  type: 'object',
  required: ['title'],
  properties: {
      title: { type: 'string', title: 'Title', default: 'A new provider' },
      done: { type: 'boolean', title: 'Done?', default: false }
  }
};

export const lauraSchema2 = {
  title: 'Add an Openshift Provider',
  type: 'object',
  properties: {
      name: { title: 'Provider Name', type: 'string' },
      description: { title: 'Description', type: 'string' },
      url: { title: 'URL', type: 'string' },
      verify_ssl: { title: 'Verify SSL', type: 'boolean', default: false },
      user: { title: 'User Name', type: 'string', default: '' },
      token: { title: 'Token', type: 'string', default: '' },
      password: { title: 'Password', type: 'string', minlength: 6 }
  },
  required: ['name', 'url']
};


export const lauraUiSchema = {
  password: {
      'ui:widget': 'password'
  }
};


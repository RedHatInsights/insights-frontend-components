console.log('[NFO] You can write whatever you want, just don\'t forget to import from ../src.')
//import '../src/_patternfly_specific.scss';
import './styles.scss';
import React from 'react';
import { render } from 'react-dom';
import convertSchema from '../src/SmartComponents/Forms/Helpers/schemaParser';
import { simple, uiSchemaSimple, lauraSchema1, lauraUiSchema, lauraSchema2, nestedSchema, nestedUiSchema, arraySchema, uiArraySchema, numberSchema, numberUiSchema } from '../src/SmartComponents/Forms/demoData/formSchemas';

const Demo = () => (
  <React.Fragment>
  <h1>
      Number schema
  </h1>
    <pre>
    {JSON.stringify(convertSchema(numberSchema, numberUiSchema), undefined, 2)}      
    </pre>
    <h1>Array schema</h1>
    <pre>
    {JSON.stringify(convertSchema(arraySchema, uiArraySchema), undefined, 2)}      
    </pre>
    <h1>Nested schema</h1>
    <pre>
      {JSON.stringify(convertSchema(nestedSchema, nestedUiSchema), undefined, 2)}      
    </pre>
    <h1>Laura schema 1</h1>
    <pre>
      {JSON.stringify(convertSchema(lauraSchema1, lauraUiSchema), undefined, 2)}
    </pre>
    <h1>Laura schema 2</h1>
    <pre>
      {JSON.stringify(convertSchema(lauraSchema2, lauraUiSchema), undefined, 2)}
    </pre>
    <h1>Mozilla simple schema</h1>
    <pre>
      {JSON.stringify(convertSchema(simple, uiSchemaSimple), undefined, 2)}
    </pre>
  </React.Fragment>
);

render(<Demo />, document.getElementById('app'));

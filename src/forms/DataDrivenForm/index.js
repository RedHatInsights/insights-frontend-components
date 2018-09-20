import React from 'react';
import { Title } from '@patternfly/react-core';
import { simple, uiSchemaSimple, lauraSchema1, lauraSchema2, lauraUiSchema } from '../demoData/formSchemas';
import FormRenderer from './formRenderer';




export const Stub = () => <div style={{ padding: 10 }}>
  <Title size="4xl">Service catalog schemas</Title>
  <FormRenderer schema={lauraSchema1} onSubmit={console.log} />
  <FormRenderer schema={lauraSchema2} uiSchema={lauraUiSchema} onSubmit={console.log} />
</div>


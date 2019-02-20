# Impact badge

This component using Patternfly icons with optional tooltip implementation for Impact Badge.

## Usage

Import ImpactBadge from this package.

```JSX
import React from 'react';
import { ImpactBadge } from '@red-hat-insights/insights-frontend-components';

class YourCmp extends React.Component {
  render() {
    return (
        <ImpactBadge impact={<string>} hastooltip={<boolean>} size={<string>sm|(md)|lg|xl>} />
    )
  }
}
```

## Props

TableToolbar

```javascript
{
    impact: propTypes.string, //
    hastooltip: propTypes.bool, //
    size: propTypes.string // sm, md, lg or xl
};
```

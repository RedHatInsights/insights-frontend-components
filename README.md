[![Build Status](https://travis-ci.org/RedHatInsights/insights-chrome.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-chrome)
[![npm version](https://badge.fury.io/js/%40red-hat-insights%2Finsights-frontend-components.svg)](https://badge.fury.io/js/%40red-hat-insights%2Finsights-frontend-components)

# insights-frontend-components
Red Hat Insights Components for applications in a React.js environment

# Usage
npm: `npm install @red-hat-insights/insights-frontend-components`

# Development
Create a component inside of the PresentationalComponent folder

Structure
```
PresentationalComponents
└───YourComponent
    ├─── index.js
    ├─── your-component.js
    └─── your-component.scss
```

Build: `npm run build`
Test: `npm run test`

There is also a playground for any development
`npm run playground`

## Conbribution
### Commit format
[Semantic release](https://github.com/semantic-release/semantic-release) is used in this project, so to trigger new release you should add specific format into your commit messages and new release will be triggered when PR is merged.

#### Used formatter
[Commit analyzer wildcard](https://github.com/karelhala/commit-analyzer-wildcard) is used for parsing commit messages so to trigger new release add one of these strings into your commit and new release is triggered
* Major - `<?.?.x>`
* Minor - `<?.x.x>` or `<?.x.?>`
* Bug - `<x.x.x>` or `<x.x.?>` or `<x.?.x>` or `<x.?.?>`
* No release - `<no>`

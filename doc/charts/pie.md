# Pie Chart

This component is very similar to the [Donut chart](donut.md). Except there's no total and totalLabel.

## Props

```JS
{
    className: propTypes.string,
    height: propTypes.number,
    identifier: propTypes.string,
    values: propTypes.array,
    width: propTypes.number,
    withLabel: propTypes.bool,
    legendPosition: propTypes.oneOf(Object.keys(LegendPosition))
}
```

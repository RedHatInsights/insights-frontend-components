export function horizontalLine(element, [start, end], position, stroke = 1, color = 'black') {
  return element.append('line')
        .attr("x1", start)
        .attr("y1", position)
        .attr("x2", end)
        .attr("y2", position)
        .attr("stroke-width", stroke)
        .attr("stroke", color)
}

export function verticalLine(element, [start, end], position, stroke = 1, color = 'black') {
  return element.append('line')
        .attr("x1", position)
        .attr("y1", start)
        .attr("x2", position)
        .attr("y2", end)
        .attr("stroke-width", stroke)
        .attr("stroke", color)
}

export function emptyRect(element, [x, y], size, stroke = 1, color = 'black') {
  return element.append('rect')
    .attr("stroke-width", stroke)
    .attr("stroke", color)
    .attr('x', x)
    .attr('y', y)
    .attr('width', size)
    .attr('height', size)
    .attr('fill', 'none');
}
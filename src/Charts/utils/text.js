export function drawText(element, [x, y], text, color = '#414241', anchor = 'end') {
  return element.append('text')
    .attr("fill", color)
    .attr("text-anchor", anchor)
    .attr("x", x)
    .attr("y", y)
    .text(text)
}
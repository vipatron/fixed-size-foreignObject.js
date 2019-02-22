# fixed-size-foreignObject.js
A tweak of Phrogz's excellent little library to allow it to work in cases where no viewbox attribute was assigned to an SVG which wraps a foreignObject element.

Original stackOverflow answer: https://stackoverflow.com/questions/45043777/how-to-avoid-scaling-of-elements-inside-foreignobjects-of-svgs
Difference: in the function calculateSVGscale, I was getting trouble running the first line:
```let w1=svg.viewBox.animVal.width, h1=svg.viewBox.animVal.height;```
in cases where the `<svg>` tag wrapping a `<foreignObject>` had no `viewbox` attribute. A little debugging in the console showed me that since `animVal` is `null` in that case, I needed to modify (update?) the error-checking.

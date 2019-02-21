(function(win){
let svgs, els=[];

win.fixedSizeForeignObjects = function fixedSizeForeignObjects(...all) {
	all.forEach( fixedSizeForeignObject );
}

win.fixedSizeForeignObject = function fixedSizeForeignObject(el) {
		if (!svgs) { svgs = []; win.addEventListener('resize',resizeSVGs,false) }
		let svg=el.ownerSVGElement, found=false;
		for (let i=svgs.length;i--;) if (svgs[i]===svg) found=true;
		if (!found) svgs.push(svg);
		let info = {
			el:el, svg:svg,
			w:el.getAttribute('width')*1, h:el.getAttribute('height')*1,
			x:el.getAttribute('x')*1, y:el.getAttribute('y')*1
		};
		els.push(info);
		el.removeAttribute('x');
		el.removeAttribute('y');
		calculateSVGScale(svg);
		fixScale(info);
}

function resizeSVGs(evt) {
	svgs.forEach(calculateSVGScale);
	els.forEach(fixScale);
}

function calculateSVGScale(svg) {
  //The line below is the change I made compared to the file linked in Phrogz's stackOverflow answer here: https://stackoverflow.com/questions/45043777/how-to-avoid-scaling-of-elements-inside-foreignobjects-of-svgs
	if (!svg.viewBox.animVal)svg.scaleRatios = [1,1]; // No viewBox
	else {
		let info = getComputedStyle(svg);
		console.log("computed svg style", info);
		let w1=svg.viewBox.animVal.width, h1=svg.viewBox.animVal.height;//viewbox == grid system 1.
		let w2=parseFloat(info.width), h2=parseFloat(info.height);//actual svg box == grid system 2.
		let par=svg.preserveAspectRatio.animVal;
		if (par.align===SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_NONE) {
			svg.scaleRatios = [w2/w1, h2/h1];//scaling factors are simply ratios of the respective dimensions.
		} else {
			let meet = par.meetOrSlice === SVGPreserveAspectRatio.SVG_MEETORSLICE_MEET;
			// if preserving AR (aspect ratio), one dimension will be cut off, and the other will be scaled to fit: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio#Example
			// the scaling ratio we will apply to BOTH dimensions has to be the ratio of one of the dimensions (viewbox:svg's DOM box) in order to preserve the aspect ratio.
			// meet/meet==true: scale the image to fit inside the svg rect. (The edges of the viewbox meet the edges of the viewport)
			// slice/meet==false: slice off the excess to make the svg rect be fully drawn-in. (The edges of the viewbox outside the viewport are sliced off).
			//Human version of line below:
			//if ((viewbox AR wider than svg rect AR) && slicing off excess height) || ((viewbox AR narrower than svg rect AR) && zoom to fit) ? scale heights to match : scale widths.
			let ratio = (w1/h1 > w2/h2) != meet ? h2/h1 : w2/w1;//some extreme cleverness going on here (see above).
			svg.scaleRatios = [ratio, ratio];
		}
	}
}

function fixScale(info) {
	let s = info.svg.scaleRatios;
	info.el.setAttribute('width', info.w*s[0]);
	info.el.setAttribute('height',info.h*s[1]);
	info.el.setAttribute('transform','translate('+info.x+','+info.y+') scale('+1/s[0]+','+1/s[1]+')');
}

})(window);

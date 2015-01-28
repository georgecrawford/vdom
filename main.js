var virtualize = require("vdom-virtualize");
var h = require("virtual-dom/h");
var diff = require("virtual-dom/diff");
var patch = require("virtual-dom/patch");

document.addEventListener('DOMContentLoaded', function() {
	var button = document.querySelector('button');
	var i = 1;
	button.addEventListener('click', function() {
		var section = document.querySelector('section');
		var leftNode = virtualize(section);
		console.log(leftNode);

		var rightNode = virtualize(section);
		rightNode.properties.style['background-color'] = '#' + (Math.random().toString(16).slice(2, 8));

		var patches = diff(leftNode, rightNode);
		console.log(patches);
		patch(section, patches);
	});
});


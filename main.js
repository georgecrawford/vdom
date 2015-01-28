var virtualize = require("vdom-virtualize");
var h = require("virtual-dom/h");
var diff = require("virtual-dom/diff");
var patch = require("virtual-dom/patch");
var clone = require('./clone');

document.addEventListener('DOMContentLoaded', function() {

	var button = document.querySelector('button');
	var section = document.querySelector('section');

	// Get a VNode for the initial, rendered DOM node
	var existingNode = virtualize(section);
	console.log('Initial DOM node', existingNode);

	button.addEventListener('click', function() {

		// This is where FruitMachine would create a new virtual DOM representation. For
		// now, we just clone the existing node and alter some properties
		var newNode = clone(existingNode);
		newNode.properties.style['background-color'] = '#' + (Math.random().toString(16).slice(2, 8));
		console.log('New DOM node', newNode);

		var patches = diff(existingNode, newNode);
		console.log('Applying patches', patches);

		patch(section, patches);

		// Set the pointer to what's now in the DOM
		existingNode = newNode;
	});
});


var virtualize = require('vdom-virtualize');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var mustache = require('mustache');

var template = '<section style="background-color: #{{color}};"><h2>{{heading}}</h2><p>{{text}}</p></section>';

document.addEventListener('DOMContentLoaded', function() {

	var button  = document.querySelector('button');
	var section = document.querySelector('section');
	var heading = section.querySelector('h2').innerText;
	var text    = section.querySelector('p').innerText;

	// Get a VNode for the initial, rendered DOM node
	var existingVNode = virtualize(section);
	console.log('Initial DOM node', existingVNode);

	button.addEventListener('click', function() {

		// Newly-generated HTML, from fruitmachine's module.toHTML() for example
		var newHTML = mustache.render(template, {
			color:   Math.random().toString(16).slice(2, 8),
			heading: heading,
			text:    text
		});
		var newVNode = virtualize.fromHTML(newHTML);
		console.log('New DOM node', newVNode);

		var patches = diff(existingVNode, newVNode);
		console.log('Applying patches', patches);

		patch(section, patches);

		// Set the pointer to what's now in the DOM
		existingVNode = newVNode;
	});
});


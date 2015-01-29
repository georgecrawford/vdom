var virtualize = require('vdom-virtualize');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var attachFastClick = require('fastclick');


document.addEventListener('DOMContentLoaded', function() {

	attachFastClick(document.body);

	var logEl   = document.querySelector('#log');
	var button  = document.querySelector('button');
	var volatile = document.querySelector('#volatile');

	function log(message) {
		logEl.innerHTML += '<br /><br />' + message;
		logEl.scrollTop = logEl.scrollHeight;
	}

	// Get a VNode for the initial, rendered DOM node
	var existingVNode = virtualize(volatile);
	console.log('Initial DOM node', existingVNode);

	// Log mutation events, so we can prove the virtual dom diff/patch is working
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			switch (mutation.type) {
				case 'attributes':
					log('Attribute [' + mutation.attributeName + '] of Node [' + mutation.target.nodeName + '] changed to [' + mutation.target.attributes[mutation.attributeName].nodeValue + ']');
					break;
				case 'characterData':
					log('Character data of Node [' + mutation.target.nodeName + '] changed to [' + mutation.target.nodeValue + ']');
					break;
				default:
					log(mutation.type);
					break;
			}
		});
	});

	observer.observe(volatile, {
		attributes:    true,
		childList:     true,
		characterData: true,
		subtree:       true
	});

	button.addEventListener('click', function() {

		log('<br /><br /><strong>[[Button click]]</strong>');

		// Newly-generated HTML, from fruitmachine's module.toHTML() for example.
		// TODO: add a new FTFruitMachine method renderVirtual(), which generates HTML,
		// parses to a vNode, diffs with the current DOM (or previous vNode if set), and
		// applies a patch. Is it even possible to hold a vNode of the whole DOM in
		// memory, and when a FM module is rendered, update that part of the vNode
		// descendent tree?
		var random = (Math.random() > 0.75);
		var newHTML = require('./views/sections.html')({
			sections: [
				{ color: Math.random().toString(16).slice(2, 8), section: random ? 'RANDOM!' : 1 },
				{ color: Math.random().toString(16).slice(2, 8), section: random ? 'RANDOM!' : 2 },
				{ color: Math.random().toString(16).slice(2, 8), section: random ? 'RANDOM!' : 3 }
			]
		});
		var newVNode = virtualize.fromHTML(newHTML);
		console.log('New DOM node', newVNode);

		var patches = diff(existingVNode, newVNode);
		console.log('Applying patches', patches);

		patch(volatile, patches);

		// Set the pointer to what's now in the DOM
		existingVNode = newVNode;
	});
});


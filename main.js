var virtualize   = require('vdom-virtualize');
var h            = require('virtual-dom/h');
var diff         = require('virtual-dom/diff');
var patch        = require('virtual-dom/patch');
var fastClick    = require('fastclick');
var fruitmachine = require('fruitmachine');

var wrapperEl;
var logEl;
var container;
var existingVNode;

function setup() {
	logEl     = document.querySelector('.log');
	wrapperEl = document.querySelector('.wrapper');

	fastClick(document.body);
}

function log(message) {
	logEl.innerHTML += '<br /><br />' + message;
	logEl.scrollTop = logEl.scrollHeight;
}

var sectionModule = fruitmachine.define({
	name: 'section',
	template: require('./views/section.html')
});

var containerModule = fruitmachine.define({
	name: 'container',
	template: require('./views/container.html')
});

function createVNode(inject) {

	var random = Math.random() > 0.75;
	var vNode;

	if (!container) {
		container = new containerModule()
			.add(new sectionModule({
				slot:  1
			}))
			.add(new sectionModule({
				slot:  2
			}))
			.add(new sectionModule({
				slot:  3
			}));
	}

	container.modules('section').forEach(function _configureModule(module) {
		module.model.set('color', Math.random().toString(16).slice(2, 8));
		module.model.set('section', random ? 'RANDOM!' : module.slot);
	});

	if (inject) {
		container.render()
			.appendTo(wrapperEl);

		vNode = virtualize(container.el);
		console.log('Created and injected vNode', vNode);
	} else {
		vNode = virtualize.fromHTML(container.toHTML());
		console.log('Created vNode', vNode);
	}

	return vNode;
}

// Log mutation events, so we can prove the virtual dom diff/patch is working
function logMutations(root) {
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

	observer.observe(root, {
		attributes:    true,
		childList:     true,
		characterData: true,
		subtree:       true
	});
}

function updateDom(existingVNode, newVNode) {
	var patches = diff(existingVNode, newVNode);
	console.log('Applying patches', patches);

	patch(container.el, patches);
}

document.addEventListener('DOMContentLoaded', function() {

	setup();
	existingVNode = createVNode(true);
	logMutations(wrapperEl);

	document.querySelector('button').addEventListener('click', function() {

		log('<br /><br /><strong>[[Button click]]</strong>');

		var newVNode = createVNode();
		updateDom(existingVNode, newVNode);

		// Set the pointer to what's now in the DOM
		existingVNode = newVNode;
	});
});

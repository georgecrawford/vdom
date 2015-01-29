var fastClick    = require('fastclick');
var fruitmachine = require('./fruitmachine');

var wrapperEl;
var logEl;
var container;

function setup() {
	logEl     = document.querySelector('.log');
	wrapperEl = document.querySelector('.wrapper');

	fastClick(document.body);

	container = new containerModule()
		.add(new sectionModule({slot: 1}))
		.add(new sectionModule({slot: 2}))
		.add(new sectionModule({slot: 3}));
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

function updateDom(inject) {

	var random = Math.random() > 0.75;
	var vNode;

	container.modules('section').forEach(function _configureModule(module) {
		module.model.set('color', Math.random().toString(16).slice(2, 8));
		module.model.set('section', random ? 'RANDOM!' : module.slot);
	});

	container.vDomRender();

	if (inject) {
		container.appendTo(wrapperEl);
	}
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

document.addEventListener('DOMContentLoaded', function() {
	setup();
	updateDom(true);
	logMutations(wrapperEl);

	document.querySelector('button').addEventListener('click', function() {
		log('<br /><br /><strong>[[Button click]]</strong>');
		updateDom();
	});
});

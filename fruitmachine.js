var fruitmachine = require('fruitmachine');
var virtualize   = require('vdom-virtualize');
var diff         = require('virtual-dom/diff');
var patch        = require('virtual-dom/patch');

var currentVNode;

fruitmachine.Module.prototype.vDomRender = function() {

	var newVNode;

	this.fireStatic('before render');

	if (currentVNode) {
		newVNode = virtualize.fromHTML(this.toHTML());
		console.log('Updated vNode', newVNode);
		this.vDomPatch(currentVNode, newVNode);
		currentVNode = newVNode;
	} else {
		this.render();
		currentVNode = virtualize(this.el);
		console.log('Created initial vNode', currentVNode);
	}

	this._fetchEls(this.el);
	this.fireStatic('render');

	return this;
};

fruitmachine.Module.prototype.vDomPatch = function(existingVNode, newVNode) {
	var patches = diff(existingVNode, newVNode);
	console.log('Applying patches', patches);
	patch(this.el, patches);
};

module.exports = fruitmachine;
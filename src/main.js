define( function() {
//module loader helper
var asyncModule = function(name) {
	return {
		controller: function() {
			m.startComputation()

			var pageBundle = require("bundle!./pages/" + name + ".js");
			pageBundle(function(module) {
				this.controller = new module.controller();
				this.view = module.view;
				this.onunload = this.controller.onunload;
				
				m.endComputation()
			}.bind(this));
		},
		view: function(ctrl) {
			return ctrl.view(ctrl.controller)
		}
	}
};

	var ma = require('./mantle');
	var Element = ma.Element;
	var Model = ma.Model;
	var Controller = ma.Controller;
	var ViewModel = ma.ViewModel;
	var Collection = ma.Collection;
	var View = ma.View;
	/////////////////

	var Fuck = Element.extend({
		events: {
			'beforeRender': 'log'
		},
		log: function() {
			console.log('did it');
		},
		View: View.extend({
			template: function(ctrl) {
				return m('span', 'Do it!');
			}
		})
	}, {
		tag: 'Do'
	});

	var Test = Element.extend({
		events: {
			'elementCreated': 'log'
		},
		log: function() {
			console.log('works');
		},
		View: View.extend({
			template: function(ctrl) {
				return m('div', [
					m('span', 'Hooba Booba!'),
					//this.ma('do', 'Do')
				]);
			}
		})
	}, {
		tag: 'Test'
	});

	var TD = Element.extend({
		View: View.extend({
			template: function(ctrl, children) {
				return m("td", ctrl.attrs, children);
			}
		})
	}, {
		tag: 'td'
	});

	////////////////

	var Todo = Element.extend({
		Model: Model.extend({
			init: function (data) {
				this.description = m.prop(data.description);
				this.done = m.prop(false);
			}
		}),
		Collection: Collection,
		ViewModel: ViewModel.extend({
			init: function () {
				this.list = new this.parent.Collection();
				this.description = m.prop("");
			},
			add: function () {
				m.redraw.strategy('diff');
				if (this.description()) {

					this.list.push(new this.parent.Model( { description: this.description() } ));
					this.description("");

				}
			}
		}),
		Controller: Controller.extend({
			init: function() {
				this.vm = new this.parent.ViewModel();
			},
			logger: function() {
				//console.log('controlled');
			}
		}),
		View: View.extend({
				template: function (ctrl) {

					var ret = m("div", [
							m("input", {onchange: m.withAttr("value", ctrl.vm.description), value: ctrl.vm.description()}),
							m("button", {onclick: ctrl.vm.add}, "Add"),

							this.ma('f1', 'Do'),
							this.ma('test', 'Test'),
							m("table", [
								ctrl.vm.list.map(function (task, index) {
									return m("tr", [
										m("td", [
											m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
										]),
										m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}, events: { 'controllerCreated' : ctrl.logger }}, [
											m("span", task.description())
										])
									])
								})
							])
						]
					);

					return ret;
				}
			})
	}, {
		tag: 'Todo'
	});

	ma.mod(new Todo(), function(mx) {
		document.body.appendChild(mx);
	});
});

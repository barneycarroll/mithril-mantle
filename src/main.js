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

  var Do = Element.extend({
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
        //this.description = m.prop("");
      },
      add: function(data) {
        this.list.push(new this.parent.Model( { description: data.description } ));
      }
    }),
    Controller: Controller.extend({
      init: function() {
        this.vm = new this.parent.ViewModel();
        this.description = m.prop("");
      },
      add: function () {
        if (this.description()) {
          this.vm.add( { description: this.description() } );
          this.description("");
        }
      },
      logger: function() {
        //console.log('controlled');
      }
    }),
    View: View.extend({
      template: function (ctrl) {
        var ret = m("div", [
          m("input", {onchange: m.withAttr("value", ctrl.description), value: ctrl.description()}),
          m("button", {onclick: ctrl.add}, "Add"),

          ma(this.nodes, 'f1', 'Do'),
          ma(this.nodes, 'test', 'Test'),
          m("table", [
            ctrl.each(this.nodes, 'listId', ctrl.vm.list, function (task, index, nodes) {
              return m("tr", [
                m("td", [
                  m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
                ]),
                m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}, events: { 'controllerCreated' : ctrl.logger }}, [
                  m("span", task.description())
                ]),
                m("td", [
                  ma(nodes, 'fx', 'Do')
                ])
              ])
            })
          ])]
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

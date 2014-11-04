/**
 * Created by Paul on 11/1/2014.
 */

var EventEmitter = require('eventemitter3');
var extend = require("compose-extend");
var bindAll = require("lodash.bindall");

/// sugar
var sObj = "[object Object]", sArr = "[object Array]", sStr = "[object String]";
function type(obj) {return {}.toString.call(obj)}
function isObj(obj) {return type(obj) == sObj}
function isArr(obj) {return type(obj) == sArr}
function isFn(obj) {return typeof obj == "function"}
function isStr(obj){ return type(obj) == sStr}

var ma = function(node, id, selector) {
  if(!node.children[id]) {
    node.children[id] = ma.factory(selector);
  }
  return node.children[id].render();
};

ma.factory = function(selector) {
  var inst = new ma.registry[selector];
  inst.controller = new inst.Controller();
  inst.view = new inst.View;
  return inst.view;
};

ma.module = function(elem, cls) {
  cls.attach(elem);
};

ma.registry = {};

ma.mod = function(comp, cb) {
  var el = document.createElement('div');
  comp.view = new comp.View();
  var module = {
      controller: comp.Controller,
      view : comp.view.template
    };
  m.module(el, module);
  if(cb) cb(el);
};
///end sugar

/// start Backboneification
var Model = ViewModel = Collection = function() {
  this.event = new EventEmitter();
  if(this.init) this.init.apply(this,arguments);
  bindAll(this);
};

var Controller = function(attrs) {
  //this.eid = 'e' + count++;
  this.event = new EventEmitter();
  this.attrs = attrs;
  if(this.init) this.init.apply(this,arguments);
  bindAll(this);
};

var Nodes = function() {
  this.nodes = null;
  this.children = {};
};

Controller.prototype.each = function(nodes, listId, list, cb) {
  if(!nodes.nodes) nodes.nodes = new Nodes();
  return list.map(function(item, idx) {
    return cb(item, idx, nodes.nodes);
  });
};

Model.extend = ViewModel.extend = Controller.extend = Collection.extend = extend;
Collection = Collection.extend(Array.prototype);

var Element = function() {

  this.event = new EventEmitter();
  this.addEvents(this.events);
  for (var key in this) {
    if(this.constructor.prototype.hasOwnProperty(key) && key !== 'constructor' && typeof this[key] === 'function')
      this._addReference(this[key], { parent : this});
  }
};

Element.prototype.addEvents = function(events) {
  if(events) {
    for(var key in events) {
      this.event.on(key, ( isStr(events[key]) ) ? this[events[key]].bind(this) : events[key]);
    }
  }
};

Element.prototype._addReference = function(obj, options) {
  obj.prototype.parent = options.parent;
};

Element.prototype.Controller = Controller.extend({});

Element.extend = function(protoProps, staticProps) {
  var extended = extend.call(this, protoProps, staticProps);
  if(extended.tag) ma.registry[extended.tag] = extended;
  return extended;
};

Element.prototype.attach = function(elem)  {
  this.view = new this.View();
  this.controller = m.module(elem,
    {
      controller: this.Controller,
      view : this.view.render()
    }
  );
};

var View = function() {
  this.event = new EventEmitter();
  this.nodes = new Nodes();
  if(this.init) this.init.apply(this,arguments);
  bindAll(this);
};

View.extend = extend;

View.prototype.render = function() {
  this.parent.event.emit('beforeRender');
  return this.template(this.parent.controller);
};
/// end Backboneification

ma.Element = Element;
ma.Controller = Controller;
ma.ViewModel = ViewModel;
ma.Model = Model;
ma.Collection = Collection;
ma.View = View;

module.exports = ma;

(function(){
  var ref$, createClass, svg, findDOMNode;
  ref$ = require('nylas-exports').React, createClass = ref$.createClass, svg = ref$.DOM.svg;
  findDOMNode = require('nylas-exports').ReactDOM.findDOMNode;
  module.exports = createClass({
    render: function(){
      return svg(this.props);
    },
    componentDidMount: function(){
      findDOMNode(this).setAttribute('focusable', false);
    }
  });
}).call(this);

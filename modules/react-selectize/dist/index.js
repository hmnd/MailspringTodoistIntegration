(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reactSelectize = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
  var HighlightedText, SimpleSelect, MultiSelect, ReactSelectize;
  HighlightedText = require('./HighlightedText');
  SimpleSelect = require('./SimpleSelect');
  MultiSelect = require('./MultiSelect');
  ReactSelectize = require('./ReactSelectize');
  module.exports = {
    HighlightedText: HighlightedText,
    SimpleSelect: SimpleSelect,
    MultiSelect: MultiSelect,
    ReactSelectize: ReactSelectize
  };
}).call(this);

},{"./HighlightedText":4,"./MultiSelect":5,"./ReactSelectize":7,"./SimpleSelect":11}],2:[function(require,module,exports){
(function (global){
(function(){
  var ref$, createClass, div;
  ref$ = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createClass = ref$.createClass, div = ref$.DOM.div;
  module.exports = createClass({
    getDefaultProps: function(){
      return {
        className: "",
        onHeightChange: function(){}
      };
    },
    render: function(){
      return div({
        className: this.props.className,
        ref: 'dropdown'
      }, this.props.children);
    },
    componentDidMount: function(){
      this.props.onHeightChange(this.refs.dropdown.offsetHeight);
    },
    componentDidUpdate: function(){
      this.props.onHeightChange(this.refs.dropdown.offsetHeight);
    },
    componentWillUnmount: function(){
      this.props.onHeightChange(0);
    }
  });
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
(function(){
  var ref$, filter, id, map, isEqualToObject, React, div, input, span, createClass, createFactory, findDOMNode, ReactCSSTransitionGroup, ReactTether, DivWrapper, OptionWrapper, cancelEvent, classNameFromObject;
  ref$ = require('prelude-ls'), filter = ref$.filter, id = ref$.id, map = ref$.map;
  isEqualToObject = (typeof window !== "undefined" ? window['preludeExtension'] : typeof global !== "undefined" ? global['preludeExtension'] : null).isEqualToObject;
  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), ref$ = React.DOM, div = ref$.div, input = ref$.input, span = ref$.span, createClass = React.createClass, createFactory = React.createFactory;
  findDOMNode = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null).findDOMNode;
  ReactCSSTransitionGroup = createFactory((typeof window !== "undefined" ? window['React']['addons']['CSSTransitionGroup'] : typeof global !== "undefined" ? global['React']['addons']['CSSTransitionGroup'] : null));
  ReactTether = createFactory(require('./ReactTether'));
  DivWrapper = createFactory(require('./DivWrapper'));
  OptionWrapper = createFactory(require('./OptionWrapper'));
  ref$ = require('./utils'), cancelEvent = ref$.cancelEvent, classNameFromObject = ref$.classNameFromObject;
  module.exports = createClass({
    displayName: 'DropdownMenu',
    getDefaultProps: function(){
      return {
        className: "",
        dropdownDirection: 1,
        groupId: function(it){
          return it.groupId;
        },
        groupsAsColumns: false,
        highlightedUid: undefined,
        onHighlightedUidChange: function(uid, callback){},
        onOptionClick: function(uid){},
        onScrollLockChange: function(scrollLock){},
        options: [],
        renderNoResultsFound: function(){
          return div({
            className: 'no-results-found'
          }, "No results found");
        },
        renderGroupTitle: function(index, arg$){
          var groupId, title;
          if (arg$ != null) {
            groupId = arg$.groupId, title = arg$.title;
          }
          return div({
            className: 'simple-group-title',
            key: groupId
          }, title);
        },
        renderOption: function(arg$){
          var label, newOption, selectable, isSelectable;
          if (arg$ != null) {
            label = arg$.label, newOption = arg$.newOption, selectable = arg$.selectable;
          }
          isSelectable = typeof selectable === 'undefined' || selectable;
          return div({
            className: "simple-option " + (isSelectable ? '' : 'not-selectable')
          }, span(null, !!newOption ? "Add " + label + " ..." : label));
        },
        scrollLock: false,
        style: {},
        tether: false,
        tetherProps: {},
        theme: 'default',
        transitionEnter: false,
        transitionLeave: false,
        transitionEnterTimeout: 200,
        transitionLeaveTimeout: 200,
        uid: id
      };
    },
    render: function(){
      var dynamicClassName, ref$;
      dynamicClassName = classNameFromObject((ref$ = {}, ref$[this.props.theme + ""] = 1, ref$[this.props.className + ""] = 1, ref$.flipped = this.props.dropdownDirection === -1, ref$.tethered = this.props.tether, ref$));
      if (this.props.tether) {
        return ReactTether((ref$ = import$({}, this.props.tetherProps), ref$.options = {
          attachment: "top left",
          targetAttachment: "bottom left",
          constraints: [{
            to: 'scrollParent'
          }]
        }, ref$), this.renderAnimatedDropdown({
          dynamicClassName: dynamicClassName
        }));
      } else {
        return this.renderAnimatedDropdown({
          dynamicClassName: dynamicClassName
        });
      }
    },
    renderAnimatedDropdown: function(computedState){
      var dynamicClassName;
      dynamicClassName = computedState.dynamicClassName;
      if (!!this.props.transitionEnter || !!this.props.transitionLeave) {
        return ReactCSSTransitionGroup({
          component: 'div',
          transitionName: 'custom',
          transitionEnter: this.props.transitionEnter,
          transitionLeave: this.props.transitionLeave,
          transitionEnterTimeout: this.props.transitionEnterTimeout,
          transitionLeaveTimeout: this.props.transitionLeaveTimeout,
          className: "dropdown-menu-wrapper " + dynamicClassName,
          ref: 'dropdownMenuWrapper'
        }, this.renderDropdown(computedState));
      } else {
        return this.renderDropdown(computedState);
      }
    },
    renderOptions: function(options){
      var this$ = this;
      return map(function(index){
        var option, uid;
        option = options[index];
        uid = this$.props.uid(option);
        return OptionWrapper(import$({
          uid: uid,
          ref: "option-" + this$.uidToString(uid),
          key: this$.uidToString(uid),
          item: option,
          highlight: isEqualToObject(this$.props.highlightedUid, uid),
          selectable: option != null ? option.selectable : void 8,
          onMouseMove: function(arg$){
            var currentTarget;
            currentTarget = arg$.currentTarget;
            if (this$.props.scrollLock) {
              this$.props.onScrollLockChange(false);
            }
          },
          onMouseOut: function(){
            if (!this$.props.scrollLock) {
              this$.props.onHighlightedUidChange(undefined, function(){});
            }
          },
          renderItem: this$.props.renderOption
        }, (function(){
          switch (false) {
          case !(typeof (option != null ? option.selectable : void 8) === 'boolean' && !option.selectable):
            return {
              onClick: cancelEvent
            };
          default:
            return {
              onClick: function(){
                this$.props.onOptionClick(this$.props.highlightedUid);
              },
              onMouseOver: function(arg$){
                var currentTarget;
                currentTarget = arg$.currentTarget;
                if (!this$.props.scrollLock) {
                  this$.props.onHighlightedUidChange(uid, function(){});
                }
              }
            };
          }
        }())));
      })(
      (function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = options.length; i$ < to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }()));
    },
    renderDropdown: function(arg$){
      var dynamicClassName, ref$, ref1$, groups, this$ = this;
      dynamicClassName = arg$.dynamicClassName;
      if (this.props.open) {
        return DivWrapper({
          className: "dropdown-menu " + dynamicClassName,
          ref: 'dropdownMenu',
          onHeightChange: function(height){
            if (this$.refs.dropdownMenuWrapper) {
              findDOMNode(this$.refs.dropdownMenuWrapper).style.height = height + "px";
            }
          }
        }, this.props.options.length === 0
          ? this.props.renderNoResultsFound()
          : ((ref$ = this.props) != null ? (ref1$ = ref$.groups) != null ? ref1$.length : void 8 : void 8) > 0
            ? (groups = map(function(index){
              var group, groupId, options;
              group = this$.props.groups[index], groupId = group.groupId;
              options = filter(function(it){
                return this$.props.groupId(it) === groupId;
              })(
              this$.props.options);
              return {
                index: index,
                group: group,
                options: options
              };
            })(
            (function(){
              var i$, to$, results$ = [];
              for (i$ = 0, to$ = this.props.groups.length; i$ < to$; ++i$) {
                results$.push(i$);
              }
              return results$;
            }.call(this))), div({
              className: "groups " + (!!this.props.groupsAsColumns ? 'as-columns' : '')
            }, map(function(arg$){
              var index, group, groupId, options;
              index = arg$.index, group = arg$.group, groupId = group.groupId, options = arg$.options;
              return div({
                key: groupId
              }, this$.props.renderGroupTitle(index, group, options), div({
                className: 'options'
              }, this$.renderOptions(options)));
            })(
            filter(function(it){
              return it.options.length > 0;
            })(
            groups))))
            : this.renderOptions(this.props.options));
      } else {
        return null;
      }
    },
    componentDidUpdate: function(){
      var x$, dropdownMenu, ref$;
      x$ = dropdownMenu = findDOMNode((ref$ = this.refs.dropdownMenuWrapper) != null
        ? ref$
        : this.refs.dropdownMenu);
      if (x$ != null) {
        x$.style.bottom = (function(){
          switch (false) {
          case this.props.dropdownDirection !== -1:
            return (this.props.bottomAnchor().offsetHeight + dropdownMenu.style.marginBottom) + "px";
          default:
            return "";
          }
        }.call(this));
      }
    },
    highlightAndScrollToOption: function(index, callback){
      var uid, this$ = this;
      callback == null && (callback = function(){});
      uid = this.props.uid(this.props.options[index]);
      this.props.onHighlightedUidChange(uid, function(){
        var ref$, ref1$, optionElement, parentElement, optionHeight;
        if ((ref$ = findDOMNode((ref1$ = this$.refs) != null ? ref1$["option-" + this$.uidToString(uid)] : void 8)) != null) {
          optionElement = ref$;
        }
        if (!!optionElement) {
          parentElement = findDOMNode(this$.refs.dropdownMenu);
          optionHeight = optionElement.offsetHeight - 1;
          if (optionElement.offsetTop - parentElement.scrollTop >= parentElement.offsetHeight) {
            parentElement.scrollTop = optionElement.offsetTop - parentElement.offsetHeight + optionHeight;
          } else if (optionElement.offsetTop - parentElement.scrollTop + optionHeight <= 0) {
            parentElement.scrollTop = optionElement.offsetTop;
          }
        }
        return callback();
      });
    },
    highlightAndScrollToSelectableOption: function(index, direction, callback){
      var option, ref$, ref1$, this$ = this;
      callback == null && (callback = function(){});
      if (index < 0 || index >= this.props.options.length) {
        this.props.onHighlightedUidChange(undefined, function(){
          return callback(false);
        });
      } else {
        option = (ref$ = this.props) != null ? (ref1$ = ref$.options) != null ? ref1$[index] : void 8 : void 8;
        if (typeof (option != null ? option.selectable : void 8) === 'boolean' && !option.selectable) {
          this.highlightAndScrollToSelectableOption(index + direction, direction, callback);
        } else {
          this.highlightAndScrollToOption(index, function(){
            return callback(true);
          });
        }
      }
    },
    uidToString: function(uid){
      return (typeof uid === 'object' ? JSON.stringify : id)(uid);
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./DivWrapper":2,"./OptionWrapper":6,"./ReactTether":8,"./utils":15,"prelude-ls":undefined}],4:[function(require,module,exports){
(function (global){
(function(){
  var React, createClass, ref$, div, span, map;
  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createClass = React.createClass, ref$ = React.DOM, div = ref$.div, span = ref$.span;
  map = require('prelude-ls').map;
  module.exports = createClass({
    getDefaultProps: function(){
      return {
        partitions: [],
        text: "",
        style: {},
        highlightStyle: {}
      };
    },
    render: function(){
      var this$ = this;
      return div({
        className: 'highlighted-text',
        style: this.props.style
      }, map(function(arg$){
        var start, end, highlight;
        start = arg$[0], end = arg$[1], highlight = arg$[2];
        return span({
          key: this$.props.text + "" + start + end + highlight,
          className: highlight ? 'highlight' : '',
          style: highlight
            ? this$.props.highlightStyle
            : {}
        }, this$.props.text.substring(start, end));
      })(
      this.props.partitions));
    }
  });
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"prelude-ls":undefined}],5:[function(require,module,exports){
(function (global){
(function(){
  var ref$, all, any, camelize, difference, drop, filter, find, findIndex, id, last, map, reject, isEqualToObject, React, createFactory, div, img, span, ReactSelectize, cancelEvent, toString$ = {}.toString;
  ref$ = require('prelude-ls'), all = ref$.all, any = ref$.any, camelize = ref$.camelize, difference = ref$.difference, drop = ref$.drop, filter = ref$.filter, find = ref$.find, findIndex = ref$.findIndex, id = ref$.id, last = ref$.last, map = ref$.map, reject = ref$.reject;
  isEqualToObject = (typeof window !== "undefined" ? window['preludeExtension'] : typeof global !== "undefined" ? global['preludeExtension'] : null).isEqualToObject;
  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createFactory = React.createFactory, ref$ = React.DOM, div = ref$.div, img = ref$.img, span = ref$.span;
  ReactSelectize = createFactory(require('./ReactSelectize'));
  cancelEvent = require('./utils').cancelEvent;
  module.exports = React.createClass({
    displayName: 'MultiSelect',
    getDefaultProps: function(){
      return {
        className: "",
        closeOnSelect: false,
        defaultValues: [],
        delimiters: [],
        filterOptions: curry$(function(options, values, search){
          var this$ = this;
          return filter(function(it){
            return it.label.toLowerCase().trim().indexOf(search.toLowerCase().trim()) > -1;
          })(
          reject(function(it){
            return in$(it.label.trim(), map(function(it){
              return it.label.trim();
            }, values != null
              ? values
              : []));
          })(
          options));
        }),
        firstOptionIndexToHighlight: id,
        onBlur: function(e){},
        onFocus: function(e){},
        onPaste: function(e){
          true;
        },
        serialize: map(function(it){
          return it != null ? it.value : void 8;
        }),
        tether: false
      };
    },
    render: function(){
      var ref$, anchor, filteredOptions, highlightedUid, onAnchorChange, onOpenChange, onHighlightedUidChange, onSearchChange, onValuesChange, search, open, options, values, autofocus, autosize, cancelKeyboardEventOnSelection, delimiters, disabled, dropdownDirection, groupId, groups, groupsAsColumns, hideResetButton, inputProps, name, onKeyboardSelectionFailed, renderToggleButton, renderGroupTitle, renderResetButton, serialize, tether, tetherProps, theme, transitionEnter, transitionLeave, transitionEnterTimeout, transitionLeaveTimeout, uid, this$ = this;
      ref$ = this.getComputedState(), anchor = ref$.anchor, filteredOptions = ref$.filteredOptions, highlightedUid = ref$.highlightedUid, onAnchorChange = ref$.onAnchorChange, onOpenChange = ref$.onOpenChange, onHighlightedUidChange = ref$.onHighlightedUidChange, onSearchChange = ref$.onSearchChange, onValuesChange = ref$.onValuesChange, search = ref$.search, open = ref$.open, options = ref$.options, values = ref$.values;
      if ((ref$ = this.props) != null) {
        autofocus = ref$.autofocus, autosize = ref$.autosize, cancelKeyboardEventOnSelection = ref$.cancelKeyboardEventOnSelection, delimiters = ref$.delimiters, disabled = ref$.disabled, dropdownDirection = ref$.dropdownDirection, groupId = ref$.groupId, groups = ref$.groups, groupsAsColumns = ref$.groupsAsColumns, hideResetButton = ref$.hideResetButton, inputProps = ref$.inputProps, name = ref$.name, onKeyboardSelectionFailed = ref$.onKeyboardSelectionFailed, renderToggleButton = ref$.renderToggleButton, renderGroupTitle = ref$.renderGroupTitle, renderResetButton = ref$.renderResetButton, serialize = ref$.serialize, tether = ref$.tether, tetherProps = ref$.tetherProps, theme = ref$.theme, transitionEnter = ref$.transitionEnter, transitionLeave = ref$.transitionLeave, transitionEnterTimeout = ref$.transitionEnterTimeout, transitionLeaveTimeout = ref$.transitionLeaveTimeout, uid = ref$.uid;
      }
      return ReactSelectize(import$(import$({
        autofocus: autofocus,
        autosize: autosize,
        cancelKeyboardEventOnSelection: cancelKeyboardEventOnSelection,
        className: "multi-select " + this.props.className,
        delimiters: delimiters,
        disabled: disabled,
        dropdownDirection: dropdownDirection,
        groupId: groupId,
        groups: groups,
        groupsAsColumns: groupsAsColumns,
        hideResetButton: hideResetButton,
        highlightedUid: highlightedUid,
        onHighlightedUidChange: onHighlightedUidChange,
        inputProps: inputProps,
        name: name,
        onKeyboardSelectionFailed: onKeyboardSelectionFailed,
        renderGroupTitle: renderGroupTitle,
        renderResetButton: renderResetButton,
        renderToggleButton: renderToggleButton,
        scrollLock: this.state.scrollLock,
        onScrollLockChange: function(scrollLock){
          return this$.setState({
            scrollLock: scrollLock
          });
        },
        tether: tether,
        tetherProps: tetherProps,
        theme: theme,
        transitionEnter: transitionEnter,
        transitionEnterTimeout: transitionEnterTimeout,
        transitionLeave: transitionLeave,
        transitionLeaveTimeout: transitionLeaveTimeout,
        uid: uid,
        ref: 'select',
        anchor: anchor,
        onAnchorChange: onAnchorChange,
        open: open,
        onOpenChange: onOpenChange,
        options: options,
        renderOption: this.props.renderOption,
        firstOptionIndexToHighlight: function(){
          return this$.firstOptionIndexToHighlight(options);
        },
        search: search,
        onSearchChange: function(search, callback){
          return onSearchChange(!!this$.props.maxValues && values.length >= this$.props.maxValues ? "" : search, callback);
        },
        values: values,
        onValuesChange: function(newValues, callback){
          return onValuesChange(newValues, function(){
            callback();
            if (this$.props.closeOnSelect || (!!this$.props.maxValues && this$.values().length >= this$.props.maxValues)) {
              return onOpenChange(false, function(){});
            }
          });
        },
        renderValue: this.props.renderValue,
        serialize: serialize,
        onBlur: function(e){
          onSearchChange("", function(){
            return this$.props.onBlur({
              open: open,
              values: values,
              originalEvent: e
            });
          });
        },
        onFocus: function(e){
          this$.props.onFocus({
            open: open,
            values: values,
            originalEvent: e
          });
        },
        onPaste: (function(){
          var ref$;
          switch (false) {
          case typeof ((ref$ = this.props) != null ? ref$.valuesFromPaste : void 8) !== 'undefined':
            return this.props.onPaste;
          default:
            return function(e){
              var clipboardData;
              clipboardData = e.clipboardData;
              (function(){
                var newValues;
                newValues = values.concat(this$.props.valuesFromPaste(options, values, clipboardData.getData('text')));
                return onValuesChange(newValues, function(){
                  return onAnchorChange(last(newValues));
                });
              })();
              return cancelEvent(e);
            };
          }
        }.call(this)),
        placeholder: this.props.placeholder,
        style: this.props.style
      }, (function(){
        switch (false) {
        case typeof this.props.restoreOnBackspace !== 'function':
          return {
            restoreOnBackspace: this.props.restoreOnBackspace
          };
        default:
          return {};
        }
      }.call(this))), (function(){
        switch (false) {
        case typeof this.props.renderNoResultsFound !== 'function':
          return {
            renderNoResultsFound: function(){
              return this$.props.renderNoResultsFound(values, search);
            }
          };
        default:
          return {};
        }
      }.call(this))));
    },
    getComputedState: function(){
      var anchor, highlightedUid, open, search, values, ref$, onAnchorChange, onHighlightedUidChange, onOpenChange, onSearchChange, onValuesChange, optionsFromChildren, unfilteredOptions, filteredOptions, newOption, options, this$ = this;
      anchor = this.props.hasOwnProperty('anchor')
        ? this.props.anchor
        : this.state.anchor;
      highlightedUid = this.props.hasOwnProperty('highlightedUid')
        ? this.props.highlightedUid
        : this.state.highlightedUid;
      open = this.isOpen();
      search = this.props.hasOwnProperty('search')
        ? this.props.search
        : this.state.search;
      values = this.values();
      ref$ = map(function(p){
        switch (false) {
        case !(this$.props.hasOwnProperty(p) && this$.props.hasOwnProperty(camelize("on-" + p + "-change"))):
          return function(o, callback){
            this$.props[camelize("on-" + p + "-change")](o, function(){});
            return this$.setState({}, callback);
          };
        case !(this$.props.hasOwnProperty(p) && !this$.props.hasOwnProperty(camelize("on-" + p + "-change"))):
          return function(arg$, callback){
            return callback();
          };
        case !(!this$.props.hasOwnProperty(p) && this$.props.hasOwnProperty(camelize("on-" + p + "-change"))):
          return function(o, callback){
            var ref$;
            return this$.setState((ref$ = {}, ref$[p + ""] = o, ref$), function(){
              callback();
              return this$.props[camelize("on-" + p + "-change")](o, function(){});
            });
          };
        case !(!this$.props.hasOwnProperty(p) && !this$.props.hasOwnProperty(camelize("on-" + p + "-change"))):
          return function(o, callback){
            var ref$;
            return this$.setState((ref$ = {}, ref$[p + ""] = o, ref$), callback);
          };
        }
      })(
      ['anchor', 'highlightedUid', 'open', 'search', 'values']), onAnchorChange = ref$[0], onHighlightedUidChange = ref$[1], onOpenChange = ref$[2], onSearchChange = ref$[3], onValuesChange = ref$[4];
      optionsFromChildren = (function(){
        var ref$;
        switch (false) {
        case !((ref$ = this.props) != null && ref$.children):
          return map(function(arg$){
            var props, value, children;
            if (arg$ != null) {
              props = arg$.props;
            }
            if (props != null) {
              value = props.value, children = props.children;
            }
            return {
              label: children,
              value: value
            };
          })(
          toString$.call(this.props.children).slice(8, -1) === 'Array'
            ? this.props.children
            : [this.props.children]);
        default:
          return [];
        }
      }.call(this));
      unfilteredOptions = this.props.hasOwnProperty('options') ? (ref$ = this.props.options) != null
        ? ref$
        : [] : optionsFromChildren;
      filteredOptions = this.props.filterOptions(unfilteredOptions, values, search);
      newOption = (function(){
        switch (false) {
        case typeof this.props.createFromSearch !== 'function':
          return this.props.createFromSearch(filteredOptions, values, search);
        default:
          return null;
        }
      }.call(this));
      options = (!!newOption
        ? [(ref$ = import$({}, newOption), ref$.newOption = true, ref$)]
        : []).concat(filteredOptions);
      return {
        anchor: anchor,
        highlightedUid: highlightedUid,
        search: search,
        values: values,
        onAnchorChange: onAnchorChange,
        onHighlightedUidChange: onHighlightedUidChange,
        open: open,
        onOpenChange: function(open, callback){
          onOpenChange((function(){
            switch (false) {
            case !(typeof this.props.maxValues !== 'undefined' && this.values().length >= this.props.maxValues):
              return false;
            default:
              return open;
            }
          }.call(this$)), callback);
        },
        onSearchChange: onSearchChange,
        onValuesChange: onValuesChange,
        filteredOptions: filteredOptions,
        options: options
      };
    },
    getInitialState: function(){
      return {
        anchor: !!this.props.values ? last(this.props.values) : undefined,
        highlightedUid: undefined,
        open: false,
        scrollLock: false,
        search: "",
        values: this.props.defaultValues
      };
    },
    firstOptionIndexToHighlight: function(options){
      var optionIndexToHighlight, search;
      optionIndexToHighlight = (function(){
        var ref$;
        switch (false) {
        case options.length !== 1:
          return 0;
        case typeof ((ref$ = options[0]) != null ? ref$.newOption : void 8) !== 'undefined':
          return 0;
        default:
          if (all(function(it){
            return typeof it.selectable === 'boolean' && !it.selectable;
          })(
          drop(1)(
          options))) {
            return 0;
          } else {
            return 1;
          }
        }
      }());
      search = this.props.hasOwnProperty('search')
        ? this.props.search
        : this.state.search;
      return this.props.firstOptionIndexToHighlight(optionIndexToHighlight, options, this.values(), search);
    },
    focus: function(){
      this.refs.select.focus();
    },
    blur: function(){
      this.refs.select.blur();
    },
    highlightFirstSelectableOption: function(){
      if (this.state.open) {
        this.refs.select.highlightAndScrollToSelectableOption(this.firstOptionIndexToHighlight(this.getComputedState().options), 1);
      }
    },
    values: function(){
      if (this.props.hasOwnProperty('values')) {
        return this.props.values;
      } else {
        return this.state.values;
      }
    },
    isOpen: function(){
      if (this.props.hasOwnProperty('open')) {
        return this.props.open;
      } else {
        return this.state.open;
      }
    }
  });
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ReactSelectize":7,"./utils":15,"prelude-ls":undefined}],6:[function(require,module,exports){
(function (global){
(function(){
  var ref$, createClass, div, isEqualToObject, cancelEvent;
  ref$ = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createClass = ref$.createClass, div = ref$.DOM.div;
  isEqualToObject = (typeof window !== "undefined" ? window['preludeExtension'] : typeof global !== "undefined" ? global['preludeExtension'] : null).isEqualToObject;
  cancelEvent = require('./utils').cancelEvent;
  module.exports = createClass({
    getDefaultProps: function(){
      return {};
    },
    render: function(){
      var this$ = this;
      return div({
        className: "option-wrapper " + (!!this.props.highlight ? 'highlight' : ''),
        onMouseDown: function(e){
          var listener;
          listener = function(e){
            this$.props.onClick(e);
            return window.removeEventListener('mouseup', listener);
          };
          window.addEventListener('mouseup', listener);
          return cancelEvent(e);
        },
        onMouseMove: this.props.onMouseMove,
        onMouseOut: this.props.onMouseOut,
        onMouseOver: this.props.onMouseOver
      }, this.props.renderItem(this.props.item));
    },
    shouldComponentUpdate: function(nextProps){
      var ref$, ref1$, ref2$;
      return !isEqualToObject(nextProps != null ? nextProps.uid : void 8, (ref$ = this.props) != null ? ref$.uid : void 8) || (nextProps != null ? nextProps.highlight : void 8) !== ((ref1$ = this.props) != null ? ref1$.highlight : void 8) || (nextProps != null ? nextProps.selectable : void 8) !== ((ref2$ = this.props) != null ? ref2$.selectable : void 8);
    }
  });
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":15}],7:[function(require,module,exports){
(function (global){
(function(){
  var ref$, each, filter, find, findIndex, id, initial, last, map, objToPairs, partition, reject, reverse, Str, sortBy, sum, values, clamp, isEqualToObject, React, div, input, path, span, svg, createClass, createFactory, findDOMNode, ReactCSSTransitionGroup, ToggleButton, DropdownMenu, OptionWrapper, ValueWrapper, ResetButton, ResizableInput, cancelEvent, classNameFromObject;
  ref$ = require('prelude-ls'), each = ref$.each, filter = ref$.filter, find = ref$.find, findIndex = ref$.findIndex, id = ref$.id, initial = ref$.initial, last = ref$.last, map = ref$.map, objToPairs = ref$.objToPairs, partition = ref$.partition, reject = ref$.reject, reverse = ref$.reverse, Str = ref$.Str, sortBy = ref$.sortBy, sum = ref$.sum, values = ref$.values;
  ref$ = (typeof window !== "undefined" ? window['preludeExtension'] : typeof global !== "undefined" ? global['preludeExtension'] : null), clamp = ref$.clamp, isEqualToObject = ref$.isEqualToObject;
  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), ref$ = React.DOM, div = ref$.div, input = ref$.input, path = ref$.path, span = ref$.span, svg = ref$.svg, createClass = React.createClass, createFactory = React.createFactory;
  findDOMNode = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null).findDOMNode;
  ReactCSSTransitionGroup = createFactory((typeof window !== "undefined" ? window['React']['addons']['CSSTransitionGroup'] : typeof global !== "undefined" ? global['React']['addons']['CSSTransitionGroup'] : null));
  ToggleButton = createFactory(require('./ToggleButton'));
  DropdownMenu = createFactory(require('./DropdownMenu'));
  OptionWrapper = createFactory(require('./OptionWrapper'));
  ValueWrapper = createFactory(require('./ValueWrapper'));
  ResetButton = createFactory(require('./ResetButton'));
  ResizableInput = createFactory(require('./ResizableInput'));
  ref$ = require('./utils'), cancelEvent = ref$.cancelEvent, classNameFromObject = ref$.classNameFromObject;
  module.exports = createClass({
    displayName: 'ReactSelectize',
    focusLock: false,
    getDefaultProps: function(){
      return {
        anchor: null,
        autofocus: false,
        cancelKeyboardEventOnSelection: true,
        delimiters: [],
        disabled: false,
        dropdownDirection: 1,
        firstOptionIndexToHighlight: function(options){
          return 0;
        },
        groupId: function(it){
          return it.groupId;
        },
        groupsAsColumns: false,
        highlightedUid: undefined,
        inputProps: {},
        onAnchorChange: function(anchor){},
        onBlur: function(e){},
        onEnter: function(highlightedOption){},
        onFocus: function(e){},
        onHighlightedUidChange: function(uid, callback){},
        onKeyboardSelectionFailed: function(keycode){},
        onOpenChange: function(open, callback){},
        onPaste: function(e){
          true;
        },
        onScrollLockChange: function(scrollLock){},
        onSearchChange: function(search, callback){},
        onValuesChange: function(values, callback){},
        open: false,
        hideResetButton: false,
        renderValue: function(arg$){
          var label;
          label = arg$.label;
          return div({
            className: 'simple-value'
          }, span(null, label));
        },
        renderToggleButton: ToggleButton,
        renderResetButton: ResetButton,
        scrollLock: false,
        search: "",
        style: {},
        theme: 'default',
        uid: id,
        values: []
      };
    },
    render: function(){
      var anchorIndex, renderSelectedValues, flipped, ref$, ref1$, this$ = this;
      anchorIndex = (function(){
        var ref$;
        switch (false) {
        case !(typeof this.props.anchor === 'undefined' || this.props.anchor === null):
          return -1;
        default:
          return (ref$ = findIndex(function(it){
            return this$.isEqualToObject(it, this$.props.anchor);
          }, this.props.values)) != null
            ? ref$
            : this.props.values.length - 1;
        }
      }.call(this));
      renderSelectedValues = function(selectedValues){
        return map(function(index){
          var item, uid;
          item = this$.props.values[index];
          uid = this$.props.uid(item);
          return ValueWrapper({
            key: this$.uidToString(uid),
            uid: uid,
            item: item,
            renderItem: this$.props.renderValue
          });
        })(
        selectedValues);
      };
      flipped = this.props.dropdownDirection === -1;
      return div({
        className: classNameFromObject((ref$ = {
          'react-selectize': 1
        }, ref$[this.props.theme + ""] = 1, ref$['root-node'] = 1, ref$[this.props.className + ""] = 1, ref$.disabled = this.props.disabled, ref$.open = this.props.open, ref$.flipped = flipped, ref$.tethered = this.props.tether, ref$)),
        style: this.props.style
      }, !!this.props.name ? input({
        type: 'hidden',
        name: this.props.name,
        value: this.props.serialize(this.props.values)
      }) : void 8, div({
        className: 'react-selectize-control',
        ref: 'control',
        onMouseDown: function(e){
          (function(){
            return this$.props.onAnchorChange(last(this$.props.values), function(){
              return this$.onOpenChange(true, function(){
                return this$.highlightAndFocus();
              });
            });
          })();
          if (!this$.props.open) {
            return cancelEvent(e);
          }
        }
      }, this.props.search.length === 0 && this.props.values.length === 0 ? div({
        className: 'react-selectize-placeholder'
      }, this.props.placeholder) : void 8, div({
        className: 'react-selectize-search-field-and-selected-values'
      }, renderSelectedValues((function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = anchorIndex; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }())), ResizableInput((ref$ = import$({
        disabled: this.props.disabled
      }, this.props.inputProps), ref$.ref = 'search', ref$.type = 'text', ref$.value = this.props.search, ref$.onChange = function(arg$){
        var value;
        value = arg$.currentTarget.value;
        return this$.props.onSearchChange(value, function(){
          return this$.highlightAndScrollToSelectableOption(this$.props.firstOptionIndexToHighlight(this$.props.options), 1);
        });
      }, ref$.onFocus = function(e){
        (function(){
          return function(callback){
            if (!!this$.focusLock) {
              return callback(this$.focusLock = false);
            } else {
              return this$.onOpenChange(true, function(){
                return callback(true);
              });
            }
          };
        })()(function(){
          return this$.props.onFocus(e);
        });
      }, ref$.onBlur = function(e){
        if (this$.refs.dropdownMenu && document.activeElement === findDOMNode(this$.refs.dropdownMenu)) {
          return;
        }
        return this$.closeDropdown(function(){
          return this$.props.onBlur(e);
        });
      }, ref$.onPaste = this.props.onPaste, ref$.onKeyDown = function(e){
        return this$.handleKeydown({
          anchorIndex: anchorIndex
        }, e);
      }, ref$)), renderSelectedValues((function(){
        var i$, to$, results$ = [];
        for (i$ = anchorIndex + 1, to$ = this.props.values.length; i$ < to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }.call(this)))), this.props.values.length > 0 && !this.props.hideResetButton ? div({
        className: 'react-selectize-reset-button-container',
        onClick: function(e){
          (function(){
            return this$.props.onValuesChange([], function(){
              return this$.props.onSearchChange("", function(){
                return this$.highlightAndFocus();
              });
            });
          })();
          return cancelEvent(e);
        }
      }, this.props.renderResetButton()) : void 8, div({
        className: 'react-selectize-toggle-button-container',
        onMouseDown: function(e){
          if (this$.props.open) {
            this$.onOpenChange(false, function(){});
          } else {
            this$.props.onAnchorChange(last(this$.props.values), function(){
              return this$.onOpenChange(true, function(){});
            });
          }
          return cancelEvent(e);
        }
      }, this.props.renderToggleButton({
        open: this.props.open,
        flipped: flipped
      }))), DropdownMenu((ref$ = import$({}, this.props), ref$.ref = 'dropdownMenu', ref$.className = classNameFromObject((ref1$ = {
        'react-selectize': 1
      }, ref1$[this.props.className + ""] = 1, ref1$)), ref$.theme = this.props.theme, ref$.scrollLock = this.props.scrollLock, ref$.onScrollChange = this.props.onScrollChange, ref$.bottomAnchor = function(){
        return findDOMNode(this$.refs.control);
      }, ref$.tetherProps = (ref1$ = import$({}, this.props.tetherProps), ref1$.target = function(){
        return findDOMNode(this$.refs.control);
      }, ref1$), ref$.highlightedUid = this.props.highlightedUid, ref$.onHighlightedUidChange = this.props.onHighlightedUidChange, ref$.onOptionClick = function(highlightedUid){
        this$.selectHighlightedUid(anchorIndex, function(){});
      }, ref$)));
    },
    handleKeydown: function(arg$, e){
      var anchorIndex, result, index, this$ = this;
      anchorIndex = arg$.anchorIndex;
      switch (e.which) {
      case 8:
        if (this.props.search.length > 0 || anchorIndex === -1) {
          return;
        }
        (function(){
          var anchorIndexOnRemove, nextAnchor, valueToRemove, ref$;
          anchorIndexOnRemove = anchorIndex;
          nextAnchor = anchorIndex - 1 < 0
            ? undefined
            : this$.props.values[anchorIndex - 1];
          valueToRemove = this$.props.values[anchorIndex];
          return this$.props.onValuesChange((ref$ = reject(function(it){
            return this$.isEqualToObject(it, valueToRemove);
          })(
          this$.props.values)) != null
            ? ref$
            : [], function(){
            return function(){
              return function(callback){
                if (typeof find(function(it){
                  return this$.isEqualToObject(it, valueToRemove);
                }, this$.props.values) === 'undefined') {
                  if (!!this$.props.restoreOnBackspace) {
                    return this$.props.onSearchChange(this$.props.restoreOnBackspace(valueToRemove), function(){
                      return callback(true);
                    });
                  } else {
                    return callback(true);
                  }
                } else {
                  return callback(false);
                }
              };
            }()(function(result){
              if (!!result) {
                this$.highlightAndScrollToSelectableOption(this$.props.firstOptionIndexToHighlight(this$.props.options), 1);
                if (anchorIndex === anchorIndexOnRemove && (typeof nextAnchor === 'undefined' || !!find(function(it){
                  return this$.isEqualToObject(it, nextAnchor);
                })(
                this$.props.values))) {
                  return this$.props.onAnchorChange(nextAnchor, function(){});
                }
              }
            });
          });
        })();
        cancelEvent(e);
        break;
      case 27:
        (function(){
          if (this$.props.open) {
            return function(it){
              return this$.onOpenChange(false, it);
            };
          } else {
            return function(it){
              return this$.props.onValuesChange([], it);
            };
          }
        })()(function(){
          return this$.props.onSearchChange("", function(){
            return this$.focusOnInput();
          });
        });
      }
      if (this.props.open && in$(e.which, [13].concat(this.props.delimiters)) && !((e != null && e.metaKey) || (e != null && e.ctrlKey) || (e != null && e.shiftKey))) {
        result = this.selectHighlightedUid(anchorIndex, function(selectedValue){
          if (typeof selectedValue === 'undefined') {
            return this$.props.onKeyboardSelectionFailed(e.which);
          }
        });
        if (result && this.props.cancelKeyboardEventOnSelection) {
          return cancelEvent(e);
        }
      }
      if (this.props.search.length === 0) {
        switch (e.which) {
        case 37:
          this.props.onAnchorChange(anchorIndex - 1 < 0 || e.metaKey
            ? undefined
            : this.props.values[clamp(anchorIndex - 1, 0, this.props.values.length - 1)], function(){});
          break;
        case 39:
          this.props.onAnchorChange(e.metaKey
            ? last(this.props.values)
            : this.props.values[clamp(anchorIndex + 1, 0, this.props.values.length - 1)], function(){});
        }
      }
      switch (e.which) {
      case 38:
        this.props.onScrollLockChange(true);
        index = (function(){
          switch (false) {
          case typeof this.props.highlightedUid !== 'undefined':
            return 0;
          default:
            return -1 + this.optionIndexFromUid(this.props.highlightedUid);
          }
        }.call(this));
        return this.highlightAndScrollToSelectableOption(index, -1, function(result){
          if (!result) {
            return this$.highlightAndScrollToSelectableOption(this$.props.options.length - 1, -1);
          }
        });
      case 40:
        this.props.onScrollLockChange(true);
        index = (function(){
          switch (false) {
          case typeof this.props.highlightedUid !== 'undefined':
            return 0;
          default:
            return 1 + this.optionIndexFromUid(this.props.highlightedUid);
          }
        }.call(this));
        return this.highlightAndScrollToSelectableOption(index, 1, function(result){
          if (!result) {
            return this$.highlightAndScrollToSelectableOption(0, 1);
          }
        });
      }
    },
    componentDidMount: function(){
      if (this.props.autofocus) {
        this.focus();
      }
      if (this.props.open) {
        this.highlightAndFocus();
      }
    },
    componentDidUpdate: function(prevProps){
      var this$ = this;
      if (this.props.open && !prevProps.open && this.props.highlightedUid === undefined) {
        this.highlightAndFocus();
      }
      if (!this.props.open && prevProps.open) {
        this.props.onHighlightedUidChange(undefined, function(){});
      }
    },
    componentWillReceiveProps: function(props){
      var this$ = this;
      if ((typeof this.props.disabled === 'undefined' || this.props.disabled === false) && (typeof props.disabled !== 'undefined' && props.disabled === true)) {
        this.onOpenChange(false, function(){});
      }
    },
    optionIndexFromUid: function(uid){
      var this$ = this;
      return findIndex(function(it){
        return isEqualToObject(uid, this$.props.uid(it));
      })(
      this.props.options);
    },
    closeDropdown: function(callback){
      var this$ = this;
      this.onOpenChange(false, function(){
        return this$.props.onAnchorChange(last(this$.props.values), callback);
      });
    },
    blur: function(){
      this.refs.search.blur();
    },
    focus: function(){
      this.refs.search.focus();
    },
    focusOnInput: function(){
      var input;
      input = findDOMNode(this.refs.search);
      if (input !== document.activeElement) {
        this.focusLock = true;
        input.focus();
        input.value = input.value;
      }
    },
    highlightAndFocus: function(){
      this.highlightAndScrollToSelectableOption(this.props.firstOptionIndexToHighlight(this.props.options), 1);
      this.focusOnInput();
    },
    highlightAndScrollToOption: function(index, callback){
      callback == null && (callback = function(){});
      this.refs.dropdownMenu.highlightAndScrollToOption(index, callback);
    },
    highlightAndScrollToSelectableOption: function(index, direction, callback){
      var this$ = this;
      callback == null && (callback = function(){});
      (function(){
        if (!this$.props.open) {
          return function(it){
            return this$.onOpenChange(true, it);
          };
        } else {
          return function(it){
            return it();
          };
        }
      })()(function(){
        return this$.refs.dropdownMenu.highlightAndScrollToSelectableOption(index, direction, callback);
      });
    },
    isEqualToObject: function(){
      return isEqualToObject(this.props.uid(arguments[0]), this.props.uid(arguments[1]));
    },
    onOpenChange: function(open, callback){
      return this.props.onOpenChange(this.props.disabled ? false : open, callback);
    },
    selectHighlightedUid: function(anchorIndex, callback){
      var index, option, this$ = this;
      if (this.props.highlightedUid === undefined) {
        callback();
        return false;
      }
      index = this.optionIndexFromUid(this.props.highlightedUid);
      if (typeof index !== 'number') {
        callback();
        return false;
      }
      option = this.props.options[index];
      (function(){
        return this$.props.onValuesChange(map(function(it){
          return this$.props.values[it];
        }, (function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = anchorIndex; i$ <= to$; ++i$) {
            results$.push(i$);
          }
          return results$;
        }())).concat([option], map(function(it){
          return this$.props.values[it];
        }, (function(){
          var i$, to$, results$ = [];
          for (i$ = anchorIndex + 1, to$ = this.props.values.length; i$ < to$; ++i$) {
            results$.push(i$);
          }
          return results$;
        }.call(this$)))), function(){
          var value;
          value = find(function(it){
            return this$.isEqualToObject(it, option);
          }, this$.props.values);
          if (!value) {
            callback();
            return;
          }
          return this$.props.onSearchChange("", function(){
            return this$.props.onAnchorChange(value, function(){
              if (!this$.props.open) {
                callback(value);
                return;
              }
              return this$.highlightAndScrollToSelectableOption(index, 1, function(result){
                if (!!result) {
                  callback(value);
                  return;
                }
                return this$.highlightAndScrollToSelectableOption(this$.props.firstOptionIndexToHighlight(this$.props.options), 1, function(result){
                  if (!result) {
                    return this$.onOpenChange(false, function(){
                      return callback(value);
                    });
                  } else {
                    return callback(value);
                  }
                });
              });
            });
          });
        });
      })();
      return true;
    },
    uidToString: function(uid){
      return (typeof uid === 'object' ? JSON.stringify : id)(uid);
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./DropdownMenu":3,"./OptionWrapper":6,"./ResetButton":9,"./ResizableInput":10,"./ToggleButton":13,"./ValueWrapper":14,"./utils":15,"prelude-ls":undefined}],8:[function(require,module,exports){
(function (global){
(function(){
  var createClass, ref$, render, unmountComponentAtNode, shallowCompare, Tether;
  createClass = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null).createClass;
  ref$ = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null), render = ref$.render, unmountComponentAtNode = ref$.unmountComponentAtNode;
  shallowCompare = (typeof window !== "undefined" ? window['React']['addons']['shallowCompare'] : typeof global !== "undefined" ? global['React']['addons']['shallowCompare'] : null);
  Tether = (typeof window !== "undefined" ? window['Tether'] : typeof global !== "undefined" ? global['Tether'] : null);
  module.exports = createClass({
    getDefaultProps: function(){
      return {
        parentElement: function(){
          return document.body;
        }
      };
    },
    render: function(){
      return null;
    },
    initTether: function(props){
      var this$ = this;
      this.node = document.createElement('div');
      this.props.parentElement().appendChild(this.node);
      this.tether = new Tether(import$({
        element: this.node,
        target: props.target()
      }, props.options));
      render(props.children, this.node, function(){
        return this$.tether.position();
      });
    },
    destroyTether: function(){
      if (this.tether) {
        this.tether.destroy();
      }
      if (this.node) {
        unmountComponentAtNode(this.node);
        this.node.parentElement.removeChild(this.node);
      }
      this.node = this.tether = undefined;
    },
    componentDidMount: function(){
      if (this.props.children) {
        this.initTether(this.props);
      }
    },
    componentWillReceiveProps: function(newProps){
      var this$ = this;
      if (this.props.children && !newProps.children) {
        this.destroyTether();
      } else if (newProps.children && !this.props.children) {
        this.initTether(newProps);
      } else if (newProps.children) {
        this.tether.setOptions(import$({
          element: this.node,
          target: newProps.target()
        }, newProps.options));
        render(newProps.children, this.node, function(){
          return this$.tether.position();
        });
      }
    },
    shouldComponentUpdate: function(nextProps, nextState){
      return shallowCompare(this, nextProps, nextState);
    },
    componentWillUnmount: function(){
      this.destroyTether();
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
(function (global){
(function(){
  var ref$, createClass, createFactory, path, SvgWrapper;
  ref$ = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createClass = ref$.createClass, createFactory = ref$.createFactory, path = ref$.DOM.path;
  SvgWrapper = createFactory(require('./SvgWrapper'));
  module.exports = createClass({
    render: function(){
      return SvgWrapper({
        className: 'react-selectize-reset-button',
        style: {
          width: 8,
          height: 8
        }
      }, path({
        d: "M0 0 L8 8 M8 0 L 0 8"
      }));
    }
  });
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./SvgWrapper":12}],10:[function(require,module,exports){
(function (global){
(function(){
  var ref$, each, objToPairs, React, input, createClass, createFactory, findDOMNode;
  ref$ = require('prelude-ls'), each = ref$.each, objToPairs = ref$.objToPairs;
  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), input = React.DOM.input, createClass = React.createClass, createFactory = React.createFactory;
  findDOMNode = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null).findDOMNode;
  module.exports = createClass({
    displayName: 'ResizableInput',
    render: function(){
      var ref$;
      return input((ref$ = import$({}, this.props), ref$.type = 'input', ref$.className = 'resizable-input', ref$));
    },
    autosize: function(){
      var x$, inputElement, y$, dummpyInput, ref$;
      x$ = inputElement = findDOMNode(this);
      x$.style.width = '0px';
      if (inputElement.value.length === 0) {
        return inputElement.style.width = !!(inputElement != null && inputElement.currentStyle) ? '4px' : '2px';
      } else {
        if (inputElement.scrollWidth > 0) {
          return inputElement.style.width = (2 + inputElement.scrollWidth) + "px";
        } else {
          y$ = dummpyInput = document.createElement('div');
          y$.innerHTML = inputElement.value;
          (function(){
            var ref$;
            return ref$ = dummpyInput.style, ref$.display = 'inline-block', ref$.width = "", ref$;
          })(
          each(function(arg$){
            var key, value;
            key = arg$[0], value = arg$[1];
            return dummpyInput.style[key] = value;
          })(
          objToPairs(
          !!inputElement.currentStyle
            ? inputElement.currentStyle
            : (ref$ = document.defaultView) != null
              ? ref$
              : window.getComputedStyle(inputElement))));
          document.body.appendChild(dummpyInput);
          inputElement.style.width = (4 + dummpyInput.clientWidth) + "px";
          return document.body.removeChild(dummpyInput);
        }
      }
    },
    componentDidMount: function(){
      this.autosize();
    },
    componentDidUpdate: function(){
      this.autosize();
    },
    blur: function(){
      return findDOMNode(this).blur();
    },
    focus: function(){
      return findDOMNode(this).focus();
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"prelude-ls":undefined}],11:[function(require,module,exports){
(function (global){
(function(){
  var ref$, all, any, drop, camelize, difference, filter, find, findIndex, id, last, map, reject, isEqualToObject, React, createFactory, div, img, span, ReactSelectize, cancelEvent, toString$ = {}.toString;
  ref$ = require('prelude-ls'), all = ref$.all, any = ref$.any, drop = ref$.drop, camelize = ref$.camelize, difference = ref$.difference, filter = ref$.filter, find = ref$.find, findIndex = ref$.findIndex, id = ref$.id, last = ref$.last, map = ref$.map, reject = ref$.reject;
  isEqualToObject = (typeof window !== "undefined" ? window['preludeExtension'] : typeof global !== "undefined" ? global['preludeExtension'] : null).isEqualToObject;
  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createFactory = React.createFactory, ref$ = React.DOM, div = ref$.div, img = ref$.img, span = ref$.span;
  ReactSelectize = createFactory(require('./ReactSelectize'));
  cancelEvent = require('./utils').cancelEvent;
  module.exports = React.createClass({
    displayName: 'SimpleSelect',
    getDefaultProps: function(){
      return {
        delimiters: [],
        filterOptions: curry$(function(options, search){
          var this$ = this;
          return filter(function(it){
            return it.label.toLowerCase().trim().indexOf(search.toLowerCase().trim()) > -1;
          })(
          options);
        }),
        firstOptionIndexToHighlight: id,
        onBlur: function(e){},
        onFocus: function(e){},
        onKeyboardSelectionFailed: function(which){},
        onPaste: function(e){
          true;
        },
        placeholder: "",
        renderValue: function(arg$){
          var label;
          label = arg$.label;
          return div({
            className: 'simple-value'
          }, span(null, label));
        },
        serialize: function(it){
          return it != null ? it.value : void 8;
        },
        style: {},
        tether: false,
        uid: id
      };
    },
    render: function(){
      var ref$, filteredOptions, highlightedUid, onHighlightedUidChange, onOpenChange, onSearchChange, onValueChange, open, options, search, value, values, autofocus, autosize, cancelKeyboardEventOnSelection, delimiters, disabled, dropdownDirection, groupId, groups, groupsAsColumns, hideResetButton, name, inputProps, renderToggleButton, renderGroupTitle, renderResetButton, serialize, tether, tetherProps, theme, transitionEnter, transitionLeave, transitionEnterTimeout, transitionLeaveTimeout, uid, this$ = this;
      ref$ = this.getComputedState(), filteredOptions = ref$.filteredOptions, highlightedUid = ref$.highlightedUid, onHighlightedUidChange = ref$.onHighlightedUidChange, onOpenChange = ref$.onOpenChange, onSearchChange = ref$.onSearchChange, onValueChange = ref$.onValueChange, open = ref$.open, options = ref$.options, search = ref$.search, value = ref$.value, values = ref$.values;
      if ((ref$ = this.props) != null) {
        autofocus = ref$.autofocus, autosize = ref$.autosize, cancelKeyboardEventOnSelection = ref$.cancelKeyboardEventOnSelection, delimiters = ref$.delimiters, disabled = ref$.disabled, dropdownDirection = ref$.dropdownDirection, groupId = ref$.groupId, groups = ref$.groups, groupsAsColumns = ref$.groupsAsColumns, hideResetButton = ref$.hideResetButton, name = ref$.name, inputProps = ref$.inputProps, renderToggleButton = ref$.renderToggleButton, renderGroupTitle = ref$.renderGroupTitle, renderResetButton = ref$.renderResetButton, serialize = ref$.serialize, tether = ref$.tether, tetherProps = ref$.tetherProps, theme = ref$.theme, transitionEnter = ref$.transitionEnter, transitionLeave = ref$.transitionLeave, transitionEnterTimeout = ref$.transitionEnterTimeout, transitionLeaveTimeout = ref$.transitionLeaveTimeout, uid = ref$.uid;
      }
      return ReactSelectize(import$(import$({
        autofocus: autofocus,
        autosize: autosize,
        cancelKeyboardEventOnSelection: cancelKeyboardEventOnSelection,
        className: "simple-select" + (!!this.props.className ? " " + this.props.className : ""),
        delimiters: delimiters,
        disabled: disabled,
        dropdownDirection: dropdownDirection,
        groupId: groupId,
        groups: groups,
        groupsAsColumns: groupsAsColumns,
        hideResetButton: hideResetButton,
        highlightedUid: highlightedUid,
        onHighlightedUidChange: onHighlightedUidChange,
        inputProps: inputProps,
        name: name,
        renderGroupTitle: renderGroupTitle,
        renderResetButton: renderResetButton,
        renderToggleButton: renderToggleButton,
        scrollLock: this.state.scrollLock,
        onScrollLockChange: function(scrollLock){
          return this$.setState({
            scrollLock: scrollLock
          });
        },
        tether: tether,
        tetherProps: tetherProps,
        theme: theme,
        transitionEnter: transitionEnter,
        transitionEnterTimeout: transitionEnterTimeout,
        transitionLeave: transitionLeave,
        transitionLeaveTimeout: transitionLeaveTimeout,
        ref: 'select',
        anchor: last(values),
        onAnchorChange: function(arg$, callback){
          return callback();
        },
        open: open,
        onOpenChange: onOpenChange,
        firstOptionIndexToHighlight: function(){
          return this$.firstOptionIndexToHighlight(options, value);
        },
        options: options,
        renderOption: this.props.renderOption,
        renderNoResultsFound: this.props.renderNoResultsFound,
        search: search,
        onSearchChange: function(search, callback){
          return onSearchChange(search, callback);
        },
        values: values,
        onValuesChange: function(newValues, callback){
          var newValue, changed;
          if (newValues.length === 0) {
            return onValueChange(undefined, function(){
              return callback();
            });
          } else {
            newValue = last(newValues);
            changed = !isEqualToObject(newValue, value);
            return function(){
              return function(callback){
                if (changed) {
                  return onValueChange(newValue, callback);
                } else {
                  return callback();
                }
              };
            }()(function(){
              callback();
              return onOpenChange(false, function(){});
            });
          }
        },
        renderValue: function(item){
          if (open && (!!this$.props.editable || search.length > 0)) {
            return null;
          } else {
            return this$.props.renderValue(item);
          }
        },
        onKeyboardSelectionFailed: function(which){
          return onSearchChange("", function(){
            return onOpenChange(false, function(){
              return this$.props.onKeyboardSelectionFailed(which);
            });
          });
        },
        uid: function(item){
          return {
            uid: this$.props.uid(item),
            open: open,
            search: search
          };
        },
        serialize: function(items){
          return serialize(items[0]);
        },
        onBlur: function(e){
          (function(){
            return function(callback){
              if (search.length > 0) {
                return onSearchChange("", callback);
              } else {
                return callback();
              }
            };
          })()(function(){
            return this$.props.onBlur({
              value: value,
              open: open,
              originalEvent: e
            });
          });
        },
        onFocus: function(e){
          this$.props.onFocus({
            value: value,
            open: open,
            originalEvent: e
          });
        },
        onPaste: (function(){
          var ref$;
          switch (false) {
          case typeof ((ref$ = this.props) != null ? ref$.valueFromPaste : void 8) !== 'undefined':
            return this.props.onPaste;
          default:
            return function(e){
              var clipboardData, valueFromPaste;
              clipboardData = e.clipboardData;
              valueFromPaste = this$.props.valueFromPaste(options, value, clipboardData.getData('text'));
              if (valueFromPaste) {
                (function(){
                  return onValueChange(valueFromPaste, function(){
                    return onSearchChange("", function(){
                      return onOpenChange(false);
                    });
                  });
                })();
                return cancelEvent(e);
              }
            };
          }
        }.call(this)),
        placeholder: this.props.placeholder,
        style: this.props.style
      }, (function(){
        switch (false) {
        case typeof this.props.restoreOnBackspace !== 'function':
          return {
            restoreOnBackspace: this.props.restoreOnBackspace
          };
        default:
          return {};
        }
      }.call(this))), (function(){
        switch (false) {
        case typeof this.props.renderNoResultsFound !== 'function':
          return {
            renderNoResultsFound: function(){
              return this$.props.renderNoResultsFound(value, search);
            }
          };
        default:
          return {};
        }
      }.call(this))));
    },
    getComputedState: function(){
      var highlightedUid, open, search, value, values, ref$, onHighlightedUidChange, onOpenChange, onSearchChange, onValueChange, optionsFromChildren, unfilteredOptions, filteredOptions, newOption, options, this$ = this;
      highlightedUid = this.props.hasOwnProperty('highlightedUid')
        ? this.props.highlightedUid
        : this.state.highlightedUid;
      open = this.isOpen();
      search = this.props.hasOwnProperty('search')
        ? this.props.search
        : this.state.search;
      value = this.value();
      values = !!value
        ? [value]
        : [];
      ref$ = map(function(p){
        var result;
        return result = (function(){
          switch (false) {
          case !(this.props.hasOwnProperty(p) && this.props.hasOwnProperty(camelize("on-" + p + "-change"))):
            return function(o, callback){
              this$.props[camelize("on-" + p + "-change")](o, function(){});
              return this$.setState({}, callback);
            };
          case !(this.props.hasOwnProperty(p) && !this.props.hasOwnProperty(camelize("on-" + p + "-change"))):
            return function(arg$, callback){
              return callback();
            };
          case !(!this.props.hasOwnProperty(p) && this.props.hasOwnProperty(camelize("on-" + p + "-change"))):
            return function(o, callback){
              var ref$;
              return this$.setState((ref$ = {}, ref$[p + ""] = o, ref$), function(){
                callback();
                return this$.props[camelize("on-" + p + "-change")](o, function(){});
              });
            };
          case !(!this.props.hasOwnProperty(p) && !this.props.hasOwnProperty(camelize("on-" + p + "-change"))):
            return function(o, callback){
              var ref$;
              return this$.setState((ref$ = {}, ref$[p + ""] = o, ref$), callback);
            };
          }
        }.call(this$));
      })(
      ['highlightedUid', 'open', 'search', 'value']), onHighlightedUidChange = ref$[0], onOpenChange = ref$[1], onSearchChange = ref$[2], onValueChange = ref$[3];
      optionsFromChildren = (function(){
        var ref$;
        switch (false) {
        case !((ref$ = this.props) != null && ref$.children):
          return map(function(it){
            var ref$, value, children;
            if ((ref$ = it != null ? it.props : void 8) != null) {
              value = ref$.value, children = ref$.children;
            }
            return {
              label: children,
              value: value
            };
          })(
          toString$.call(this.props.children).slice(8, -1) === 'Array'
            ? this.props.children
            : [this.props.children]);
        default:
          return [];
        }
      }.call(this));
      unfilteredOptions = this.props.hasOwnProperty('options') ? (ref$ = this.props.options) != null
        ? ref$
        : [] : optionsFromChildren;
      filteredOptions = this.props.filterOptions(unfilteredOptions, search);
      newOption = (function(){
        switch (false) {
        case typeof this.props.createFromSearch !== 'function':
          return this.props.createFromSearch(filteredOptions, search);
        default:
          return null;
        }
      }.call(this));
      options = (!!newOption
        ? [(ref$ = import$({}, newOption), ref$.newOption = true, ref$)]
        : []).concat(filteredOptions);
      return {
        highlightedUid: highlightedUid,
        open: open,
        search: search,
        value: value,
        values: values,
        onHighlightedUidChange: onHighlightedUidChange,
        onOpenChange: function(open, callback){
          onOpenChange(open, function(){
            callback();
            if (!!this$.props.editable && (this$.isOpen() && !!value)) {
              return onSearchChange(this$.props.editable(value) + "" + (search.length === 1 ? search : ''), function(){
                return this$.highlightFirstSelectableOption(function(){});
              });
            }
          });
        },
        onSearchChange: onSearchChange,
        onValueChange: onValueChange,
        filteredOptions: filteredOptions,
        options: options
      };
    },
    getInitialState: function(){
      var ref$;
      return {
        highlightedUid: undefined,
        open: false,
        scrollLock: false,
        search: "",
        value: (ref$ = this.props) != null ? ref$.defaultValue : void 8
      };
    },
    firstOptionIndexToHighlight: function(options, value){
      var index, optionIndexToHighlight, search, this$ = this;
      index = !!value ? findIndex(function(it){
        return isEqualToObject(it, value);
      }, options) : undefined;
      optionIndexToHighlight = (function(){
        var ref$;
        switch (false) {
        case typeof index === 'undefined':
          return index;
        case options.length !== 1:
          return 0;
        case typeof ((ref$ = options[0]) != null ? ref$.newOption : void 8) !== 'undefined':
          return 0;
        default:
          if (all(function(it){
            return typeof it.selectable === 'boolean' && !it.selectable;
          })(
          drop(1)(
          options))) {
            return 0;
          } else {
            return 1;
          }
        }
      }());
      search = this.props.hasOwnProperty('search')
        ? this.props.search
        : this.state.search;
      return this.props.firstOptionIndexToHighlight(optionIndexToHighlight, options, value, search);
    },
    focus: function(){
      this.refs.select.focus();
    },
    blur: function(){
      this.refs.select.blur();
    },
    highlightFirstSelectableOption: function(callback){
      var ref$, options, value;
      callback == null && (callback = function(){});
      if (this.state.open) {
        ref$ = this.getComputedState(), options = ref$.options, value = ref$.value;
        this.refs.select.highlightAndScrollToSelectableOption(this.firstOptionIndexToHighlight(options, value), 1, callback);
      } else {
        callback();
      }
    },
    value: function(){
      if (this.props.hasOwnProperty('value')) {
        return this.props.value;
      } else {
        return this.state.value;
      }
    },
    isOpen: function(){
      if (this.props.hasOwnProperty('open')) {
        return this.props.open;
      } else {
        return this.state.open;
      }
    }
  });
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ReactSelectize":7,"./utils":15,"prelude-ls":undefined}],12:[function(require,module,exports){
(function (global){
(function(){
  var ref$, createClass, svg, findDOMNode;
  ref$ = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createClass = ref$.createClass, svg = ref$.DOM.svg;
  findDOMNode = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null).findDOMNode;
  module.exports = createClass({
    render: function(){
      return svg(this.props);
    },
    componentDidMount: function(){
      findDOMNode(this).setAttribute('focusable', false);
    }
  });
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
(function (global){
(function(){
  var ref$, createClass, createFactory, path, SvgWrapper;
  ref$ = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createClass = ref$.createClass, createFactory = ref$.createFactory, path = ref$.DOM.path;
  SvgWrapper = createFactory(require('./SvgWrapper'));
  module.exports = createClass({
    getDefaultProps: function(){
      return {
        open: false,
        flipped: false
      };
    },
    render: function(){
      return SvgWrapper({
        className: 'react-selectize-toggle-button',
        style: {
          width: 10,
          height: 8
        }
      }, path({
        d: (function(){
          switch (false) {
          case !((this.props.open && !this.props.flipped) || (!this.props.open && this.props.flipped)):
            return "M0 6 L5 1 L10 6 Z";
          default:
            return "M0 1 L5 6 L10 1 Z";
          }
        }.call(this))
      }));
    }
  });
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./SvgWrapper":12}],14:[function(require,module,exports){
(function (global){
(function(){
  var ref$, createClass, div, isEqualToObject;
  ref$ = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null), createClass = ref$.createClass, div = ref$.DOM.div;
  isEqualToObject = (typeof window !== "undefined" ? window['preludeExtension'] : typeof global !== "undefined" ? global['preludeExtension'] : null).isEqualToObject;
  module.exports = createClass({
    getDefaultProps: function(){
      return {};
    },
    render: function(){
      return div({
        className: 'value-wrapper'
      }, this.props.renderItem(this.props.item));
    },
    shouldComponentUpdate: function(nextProps){
      var ref$;
      return !isEqualToObject(nextProps != null ? nextProps.uid : void 8, (ref$ = this.props) != null ? ref$.uid : void 8);
    }
  });
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
(function(){
  var ref$, filter, map, objToPairs, Str, cancelEvent, classNameFromObject, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('prelude-ls'), filter = ref$.filter, map = ref$.map, objToPairs = ref$.objToPairs, Str = ref$.Str;
  out$.cancelEvent = cancelEvent = function(e){
    e.preventDefault();
    e.stopPropagation();
    false;
  };
  out$.classNameFromObject = classNameFromObject = function(it){
    return Str.join(' ')(
    map(function(it){
      return it[0];
    })(
    filter(function(it){
      return !!it[1];
    })(
    objToPairs(
    it))));
  };
}).call(this);

},{"prelude-ls":undefined}]},{},[1])(1)
});
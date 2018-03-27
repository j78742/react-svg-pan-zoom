var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import { toSVG } from 'transformation-matrix';

//events
import eventFactory from './events/event-factory';

//features
import { pan as _pan } from './features/pan';
import { getDefaultValue, setViewerSize, setSVGViewBox, setPointOnViewerCenter as _setPointOnViewerCenter, reset as _reset, setZoomLevels } from './features/common';
import { onMouseDown as _onMouseDown, onMouseMove as _onMouseMove, onMouseUp as _onMouseUp, onWheel as _onWheel, onMouseEnterOrLeave, onInterval, onDoubleClick as _onDoubleClick } from './features/interactions';
import { onTouchStart as _onTouchStart, onTouchMove as _onTouchMove, onTouchEnd as _onTouchEnd, onTouchCancel as _onTouchCancel } from './features/interactions-touch';

import { zoom as _zoom, fitSelection as _fitSelection, fitToViewer as _fitToViewer, zoomOnViewerCenter as _zoomOnViewerCenter } from './features/zoom';
import { openMiniature as _openMiniature, closeMiniature as _closeMiniature } from './features/miniature';

//ui
import cursorPolyfill from './ui/cursor-polyfill';
import BorderGradient from './ui/border-gradient';
import Selection from './ui/selection';
import Toolbar from './ui-toolbar/toolbar';
import detectTouch from './ui/detect-touch';
import Miniature from './ui-miniature/miniature';

import { TOOL_AUTO, TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT, MODE_IDLE, MODE_PANNING, MODE_ZOOMING, POSITION_NONE, POSITION_TOP, POSITION_RIGHT, POSITION_BOTTOM, POSITION_LEFT, ACTION_PAN, ACTION_ZOOM } from './constants';

var ReactSVGPanZoom = function (_React$Component) {
  _inherits(ReactSVGPanZoom, _React$Component);

  function ReactSVGPanZoom(props, context) {
    _classCallCheck(this, ReactSVGPanZoom);

    var _this = _possibleConstructorReturn(this, (ReactSVGPanZoom.__proto__ || Object.getPrototypeOf(ReactSVGPanZoom)).call(this, props, context));

    var _this$props = _this.props,
        tool = _this$props.tool,
        value = _this$props.value,
        viewerWidth = _this$props.width,
        viewerHeight = _this$props.height,
        scaleFactorMin = _this$props.scaleFactorMin,
        scaleFactorMax = _this$props.scaleFactorMax,
        children = _this$props.children;
    var _children$props = children.props,
        SVGWidth = _children$props.width,
        SVGHeight = _children$props.height,
        SVGViewBox = _children$props.viewBox;

    var SVGViewBoxX = void 0,
        SVGViewBoxY = void 0;
    if (SVGViewBox) {
      var _SVGViewBox$split$map = SVGViewBox.split(' ').map(parseFloat);

      var _SVGViewBox$split$map2 = _slicedToArray(_SVGViewBox$split$map, 4);

      SVGViewBoxX = _SVGViewBox$split$map2[0];
      SVGViewBoxY = _SVGViewBox$split$map2[1];
      SVGWidth = _SVGViewBox$split$map2[2];
      SVGHeight = _SVGViewBox$split$map2[3];
    }

    _this.state = {
      value: value ? value : getDefaultValue(viewerWidth, viewerHeight, SVGViewBoxX, SVGViewBoxY, SVGWidth, SVGHeight, scaleFactorMin, scaleFactorMax),
      tool: tool ? tool : TOOL_NONE
    };
    _this.ViewerDOM = null;

    _this.autoPanLoop = _this.autoPanLoop.bind(_this);
    return _this;
  }

  _createClass(ReactSVGPanZoom, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var value = this.getValue();
      var needUpdate = false;
      var nextValue = value;

      if (value.viewerWidth !== nextProps.width || value.viewerHeight !== nextProps.height) {
        nextValue = setViewerSize(nextValue, nextProps.width, nextProps.height);
        needUpdate = true;
      }

      var _nextProps$children$p = nextProps.children.props,
          SVGWidth = _nextProps$children$p.width,
          SVGHeight = _nextProps$children$p.height,
          SVGViewBox = _nextProps$children$p.viewBox;

      if (SVGViewBox) {
        var _SVGViewBox$split$map3 = SVGViewBox.split(' ').map(parseFloat),
            _SVGViewBox$split$map4 = _slicedToArray(_SVGViewBox$split$map3, 4),
            x0 = _SVGViewBox$split$map4[0],
            y0 = _SVGViewBox$split$map4[1],
            width = _SVGViewBox$split$map4[2],
            height = _SVGViewBox$split$map4[3];

        if (value.SVGViewBoxX !== x0 || value.SVGViewBoxY !== y0 || value.SVGWidth !== width || value.SVGHeight !== height) {
          nextValue = setSVGViewBox(nextValue, x0, y0, width, height);
          needUpdate = true;
        }
      } else {
        if (value.SVGViewBoxX !== 0 || value.SVGViewBoxY !== 0 || value.SVGWidth !== SVGWidth || value.SVGHeight !== SVGHeight) {
          nextValue = setSVGViewBox(nextValue, 0, 0, SVGWidth, SVGHeight);
          needUpdate = true;
        }
      }

      if (value.scaleFactorMin !== nextProps.scaleFactorMin || value.scaleFactorMax !== nextProps.scaleFactorMax) {
        nextValue = setZoomLevels(nextValue, nextProps.scaleFactorMin, nextProps.scaleFactorMax);
        needUpdate = true;
      }

      if (needUpdate) {
        this.setValue(nextValue);
      }
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.props.value ? this.props.value : this.state.value;
    }
  }, {
    key: 'getTool',
    value: function getTool() {
      return this.props.tool ? this.props.tool : this.state.tool;
    }
  }, {
    key: 'getSvgStyle',
    value: function getSvgStyle(cursor) {
      var style = { display: 'block' };

      if (cursor) {
        style.cursor = cursor;
      }

      if (this.props.detectPinchGesture || [TOOL_PAN, TOOL_AUTO].indexOf(this.getTool()) !== -1) {
        style.touchAction = 'none';
      }

      return style;
    }
  }, {
    key: 'setValue',
    value: function setValue(nextValue) {
      var _props = this.props,
          onChangeValue = _props.onChangeValue,
          onZoom = _props.onZoom,
          onPan = _props.onPan;

      this.setState({ value: nextValue });
      if (onChangeValue) onChangeValue(nextValue);
      if (nextValue.lastAction) {
        if (onZoom && nextValue.lastAction === ACTION_ZOOM) onZoom(nextValue);
        if (onPan && nextValue.lastAction === ACTION_PAN) onPan(nextValue);
      }
    }
  }, {
    key: 'pan',
    value: function pan(SVGDeltaX, SVGDeltaY) {
      var nextValue = _pan(this.getValue(), SVGDeltaX, SVGDeltaY);
      this.setValue(nextValue);
    }
  }, {
    key: 'zoom',
    value: function zoom(SVGPointX, SVGPointY, scaleFactor) {
      var nextValue = _zoom(this.getValue(), SVGPointX, SVGPointY, scaleFactor);
      this.setValue(nextValue);
    }
  }, {
    key: 'fitSelection',
    value: function fitSelection(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight) {
      var nextValue = _fitSelection(this.getValue(), selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight);
      this.setValue(nextValue);
    }
  }, {
    key: 'fitToViewer',
    value: function fitToViewer() {
      var nextValue = _fitToViewer(this.getValue());
      this.setValue(nextValue);
    }
  }, {
    key: 'zoomOnViewerCenter',
    value: function zoomOnViewerCenter(scaleFactor) {
      var nextValue = _zoomOnViewerCenter(this.getValue(), scaleFactor);
      this.setValue(nextValue);
    }
  }, {
    key: 'setPointOnViewerCenter',
    value: function setPointOnViewerCenter(SVGPointX, SVGPointY, zoomLevel) {
      var nextValue = _setPointOnViewerCenter(this.getValue(), SVGPointX, SVGPointY, zoomLevel);
      this.setValue(nextValue);
    }
  }, {
    key: 'reset',
    value: function reset() {
      var nextValue = _reset(this.getValue());
      this.setValue(nextValue);
    }
  }, {
    key: 'changeTool',
    value: function changeTool(tool) {
      this.setState({ tool: tool });
      if (this.props.onChangeTool) this.props.onChangeTool(tool);
    }
  }, {
    key: 'openMiniature',
    value: function openMiniature() {
      var nextValue = _openMiniature(this.getValue());
      this.setValue(nextValue);
    }
  }, {
    key: 'closeMiniature',
    value: function closeMiniature() {
      var nextValue = _closeMiniature(this.getValue());
      this.setValue(nextValue);
    }
  }, {
    key: 'handleViewerEvent',
    value: function handleViewerEvent(event) {
      var props = this.props,
          value = this.state.value,
          ViewerDOM = this.ViewerDOM;


      if (!([TOOL_NONE, TOOL_AUTO].indexOf(this.getTool()) >= 0)) return;
      if (event.target === ViewerDOM) return;

      var eventsHandler = {
        click: props.onClick,
        dblclick: props.onDoubleClick,

        mousemove: props.onMouseMove,
        mouseup: props.onMouseUp,
        mousedown: props.onMouseDown,

        touchstart: props.onTouchStart,
        touchmove: props.onTouchMove,
        touchend: props.onTouchEnd,
        touchcancel: props.onTouchCancel
      };

      var onEventHandler = eventsHandler[event.type];
      if (!onEventHandler) return;

      onEventHandler(eventFactory(event, value, ViewerDOM));
    }
  }, {
    key: 'autoPanLoop',
    value: function autoPanLoop() {
      var coords = { x: this.state.viewerX, y: this.state.viewerY };
      var nextValue = onInterval(null, this.ViewerDOM, this.getTool(), this.getValue(), this.props, coords);

      if (this.getValue() !== nextValue) {
        this.setValue(nextValue);
      }

      if (this.autoPanIsRunning) {
        requestAnimationFrame(this.autoPanLoop);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var props = this.props,
          state = this.state;

      if (props.onChangeValue) props.onChangeValue(state.value);

      this.autoPanIsRunning = true;
      requestAnimationFrame(this.autoPanLoop);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.autoPanIsRunning = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props,
          _state = this.state,
          viewerX = _state.viewerX,
          viewerY = _state.viewerY;

      var tool = this.getTool();
      var value = this.getValue();
      var CustomToolbar = props.customToolbar,
          CustomMiniature = props.customMiniature;


      var panningWithToolAuto = tool === TOOL_AUTO && value.mode === MODE_PANNING && value.startX !== value.endX && value.startY !== value.endY;

      var cursor = void 0;

      if (tool === TOOL_PAN) cursor = cursorPolyfill(value.mode === MODE_PANNING ? 'grabbing' : 'grab');

      if (tool === TOOL_ZOOM_IN) cursor = cursorPolyfill('zoom-in');

      if (tool === TOOL_ZOOM_OUT) cursor = cursorPolyfill('zoom-out');

      if (panningWithToolAuto) cursor = cursorPolyfill('grabbing');

      var blockChildEvents = [TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT].indexOf(tool) >= 0;
      blockChildEvents = blockChildEvents || panningWithToolAuto;

      return React.createElement(
        'div',
        {
          style: _extends({ position: "relative", width: value.viewerWidth, height: value.viewerHeight }, props.style),
          className: this.props.className },
        React.createElement(
          'svg',
          {
            ref: function ref(ViewerDOM) {
              return _this2.ViewerDOM = ViewerDOM;
            },
            width: value.viewerWidth,
            height: value.viewerHeight,
            style: this.getSvgStyle(cursor),

            onMouseDown: function onMouseDown(event) {
              var nextValue = _onMouseDown(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
              _this2.handleViewerEvent(event);
            },
            onMouseMove: function onMouseMove(event) {
              var _ViewerDOM$getBoundin = _this2.ViewerDOM.getBoundingClientRect(),
                  left = _ViewerDOM$getBoundin.left,
                  top = _ViewerDOM$getBoundin.top;

              var x = event.clientX - Math.round(left);
              var y = event.clientY - Math.round(top);

              var nextValue = _onMouseMove(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props, { x: x, y: y });
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
              _this2.setState({ viewerX: x, viewerY: y });
              _this2.handleViewerEvent(event);
            },
            onMouseUp: function onMouseUp(event) {
              var nextValue = _onMouseUp(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
              _this2.handleViewerEvent(event);
            },

            onClick: function onClick(event) {
              _this2.handleViewerEvent(event);
            },
            onDoubleClick: function onDoubleClick(event) {
              var nextValue = _onDoubleClick(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
              _this2.handleViewerEvent(event);
            },

            onWheel: function onWheel(event) {
              var nextValue = _onWheel(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
            },

            onMouseEnter: function onMouseEnter(event) {
              if (detectTouch()) return;
              var nextValue = onMouseEnterOrLeave(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
            },
            onMouseLeave: function onMouseLeave(event) {
              var nextValue = onMouseEnterOrLeave(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
            },

            onTouchStart: function onTouchStart(event) {
              var nextValue = _onTouchStart(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
              _this2.handleViewerEvent(event);
            },
            onTouchMove: function onTouchMove(event) {
              var nextValue = _onTouchMove(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
              _this2.handleViewerEvent(event);
            },
            onTouchEnd: function onTouchEnd(event) {
              var nextValue = _onTouchEnd(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
              _this2.handleViewerEvent(event);
            },
            onTouchCancel: function onTouchCancel(event) {
              var nextValue = _onTouchCancel(event, _this2.ViewerDOM, _this2.getTool(), _this2.getValue(), _this2.props);
              if (_this2.getValue() !== nextValue) _this2.setValue(nextValue);
              _this2.handleViewerEvent(event);
            } },
          React.createElement('rect', {
            fill: props.background,
            x: 0,
            y: 0,
            width: value.viewerWidth,
            height: value.viewerHeight,
            style: { pointerEvents: "none" }
          }),
          React.createElement(
            'g',
            {
              transform: toSVG(value),
              style: blockChildEvents ? { pointerEvents: "none" } : {} },
            React.createElement('rect', {
              fill: this.props.SVGBackground,
              style: this.props.SVGStyle,
              x: value.SVGViewBoxX,
              y: value.SVGViewBoxY,
              width: value.SVGWidth,
              height: value.SVGHeight }),
            React.createElement(
              'g',
              null,
              props.children.props.children
            )
          ),
          !([TOOL_NONE, TOOL_AUTO].indexOf(tool) >= 0 && props.detectAutoPan && value.focus) ? null : React.createElement(
            'g',
            { style: { pointerEvents: "none" } },
            !(viewerY <= 20) ? null : React.createElement(BorderGradient, { direction: POSITION_TOP, width: value.viewerWidth, height: value.viewerHeight }),
            !(value.viewerWidth - viewerX <= 20) ? null : React.createElement(BorderGradient, { direction: POSITION_RIGHT, width: value.viewerWidth, height: value.viewerHeight }),
            !(value.viewerHeight - viewerY <= 20) ? null : React.createElement(BorderGradient, { direction: POSITION_BOTTOM, width: value.viewerWidth, height: value.viewerHeight }),
            !(value.focus && viewerX <= 20) ? null : React.createElement(BorderGradient, { direction: POSITION_LEFT, width: value.viewerWidth, height: value.viewerHeight })
          ),
          !(value.mode === MODE_ZOOMING) ? null : React.createElement(Selection, { startX: value.startX, startY: value.startY, endX: value.endX, endY: value.endY })
        ),
        props.toolbarPosition === POSITION_NONE ? null : React.createElement(CustomToolbar, {
          position: props.toolbarPosition,
          value: value,
          onChangeValue: function onChangeValue(value) {
            return _this2.setValue(value);
          },
          tool: tool,
          onChangeTool: function onChangeTool(tool) {
            return _this2.changeTool(tool);
          } }),
        props.miniaturePosition === POSITION_NONE ? null : React.createElement(
          CustomMiniature,
          {
            position: props.miniaturePosition,
            value: value,
            onChangeValue: function onChangeValue(value) {
              return _this2.setValue(value);
            },
            SVGBackground: this.props.SVGBackground,
            background: this.props.miniatureBackground,
            width: this.props.miniatureWidth,
            height: this.props.miniatureHeight
          },
          props.children.props.children
        )
      );
    }
  }]);

  return ReactSVGPanZoom;
}(React.Component);

export default ReactSVGPanZoom;


ReactSVGPanZoom.propTypes = {
  //width of the viewer displayed on screen
  width: PropTypes.number.isRequired,

  //height of the viewer displayed on screen
  height: PropTypes.number.isRequired,

  //background of the viewer
  background: PropTypes.string,

  //background of the svg
  SVGBackground: PropTypes.string,

  //style of the svg
  SVGStyle: PropTypes.object,

  //value of the viewer (current point of view)
  value: PropTypes.shape({
    version: PropTypes.oneOf([2]).isRequired,
    mode: PropTypes.oneOf([MODE_IDLE, MODE_PANNING, MODE_ZOOMING]).isRequired,
    focus: PropTypes.bool.isRequired,
    a: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired,
    c: PropTypes.number.isRequired,
    d: PropTypes.number.isRequired,
    e: PropTypes.number.isRequired,
    f: PropTypes.number.isRequired,
    viewerWidth: PropTypes.number.isRequired,
    viewerHeight: PropTypes.number.isRequired,
    SVGViewBoxX: PropTypes.number.isRequired,
    SVGViewBoxY: PropTypes.number.isRequired,
    SVGWidth: PropTypes.number.isRequired,
    SVGHeight: PropTypes.number.isRequired,
    startX: PropTypes.number,
    startY: PropTypes.number,
    endX: PropTypes.number,
    endY: PropTypes.number,
    miniatureOpen: PropTypes.bool.isRequired
  }),

  //CSS style of the Viewer
  style: PropTypes.object,

  //className of the Viewer
  className: PropTypes.string,

  //perform zoom operation on mouse scroll
  detectWheel: PropTypes.bool,

  //perform PAN if the mouse is on viewer border
  detectAutoPan: PropTypes.bool,

  //perform zoom operation on pinch gesture
  detectPinchGesture: PropTypes.bool,

  //toolbar position
  toolbarPosition: PropTypes.oneOf([POSITION_NONE, POSITION_TOP, POSITION_RIGHT, POSITION_BOTTOM, POSITION_LEFT]),

  //handler something changed
  onChangeValue: PropTypes.func,

  //handler tool changed
  onChangeTool: PropTypes.func,

  //handler zoom level changed
  onZoom: PropTypes.func,

  //handler pan action performed
  onPan: PropTypes.func,

  //handler click
  onClick: PropTypes.func,

  //handler double click
  onDoubleClick: PropTypes.func,

  //handler mouseup
  onMouseUp: PropTypes.func,

  //handler mousemove
  onMouseMove: PropTypes.func,

  //handler mousedown
  onMouseDown: PropTypes.func,

  //if disabled the user can move the image outside the viewer
  preventPanOutside: PropTypes.bool,

  //how much scale in or out
  scaleFactor: PropTypes.number,

  //how much scale in or out on mouse wheel (requires detectWheel enabled)
  scaleFactorOnWheel: PropTypes.number,

  // maximum amount of scale a user can zoom in to
  scaleFactorMax: PropTypes.number,

  // minimum amount of a scale a user can zoom out of
  scaleFactorMin: PropTypes.number,

  //current active tool (TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT)
  tool: PropTypes.oneOf([TOOL_AUTO, TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT]),

  //modifier keys //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
  modifierKeys: PropTypes.array,

  //override toolbar component
  customToolbar: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

  //miniature position
  miniaturePosition: PropTypes.oneOf([POSITION_NONE, POSITION_RIGHT, POSITION_LEFT]),

  //miniature height
  miniatureBackground: PropTypes.string,

  //miniature width
  miniatureWidth: PropTypes.number,

  //miniature height
  miniatureHeight: PropTypes.number,

  //override miniature component
  customMiniature: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

  //Turn off zoom on double click
  disableDoubleClickZoomWithToolAuto: PropTypes.bool,

  //accept only one node SVG
  children: function children(props, propName, componentName) {
    // Only accept a single child, of the appropriate type
    //credits: http://www.mattzabriskie.com/blog/react-validating-children
    var prop = props[propName];
    var types = ['svg'];
    if (React.Children.count(prop) !== 1 || types.indexOf(prop.type) === -1) {
      return new Error('`' + componentName + '` ' + 'should have a single child of the following types: ' + ' `' + types.join('`, `') + '`.');
    }
    if (!(prop.props.hasOwnProperty('width') && prop.props.hasOwnProperty('height')) && !prop.props.hasOwnProperty('viewBox')) {
      return new Error('SVG should have props `width` and `height` or `viewBox`');
    }
  }
};

ReactSVGPanZoom.defaultProps = {
  value: null,
  tool: null,
  style: {},
  background: "#616264",
  SVGBackground: "#fff",
  SVGStyle: {},
  detectWheel: true,
  detectAutoPan: true,
  detectPinchGesture: true,
  toolbarPosition: POSITION_RIGHT,
  modifierKeys: ["Alt", "Shift", "Control"],
  customToolbar: Toolbar,
  preventPanOutside: true,
  scaleFactor: 1.1,
  scaleFactorOnWheel: 1.06,
  miniaturePosition: POSITION_LEFT,
  miniatureWidth: 100,
  miniatureHeight: 80,
  miniatureBackground: "#616264",
  customMiniature: Miniature,
  disableZoomWithToolAuto: false,
  onZoom: null,
  onPan: null
};
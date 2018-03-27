import React from 'react';
import PropTypes from 'prop-types';
import RandomUID from "../utils/RandomUID";

var prefixID = 'react-svg-pan-zoom_miniature';

function MiniatureMask(_ref) {
  var SVGViewBoxX = _ref.SVGViewBoxX,
      SVGViewBoxY = _ref.SVGViewBoxY,
      SVGWidth = _ref.SVGWidth,
      SVGHeight = _ref.SVGHeight,
      x1 = _ref.x1,
      y1 = _ref.y1,
      x2 = _ref.x2,
      y2 = _ref.y2,
      zoomToFit = _ref.zoomToFit,
      _uid = _ref._uid;

  var maskID = prefixID + '_mask_' + _uid;

  return React.createElement(
    'g',
    null,
    React.createElement(
      'defs',
      null,
      React.createElement(
        'mask',
        { id: maskID },
        React.createElement('rect', { x: SVGViewBoxX, y: SVGViewBoxY, width: SVGWidth, height: SVGHeight, fill: '#ffffff' }),
        React.createElement('rect', { x: x1, y: y1, width: x2 - x1, height: y2 - y1 })
      )
    ),
    React.createElement('rect', {
      x: SVGViewBoxX,
      y: SVGViewBoxY,
      width: SVGWidth,
      height: SVGHeight,
      style: {
        stroke: "none",
        fill: "#000",
        mask: 'url(#' + maskID + ')',
        opacity: 0.4
      }
    })
  );
}

MiniatureMask.propTypes = {
  SVGViewBoxX: PropTypes.number.isRequired,
  SVGViewBoxY: PropTypes.number.isRequired,
  SVGWidth: PropTypes.number.isRequired,
  SVGHeight: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  zoomToFit: PropTypes.number.isRequired
};

export default RandomUID(MiniatureMask);
"use strict";

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.string.trim.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMatch = isMatch;
exports.redirect = redirect;
exports.Link = Link;
exports.getCurrentPath = getCurrentPath;
exports.getParams = getParams;
exports.Route = exports.location = exports.routes = void 0;

var _react = _interopRequireWildcard(require("react"));

var _CSSTransition = _interopRequireDefault(require("react-transition-group/CSSTransition"));

var _TransitionGroup = _interopRequireDefault(require("react-transition-group/TransitionGroup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const routes = [];
exports.routes = routes;
// allow tests to override
const location = {
  path: () => window.location.pathname
};
exports.location = location;

function isMatch(path) {
  let exact = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!path) {
    return false;
  }

  if (exact && location.path() !== path) {
    return false;
  }

  if (location.path() === path) {
    return true;
  }

  return new RegExp("^".concat(path)).test(location.path());
}

class Route extends _react.Component {
  constructor(props) {
    super(props);
    this.onPopState = this.onPopState.bind(this);
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('popstate', this.onPopState);
    routes.push(this);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.onPopState);
    routes.splice(routes.indexOf(this), 1);
  }

  onPopState() {
    this.forceUpdate();
  }

  render() {
    const {
      path,
      exact,
      children,
      transition,
      className
    } = this.props;
    const active = isMatch(path, exact);
    let childNodes = active ? _react.default.Children.toArray(children) : [];

    if (childNodes.length) {
      const params = getParams(path);
      childNodes = childNodes.map((child, i) => {
        if (! /*#__PURE__*/(0, _react.isValidElement)(child)) {
          return child;
        }

        if (typeof child.type === 'string' || child.type === Route) {
          return child;
        }

        return /*#__PURE__*/(0, _react.cloneElement)(child, {
          key: "child".concat(i),
          route: {
            params,
            path
          }
        });
      });
    }

    if (!transition) {
      return /*#__PURE__*/_react.default.createElement("span", {
        className: className
      }, childNodes);
    }

    const {
      name,
      enterTimeout,
      leaveTimeout,
      appear,
      appearTimeout,
      enter,
      leave
    } = transition;
    return /*#__PURE__*/_react.default.createElement(_TransitionGroup.default, null, /*#__PURE__*/_react.default.createElement(_CSSTransition.default, {
      className: className,
      transitionName: name,
      transitionAppear: appear,
      transitionAppearTimeout: appearTimeout,
      transitionEnter: enter,
      transitionEnterTimeout: enterTimeout,
      transitionLeave: leave,
      transitionLeaveTimeout: leaveTimeout
    }, childNodes));
  }

}

exports.Route = Route;

function redirect(path) {
  let replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  window.history[replace ? 'replaceState' : 'pushState']({}, "", path);
  routes.forEach(route => route.forceUpdate());
}

function Link(_ref) {
  let {
    children,
    className,
    exact = false,
    to,
    href,
    replace = false,
    activeClassName = "active",
    match = null
  } = _ref,
      rest = _objectWithoutProperties(_ref, ["children", "className", "exact", "to", "href", "replace", "activeClassName", "match"]);

  const path = to !== null && to !== void 0 ? to : href;

  const onClick = function onClick(event) {
    event.preventDefault();
    redirect(path, replace);
  };

  if (isMatch(path, exact ? exact : path === "/") || match && isMatch(match, exact)) {
    className = "".concat(className, " ").concat(activeClassName).trim();
  }

  return /*#__PURE__*/_react.default.createElement("a", _extends({
    className: className,
    href: path,
    onClick: onClick
  }, rest), children);
}

function getCurrentPath() {
  const lastRoute = routes.filter(route => isMatch(route.props.path, !!route.props.exact)).pop();
  return lastRoute ? lastRoute.props.path : '';
}

function getParams(path) {
  if (!path) {
    path = getCurrentPath();
  }

  const matches = location.path().match(new RegExp("^".concat(path)));

  if (!matches) {
    return [];
  }

  return matches.slice(1);
}
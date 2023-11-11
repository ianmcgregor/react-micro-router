"use strict";

require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = Link;
exports.Route = void 0;
exports.getCurrentPath = getCurrentPath;
exports.getParams = getParams;
exports.isMatch = isMatch;
exports.location = void 0;
exports.redirect = redirect;
exports.routes = void 0;
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.regexp.constructor.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.string.match.js");
require("core-js/modules/es.string.trim.js");
var _react = _interopRequireWildcard(require("react"));
var _CSSTransition = _interopRequireDefault(require("react-transition-group/CSSTransition"));
var _TransitionGroup = _interopRequireDefault(require("react-transition-group/TransitionGroup"));
const _excluded = ["children", "className", "exact", "to", "href", "replace", "activeClassName", "match"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const routes = exports.routes = [];
// allow tests to override
const location = exports.location = {
  path: () => window.location.pathname
};
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
    routes.push(this);
  }
  componentDidMount() {
    window.addEventListener("popstate", this.onPopState);
  }
  componentWillUnmount() {
    window.removeEventListener("popstate", this.onPopState);
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
    let childNodes;
    if (!active) {
      childNodes = [];
    } else if (typeof children === "function") {
      const childProps = {
        params: getParams(path),
        path
      };
      childNodes = children(childProps);
    } else {
      childNodes = _react.default.Children.toArray(children);
      if (childNodes.length) {
        const params = getParams(path);
        childNodes = childNodes.map((child, i) => {
          if (! /*#__PURE__*/(0, _react.isValidElement)(child)) {
            return child;
          }
          if (typeof child.type === "string" || child.type === Route) {
            return child;
          }
          return /*#__PURE__*/(0, _react.cloneElement)(
          // @ts-expect-error - no overload types.npm run bu
          child, {
            key: "child".concat(i),
            route: {
              params,
              path
            }
          });
        });
      }
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
  window.history[replace ? "replaceState" : "pushState"]({}, "", path);
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
    rest = _objectWithoutProperties(_ref, _excluded);
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
  return lastRoute ? lastRoute.props.path : "";
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
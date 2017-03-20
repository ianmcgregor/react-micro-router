import React, {Component} from 'react';

export const routes = [];

export function isMatch(path, exact) {
    if (!path) {
        return false;
    }

    if (exact && location.path() !== path) {
        return false;
    }

    return new RegExp(`^${path}`).test(location.path());
}

export class Route extends Component {
    constructor() {
        super();

        this.onPopState = this.onPopState.bind(this);
    }

    componentWillMount() {
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
        const {path, exact, children} = this.props;

        if (!isMatch(path, exact)) {
            return null;
        }

        return <div>{children}</div>;
    }
}

export function redirect(path, replace = false) {
    window.history[replace ? 'replaceState' : 'pushState']({}, null, path);
    routes.forEach(route => route.forceUpdate());
}

export function Link({children, className, to, href, replace = false, activeClassName = 'active'}) {

    const path = to || href;

    function onClick(event) {
        event.preventDefault();
        redirect(path, replace);
    }

    if (isMatch(path, path === '/')) {
        className = `${className} ${activeClassName}`.trim();
    }

    return (
        <a className={className} href={path} onClick={onClick}>
            {children}
        </a>
    );
}

export function getCurrentPath() {
    return routes
        .filter(route => isMatch(route.props.path, !!route.props.exact))
        .pop().props.path;
}

export function getParams(path) {
    if (!path) {
        path = getCurrentPath();
    }

    return location.path().match(new RegExp(`^${path}`)).slice(1);
}

// allow tests to override
export const location = {
    path() {
        return window.location.pathname;
    }
};

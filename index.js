import React, {Component, cloneElement} from 'react';
import CSSTransition from "react-transition-group/CSSTransition";
import TransitionGroup from 'react-transition-group/TransitionGroup';

export const routes = [];

// allow tests to override
export const location = {
    path: () => window.location.pathname
};

export function isMatch(path, exact) {
    if (!path) {
        return false;
    }

    if (location.path() === path) {
        return true;
    }

    if (exact && location.path() !== path) {
        return false;
    }

    return new RegExp(`^${path}`).test(location.path());
}

export class Route extends Component {
    constructor(props) {
        super(props);

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
        const {path, exact, children, transition, className} = this.props;

        const active = isMatch(path, exact);

        let childNodes = active ? React.Children.toArray(children) : [];

        if (childNodes.length) {
            const params = getParams(path);

            childNodes = childNodes.map((child, i) => {
                if (typeof child.type === 'string' || child.type === Route) {
                    return child;
                }
                return cloneElement(child, {key: `child${i}`, route: {params, path}});
            });
        }

        if (!transition) {
            return <span className={className}>{childNodes}</span>;
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

        return (
            <TransitionGroup>
                <CSSTransition
                    className={className}
                    transitionName={name}
                    transitionAppear={appear}
                    transitionAppearTimeout={appearTimeout}
                    transitionEnter={enter}
                    transitionEnterTimeout={enterTimeout}
                    transitionLeave={leave}
                    transitionLeaveTimeout={leaveTimeout}>
                {childNodes}
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

export function redirect(path, replace = false) {
    window.history[replace ? 'replaceState' : 'pushState']({}, null, path);
    routes.forEach(route => route.forceUpdate());
}

export function Link({children, className, to, href, replace = false, activeClassName = 'active', match = null}) {
    const path = to || href;

    function onClick(event) {
        event.preventDefault();
        redirect(path, replace);
    }

    if (isMatch(path, path === '/') || (match && isMatch(match, false))) {
        className = `${className} ${activeClassName}`.trim();
    }

    return (
        <a className={className} href={path} onClick={onClick}>
            {children}
        </a>
    );
}

export function getCurrentPath() {
    const lastRoute = routes
        .filter(route => isMatch(route.props.path, !!route.props.exact))
        .pop();

    return lastRoute ? lastRoute.props.path : '';
}

export function getParams(path) {
    if (!path) {
        path = getCurrentPath();
    }

    const matches = location.path().match(new RegExp(`^${path}`));

    if (!matches) {
        return [];
    }

    return matches.slice(1);
}

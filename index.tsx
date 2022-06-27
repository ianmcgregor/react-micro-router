import React, { Component, cloneElement, AnchorHTMLAttributes, isValidElement } from "react";
import CSSTransition, {CSSTransitionProps} from "react-transition-group/CSSTransition";
import TransitionGroup from "react-transition-group/TransitionGroup";

export const routes: Route[] = [];

export type ComponentRouteProps = {
    path: string;
    params: string[]
}

// allow tests to override
export const location = {
    path: () => window.location.pathname
};

export function isMatch(path: string | null, exact = false) {
    if (!path) {
        return false;
    }

    if (exact && location.path() !== path) {
        return false;
    }

    if (location.path() === path) {
        return true;
    }

    return new RegExp(`^${path}`).test(location.path());
}

type RouteProps = {
    path: string;
    exact?: boolean;
    transition?: CSSTransitionProps
    className?: string;
    children: React.ReactNode | ((props: ComponentRouteProps) => JSX.Element);
};

export class Route extends Component<RouteProps> {
    constructor(props: RouteProps) {
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
        const {path, exact, children, transition, className} = this.props;

        const active = isMatch(path, exact);

        let childNodes;

        if (!active) {
            childNodes = []
        } else if (typeof children === "function") {
            const childProps: ComponentRouteProps = {
                params: getParams(path),
                path,
            }

            childNodes = children(childProps);
        } else {
            childNodes = React.Children.toArray(children);

            if (childNodes.length) {
                const params = getParams(path);

                childNodes = childNodes.map((child, i) => {
                    if (!isValidElement(child)) {
                        return child;
                    }
                    if (typeof child.type === 'string' || child.type === Route) {
                        return child;
                    }
                    return cloneElement<{ key: string, route: ComponentRouteProps }>(child, {
                        key: `child${i}`,
                        route: { params, path }
                    })
                });
            }
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
                {/* @ts-ignore */}
                <CSSTransition
                    className={className}
                    transitionName={name}
                    transitionAppear={appear}
                    transitionAppearTimeout={appearTimeout}
                    transitionEnter={enter}
                    transitionEnterTimeout={enterTimeout}
                    transitionLeave={leave}
                    transitionLeaveTimeout={leaveTimeout}
                >
                    {childNodes}
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

export function redirect(path: string, replace = false): void {
    window.history[replace ? 'replaceState' : 'pushState']({}, "", path);
    routes.forEach(route => route.forceUpdate());
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
    className?: string;
    exact?: boolean;
    to: string;
    href?: string;
    replace?: boolean;
    activeClassName?: string;
    match?: string | null;
}

export function Link({
         children,
         className,
         exact = false,
         to,
         href,
         replace = false,
         activeClassName = "active",
         match = null,
         ...rest
     }: LinkProps) {
    const path = to ?? href;

    const onClick: React.MouseEventHandler<HTMLAnchorElement> = function (event) {
        event.preventDefault();
        redirect(path, replace);
    }

    if (
        isMatch(path, exact ? exact : path === "/") ||
        (match && isMatch(match, exact))
    ) {
        className = `${className} ${activeClassName}`.trim();
    }

    return (
        <a className={className} href={path} onClick={onClick} {...rest}>
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

export function getParams(path: string | null) {
    if (!path) {
        path = getCurrentPath();
    }

    const matches = location.path().match(new RegExp(`^${path}`));

    if (!matches) {
        return [];
    }

    return matches.slice(1);
}

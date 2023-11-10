import React, { Component, AnchorHTMLAttributes } from "react";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
export declare const routes: Route[];
export type ComponentRouteProps = {
    path: string;
    params: string[];
};
export declare const location: {
    path: () => string;
};
export declare function isMatch(path: string | null, exact?: boolean): boolean;
type RouteProps = {
    path: string;
    exact?: boolean;
    transition?: CSSTransitionProps;
    className?: string;
    children: React.ReactNode | ((props: ComponentRouteProps) => JSX.Element);
};
export declare class Route extends Component<RouteProps> {
    constructor(props: RouteProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onPopState(): void;
    render(): React.JSX.Element;
}
export declare function redirect(path: string, replace?: boolean): void;
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
    className?: string;
    exact?: boolean;
    to: string;
    href?: string;
    replace?: boolean;
    activeClassName?: string;
    match?: string | null;
};
export declare function Link({ children, className, exact, to, href, replace, activeClassName, match, ...rest }: LinkProps): React.JSX.Element;
export declare function getCurrentPath(): string;
export declare function getParams(path: string | null): string[];
export {};

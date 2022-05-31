# react-micro-router

[![NPM version](https://badge.fury.io/js/react-micro-router.svg)](http://badge.fury.io/js/react-micro-router) [![Build Status](https://travis-ci.org/ianmcgregor/react-micro-router.svg?branch=master)](https://travis-ci.org/ianmcgregor/react-micro-router)

Bare-bones router for React

## Features

* Very minimal (~ 200 loc)
* Solid and uncomplicated for simple use-cases
* Declarative API like react-router

## Installation

```shell
npm i -S react-micro-router
```

## Usage

```javascript
import React from 'react';
import {Route, Link} from 'react-micro-router';
import {Home, Hello} from './components';

export default function App() {

    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/hello">Hello</Link>

            <Route path="/" exact>
                <Home/>
            </Route>

            <Route path="/hello">
                <Hello/>
            </Route>
        </div>
    );

}
```

#### Nest routes

```javascript
<Route path="/">
    <Route path="/fruit">
        <h1>Fruit</h1>
        <Route path="/fruit/apples">
            <h2>Apples</h2>
        </Route>
        <Route path="/fruit/oranges">
            <h2>Oranges</h2>
        </Route>
    </Route>
</Route>
```

#### Use regular expressions

```javascript
<Route path="/">
    <AlwaysHere/>
    <Route path="/($|other)">
        <RootOrOther/>
    </Route>
    <Route path="/things" exact>
        <Link to="/things/1">Thing 1</Link>
        <Link to="/things/two">Thing Two</Link>
    </Route>
    <Route path="/things/([0-9a-z]+)">
        <Thing/>
        <Link to="/things">Back</Link>
    </Route>
</Route>
```

#### Get current path and regex capture groups

```javascript
function MyComponent(props) {
    const {path, params} = props.route;
    return (
        <div>
            <p>{path}</p>
            <p>{params[0]}</p>
        </div>
    );
}

<Route path="/hello/([a-z]+)">
    <MyComponent/>
</Route>

// for location.pathname `/hello/world` outputs:

<div>
    <p>/hello/([a-z]+)</p>
    <p>world</p>
</div>

```

#### TypeScript

Use `ComponentRouteProps` to get access to `path` and `params` in your component when using TypeScript.

```tsx
import {ComponentRouteProps} from 'react-micro-router';

type Props = {
    text: string;
    route: ComponentRouteProps
}

function MyComponent(props: Props) {
    const {path, params} = props.route;
    return (
        <div>
            <p>{path}</p>
            <p>{params[0]}</p>
            <p>{props.text}</p>
        </div>
    );
}
```

Note: when calling the component Typescript will complain about the props not being present. To avoid this, either 
allow an undefined `route` prop:

```ts
type Props = {
  text: string;
  route?: ComponentRouteProps;
}
```

Or use a function as a child to render child components:

```tsx
function Router(props) {
  
    return (
        <Route>
          {(route) => <ChildComponent route={route} otherProp={false} />}
        </Route>
    );
}
```

#### Transitions (see [react-transition-group](https://github.com/reactjs/react-transition-group) for details)

```javascript

const transition = {
    name: 'Transition',
    appear: true,
    appearTimeout: 400,
    enter: true,
    enterTimeout: 600,
    leave: true,
    leaveTimeout: 400
};

function App() {
    return (
        <Route className="App" path="/">
            <Header/>
            <Route path="/" exact transition={transition}>
                <Oh/>
            </Route>
            <Route path="/yes" transition={transition}>
                <Yes/>
            </Route>
            <Footer/>
        </Route>
    );
}
```
```css
.Transition-enter {
    opacity: 0;
}

.Transition-enter.Transition-enter-active {
    opacity: 1;
    transition: opacity 400ms ease-in 200ms;
}

.Transition-leave {
    opacity: 1;
}

.Transition-leave.Transition-leave-active {
    opacity: 0;
    transition: opacity 400ms ease-out;
}

.Transition-appear {
    opacity: 0;
}

.Transition-appear.Transition-appear-active {
    opacity: 1;
    transition: opacity 400ms ease-in;
}
```

#### Link supports `activeClassName` (it defaults to `active`).

```javascript
<Link to="/hello" activeClassName="is-active">Hello</Link>
// for route /hello renders <a class="is-active">Hello</a>

<Link to="/" className="Link" activeClassName="current">Home</Link>
// for route / renders  <a class="Link current">Home</a>
```

#### Control link active state using Regex

```javascript
// links to / but will be active for / and /also
<Link to="/" match="/($|also)">Hello</Link>
```

#### Get current path and regex capture groups from router

```javascript
import {getCurrentPath, getParams} from 'react-micro-router';

// example: location.pathname /foo/bar/42
const path = getCurrentPath(); // '/foo/([a-z]+)/([0-9]+)'
const params = getParams(); // ['bar', '42']

```

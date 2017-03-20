# react-micro-router

[![NPM version](https://badge.fury.io/js/react-micro-router.svg)](http://badge.fury.io/js/react-micro-router) [![Build Status](https://travis-ci.org/ianmcgregor/react-micro-router.svg?branch=master)](https://travis-ci.org/ianmcgregor/react-micro-router)

Bare-bones router for React

## Features

* Very minimal (~ 100 loc)
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
    <Route path="/things" exact>
        <Link to="/things/1">Thing 1</Link>
        <Link to="/things/2">Thing 2</Link>
    </Route>
    <Route path="/things/([0-9]+)">
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

#### Link supports `activeClassName` (it defaults to `active`).

```javascript
<Link to="/hello" activeClassName="is-active">Hello</Link>
```

#### Get current path and regex capture groups from router

```javascript
import {getCurrentPath, getParams} from 'react-micro-router';

// example: location.pathname /foo/bar/42
const path = getCurrentPath(); // '/foo/([a-z]+)/([0-9]+)'
const params = getParams(); // ['bar', '42']

```

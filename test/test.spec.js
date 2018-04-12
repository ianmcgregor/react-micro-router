const React = require('react');
const router = require('../dist/index');
const Route = router.Route;
const Link = router.Link;
const getCurrentPath = router.getCurrentPath;
const getParams = router.getParams;
// const jsdom = require('jsdom');
const enzyme = require('enzyme');
const adapter = require("enzyme-adapter-react-16");

enzyme.configure({ adapter: new adapter() });

// broken in jest env:
// jsdom.changeURL(window, 'https://example.com/');
// console.log('location.pathname', location.pathname);
function changeURL(newPath) {
    router.location.path = () => newPath;
}

let wrapper;

describe('Basic route', () => {

    beforeAll(() => {
        changeURL('/mocked');

        wrapper = enzyme.mount(
            <Route path="/mocked">
                <p>Hello</p>
            </Route>
        );
    });

    afterAll(() => {
        wrapper.unmount();
    });

    it('should contain children', () => {
        expect(wrapper.contains(<p>Hello</p>)).toBe(true);
    });

    it('should return path', () => {
        expect(getCurrentPath()).toEqual('/mocked');
    });

    it('should return params', () => {
        expect(getParams()).toEqual([]);
    });
});

describe('Route with params', () => {

    beforeAll(() => {
        changeURL('/mocked/1');

        wrapper = enzyme.mount(
            <div>
                <Route path="/mocked" exact>
                    <p>No</p>
                </Route>
                <Route path="/mocked/([0-9]+)">
                    <p>Yes</p>
                </Route>
            </div>
        );
    });

    afterAll(() => {
        wrapper.unmount();
    });

    it('should contain children', () => {
        expect(wrapper.contains(<p>Yes</p>)).toBe(true);
    });

    it('should return path', () => {
        expect(getCurrentPath()).toEqual('/mocked/([0-9]+)');
    });

    it('should return params', () => {
        expect(getParams()).toEqual(['1']);
    });

});

describe('Nested route', () => {
    beforeAll(() => {
        changeURL('/mocked/child');

        wrapper = enzyme.mount(
            <div>
                <Route path="/mocked">
                    <p>Yes</p>
                    <Route path="/mocked/child">
                        <p>And Yes</p>
                    </Route>
                </Route>
            </div>
        );
    });

    afterAll(() => {
        wrapper.unmount();
    });

    it('should contain children', () => {
        expect(wrapper.contains(<p>Yes</p>)).toBe(true);
        expect(wrapper.contains(<p>And Yes</p>)).toBe(true);
    });

    it('should return path', () => {
        expect(getCurrentPath()).toEqual('/mocked/child');
    });

});

describe('Route prop', () => {
    beforeAll(() => {
        changeURL('/mocked/42');

        function Mocked(props) {
            return (
                <div>
                    <p>{props.route.path}</p>
                    <p>{props.route.params[0]}</p>
                </div>
            );
        }

        wrapper = enzyme.mount(
            <Route path="/mocked/([0-9]+)">
                <Mocked/>
            </Route>
        );
    });

    afterAll(() => {
        wrapper.unmount();
    });

    it('should contain children', () => {
        expect(wrapper.contains(<p>/mocked/([0-9]+)</p>)).toBe(true);
        expect(wrapper.contains(<p>42</p>)).toBe(true);
    });

});

describe('Link', () => {

    const link = (
        <Link to="/hello">Hello</Link>
    );

    it('should render without throwing an error', () => {
        expect(enzyme.render(link).text()).toEqual('Hello');
    });

    it('should have to prop', () => {
        expect(enzyme.mount(link).props().to).toEqual('/hello');
    });

    it('should have href', () => {
        expect(enzyme.shallow(link).props().href).toEqual('/hello');
    });

    it('should have onClick', () => {
        expect(typeof enzyme.shallow(link).props().onClick).toEqual('function');
    });
});

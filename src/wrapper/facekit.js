'use strict';

import Component from '../main/js/base/Component';
import Element from '../main/js/base/Element';
import DOMBuilder from '../main/js/base/DOMBuilder';

import DekuComponentAdapter from '../main/js/adapters/DekuComponentAdapter';
import ReactComponentAdapter from '../main/js/adapters/ReactComponentAdapter';

Component.registerComponentAdapter('deku', new DekuComponentAdapter());
Component.registerComponentAdapter('react', new ReactComponentAdapter());


window.facekit = window.facekit || {
    base: {
        Component, Element, DOMBuilder
    },
    react: {},
    deku: {}
};

import FkButton from '../main/js/components/Button';
import FkButtonGroup from '../main/js/components/ButtonGroup';
import FkPagination from '../main/js/components/Pagination';
import FkPaginationInfo from '../main/js/components/PaginationInfo';
import FkPager from '../main/js/components/Pager';
import FkTabs from '../main/js/components/Tabs';
import FkTab from '../main/js/components/Tab';
import FkCounter from '../main/js/components/Counter';

const componentClasses = {
    Button: FkButton,
    ButtonGroup: FkButtonGroup,
    Pagination: FkPagination,
    PaginationInfo: FkPaginationInfo,
    Pager: FkPager,
    Tabs: FkTabs,
    Tab: FkTab,
    Counter: FkCounter
};

const angularModule = typeof angular === 'object' && angular
    ? angular.module('facekit', [])
    : null;

for (let componentClassName of Object.getOwnPropertyNames(componentClasses)) {
    const
        componentClass = componentClasses[componentClassName],
        componentFunction = componentClass.createElement,
        componentFunctionName = componentClassName.charAt(0).toLowerCase() + componentClassName.slice(1);


    if (typeof document.registerElement === 'function') {
        const elementName = 'fk-' + componentFunctionName.replace(/[^A-Z]([A-Z])(?:[^A-Z]|$)|([A-Z]+)([A-Z])/g,
                (a, b ,c) => !c
                        ?  a.charAt(0) + '-' + b.toLowerCase() + a.charAt(2)
                        : ('-' + c + '-' + d).toLowerCase());

          Component.registerWebComponent(componentClass, elementName);
    }

    facekit.react[componentClassName] = componentClass.convertTo('react');
    facekit.react[componentFunctionName] = (...args) => componentClass.createElement(...args).convertTo('react');
    facekit.deku[componentClassName] = componentClass.convertTo('deku');
    facekit.deku[componentFunctionName] = (...args) => componentClass.createElement(...args).convertTo('deku');

    if (angularModule) {
        angularModule.directive('fk' + componentClassName, () => componentClass.toAngular());
    }
}

import {DemoOfButtons, DemoOfButtonGroups, DemoOfPagination, DemoOfTabs, DemoOfCounter} from '../demo/demo-components.js';

const demoClasses = {
    DemoOfButtons,
    DemoOfButtonGroups,
    DemoOfPagination,
    DemoOfTabs,
    DemoOfCounter
}

window.demo = {
    react: {},
    deku: {}
};

for (let demoClassName of Object.getOwnPropertyNames(demoClasses)) {
     const
        demoClass = demoClasses[demoClassName],
        demoFunctionName = demoClassName.charAt(0).toLowerCase() + demoClassName.slice(1);

     demo.react[demoClassName] = demoClass.convertTo('react');
     demo.react[demoFunctionName] = () => demoClass.createElement({}, []).convertTo('react');
     demo.deku[demoClassName] = demoClass.convertTo('deku');
     demo.deku[demoFunctionName] = () => demoClass.createElement({}, []).convertTo('deku');

     if (angularModule) {console.log(demoFunctionName)
        angularModule.directive(demoFunctionName, () => demoClass.toAngular());
     }
}



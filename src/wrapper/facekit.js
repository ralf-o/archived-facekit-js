'use strict';

import Component from '../main/js/base/Component';
import Element from '../main/js/base/Element';
import DOMBuilder from '../main/js/base/DOMBuilder';

window.facekit = window.facekit || {
    base: {
        Component, Element, DOMBuilder
    },
    react: {},
    deku: {}
};

import FkButton from '../main/js/components/Button';
import FkButtonGroup from '../main/js/components/ButtonGroup';
import FkPaginationInfo from '../main/js/components/PaginationInfo';
import FkPager from '../main/js/components/Pager';
import FkTabs from '../main/js/components/Tabs';
import FkTab from '../main/js/components/Tab';
import FkCounter from '../main/js/components/Counter';

const componentClasses = {
    Button: FkButton,
    ButtonGroup: FkButtonGroup,
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

    facekit.react[componentClassName] = componentClass.toReact();
    facekit.react[componentFunctionName] = (...args) => componentClass.createElement(...args).toReact();
    facekit.deku[componentClassName] = componentClass.toDeku();
    facekit.deku[componentFunctionName] = (...args) => componentClass.createElement(...args).toDeku();

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

     demo.react[demoClassName] = demoClass.toReact();
     demo.react[demoFunctionName] = () => demoClass.createElement({}, []).toReact();
     demo.deku[demoClassName] = demoClass.toDeku();
     demo.deku[demoFunctionName] = () => demoClass.createElement({}, []).toDeku();

     if (angularModule) {console.log(demoFunctionName)
        angularModule.directive(demoFunctionName, () => demoClass.toAngular());
     }
}



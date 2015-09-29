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
import FkCounter from '../main/js/components/Counter';
import FkPaginationInfo from '../main/js/components/PaginationInfo';
import FkPager from '../main/js/components/Pager';
import FkTabs from '../main/js/components/Tabs';
import FkTab from '../main/js/components/Tab';

const componentClasses = {
    Button: FkButton,
    ButtonGroup: FkButtonGroup,
    PaginationInfo: FkPaginationInfo,
    Pager: FkPager,
    Tabs: FkTabs,
    Tab: FkTab
};

for (let componentClassName of Object.getOwnPropertyNames(componentClasses)) {
    let componentClass = componentClasses[componentClassName];
    facekit.react[componentClassName] = componentClass.toReact();
    facekit.deku[componentClassName] = componentClass.toDeku();
}


import {DemoOfButtons, DemoOfButtonGroups, DemoOfPagination, DemoOfTabs} from '../demo/demo.js';

const demoClasses = {
    DemoOfButtons,
    DemoOfButtonGroups,
    DemoOfPagination,
    DemoOfTabs
}

window.demo = {
    react: {},
    deku: {}
};

for (let demoClassName of Object.getOwnPropertyNames(demoClasses)) {
    let demoClass = demoClasses[demoClassName];
     demo.react[demoClassName] = demoClass.toReact();
     demo.deku[demoClassName] = demoClass.toDeku();
}



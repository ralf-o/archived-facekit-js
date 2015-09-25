'use strict';


window.facekit = window.facekit || {};
facekit.react = {};

import button from '../main/js/components/button';
facekit.react.Button = button.toReact();

import buttonGroup from '../main/js/components/buttonGroup';
facekit.react.ButtonGroup = buttonGroup.toReact();

import counter from '../main/js/components/counter';
facekit.react.Counter = counter.toReact();

import paginationInfo from '../main/js/components/paginationInfo';
facekit.react.PaginationInfo = paginationInfo.toReact();

import pager from '../main/js/components/pager';
facekit.react.Pager = pager.toReact();



/*
import FKButton from '../../../build/src/main/js/components/Button';
export const Button = FKButton.toReact();

import FKButtonGroup from '../../../build/src/main/js/components/ButtonGroup';
export const ButtonGroup = FKButtonGroup.toReact();

import PaginationInfo from '../../../build/src/main/js/components/PaginationInfo';

import FKPager from '../../../build/src/main/js/components/Pager';
export const Pager = FKPager.toReact();
*/
//import FKCounter from '../../../build/src/main/js/components/Counter';
//export const Counter = FKCounter.toReact();
/*
window.Button = Button;
window.ButtonGroup = ButtonGroup;
window.PaginationInfo = PaginationInfo;
window.Pager = Pager;
*/
//window.Counter = Counter;

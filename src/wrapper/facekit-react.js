'use strict';


window.facekit = {};
facekit = {};

import FKButton from '../main/js/components/Button';
facekit.Button = FKButton.toReact();
facekit.button = facekit.Button.asFunction();
console.log(facekit.button)
import FKButtonGroup from '../main/js/components/ButtonGroup';
facekit.ButtonGroup = FKButtonGroup.toReact();
facekit.buttonGroup = facekit.ButtonGroup.asFunction();

import FKCounter from '../main/js/components/Counter';
facekit.Counter = FKCounter.toReact();
facekit.counter = facekit.Counter.asFunction();

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

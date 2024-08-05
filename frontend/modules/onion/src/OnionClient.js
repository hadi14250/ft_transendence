import { Component } from './OnionComponent.js';
import { createContext } from './OnionContext.js';
import { createElement, isValidElement } from './OnionElement.js';
import { forEach, map, count, toArray, combine } from './OnionChildren.js';
import { createRef } from './OnionReference.js';
import { objectToProps, propsToObject } from './OnionProps.js';

const Children = {
    map,
    forEach,
    count,
    toArray,
    combine
};

export {
    Children,
    Component,
    createContext,
    createElement,
    isValidElement,
    createRef,
    objectToProps,
    propsToObject
}
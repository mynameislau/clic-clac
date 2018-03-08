# CLIC - CLAC

[![License][license-image]][license-url]
[![GitHub Release][github-release-image]][github-release-url]
[![Dependency status][david-dm-image]][david-dm-url]
[![Build Status][travis-image]][travis-url]

## EXAMPLES

http://mynameislau.github.io/clic-clac

## HOW TO USE

import `clic-clac` in your main js file (or simply embed it via a `<script>` tag)

## EXPAND

 Put `data-expand` on the button controlling the expand of an element
`data-controls="idOfTheControlledElement"` tells the lib which element this button is controlling  
`data-expand-default-state`sets the default aria state of the element

## TABLIST

Set a `data-tablist` attribute on the element that will be the tablist,
the value of the attribute
is the name of the tablist, you can leave it blank and use
the id attribute (used to fill the aria-owns attribute later)
You can specify if the tablist is multiselectable with the *data-multiselectable* attribute.
On each tab button, set a `data-tab-for` attribute which value is the id
of the controlled tab panel.  
Set a `data-owner` attribute 
to specify the tablist that owns the tab.  

Set a `data-expand-default-state` attribtue to true or false if you want
to specify a default state for this tab

If you only want at least one tab selected at all times, add a `data-at-least-one` attribute to the tablist element with the value `true`.

## EVENTS

Every time  an attribute is modified, a custom `clic-clac-state-update` event is dispatched on the element whose attribute changed.
You can use this event as a hook to add custom js behaviours.
The `detail` property holds infos about the element : 
 - `attribute` : which attribute changed
 - `prevState`: previous value of the attribute
 - `newState` : new value of the attribute
 
[david-dm-image]: https://img.shields.io/david/mynameislau/clic-clac.svg
[david-dm-url]: https://david-dm.org/mynameislau/clic-clac
[travis-image]: https://travis-ci.org/mynameislau/clic-clac.svg?branch=master
[travis-url]: https://travis-ci.org/mynameislau/clic-clac
[github-release-image]: https://img.shields.io/github/release/mynameislau/clic-clac.svg
[github-release-url]: https://github.com/mynameislau/clic-clac/releases
[license-image]: https://img.shields.io/npm/l/clic-clac.svg
[license-url]: https://github.com/mynameislau/clic-clac/master/LICENSE

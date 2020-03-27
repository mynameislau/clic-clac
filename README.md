# CLIC - CLAC

[![License][license-image]][license-url]
[![GitHub Release][github-release-image]][github-release-url]
[![Dependency status][david-dm-image]][david-dm-url]
[![GZipped size][gzipped-size]][david-dm-url]
[![Build Status][travis-image]][travis-url]

## EXAMPLES

http://mynameislau.github.io/clic-clac

## HOW TO USE

import `clic-clac` in your main js file (or simply embed it via a `<script>` tag)
Initiate the behaviors using the `init` method.
```javascript
import * as clicClac from 'clic-clac';
clicClac.init();
```

or you can init only expand or tablist :

```javascript
import { expand } from 'clic-clac';
expand.init('any-dom-selector'); // default is [data-expand]
```

If you import it via a script tag, the name of the library in the window object is `clicClac`.

## EXPAND

- The init function parameter is a DOM selector targeting the button that toggles an element.
- `data-controls="idOfTheControlledElement"` tells the lib which element this button is controlling  
  This can be a list of ids separated by spaces.
- `data-expand-default-state` sets the default aria state of the element
- If you want your content to collapse when you click outside of the area, add a `data-click-outside` attribute with   the `deselect` value to the **controlled** element.

## TABLIST

- The init function parameter is a DOM selector targeting the tablist main element.

- The id of the element will be the name of the tablist (used to fill the aria-owns attribute later).
You can specify if the tablist is multiselectable with the *data-multiselectable* attribute.
On each tab button, set a `data-tab-for` attribute which value is the id. If your tab button is a link (`<a>`), you can juste specify the id with an anchor link (`href="#xy"`).
of the controlled tab panel.  
Set a `data-owner` attribute 
to specify the tablist that owns the tab.  

- Set a `data-expand-default-state` attribtue to true or false if you want
to specify a default state for this tab

- If you don't want at least one tab selected at all times, add a `data-at-least-one` attribute to the tablist element with the value `false`.

- If you want your content to collapse when you click outside of the area, add a `data-click-outside` attribute with the `deselect` value.

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
[gzipped-size]: https://img.badgesize.io/mynameislau/clic-clac/master/lib/clic-clac.js?compression=gzip
[github-release-image]: https://img.shields.io/github/release/mynameislau/clic-clac.svg
[github-release-url]: https://github.com/mynameislau/clic-clac/releases
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT

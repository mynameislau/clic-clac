# CLIC - CLAC

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

If you only want at least one tab selected at all times, add a `data-at-least-one` attribute to the tablist element

## EVENTS

Every time  an attribute is modified, a custom `clic-clac-state-update` event is dispatched on the element whose attribute changed.
You can use this event as a hook to add custom js behaviours.
The `detail` property holds infos about the element : 
 - `attribute` : which attribute changed
 - `prevState`: previous value of the attribute
 - `newState` : new value of the attribute

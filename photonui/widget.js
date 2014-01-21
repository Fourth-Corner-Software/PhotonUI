/*
 * Copyright (c) 2014, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Widget
 * @main widget
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Base class for all PhotonUI widgets.
 *
 * @class Widget
 * @constructor
 */
photonui.Widget = function() {
    this.visible = true;
    this.childWidget = null;
    this.__events = {};  // id: {element: DOMElement, callback: Function}
}


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the HTML of the widget.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.Widget.prototype.getHtml = function() {
    console.warn("getHtml() method not implemented for this widget.");
    return null;
}

/**
 * Get the container DOM Element.
 *
 * @method getContainer
 * @return {HTMLElement}
 */
photonui.Widget.prototype.getContainer = function() {
    console.warn("getContainer() method not implemented for this widget.");
    return null;
}

/**
 * Get the visibility of the widget.
 *
 * @method isVisible
 * @return {Boolean} the widget visibility.
 */
photonui.Widget.prototype.isVisible = function() {
    return this.visible;
}

/**
 * Set the visibility of the widget.
 *
 * @method isVisible
 * @param {Boolean} visible The widget visibility.
 */
photonui.Widget.prototype.setVisible = function(visible) {
    if (!this.getHtml()) {
        return;
    }
    this.visible = visible;
    if (visible) {
        this.getHtml().style.display = "block";
    }
    else {
        this.getHtml().style.display = "none";
    }
}

/**
 * Get the child of the current Widget.
 *
 * @method getChild
 * @return {photonui.Widget} The child widget or null.
 */
photonui.Widget.prototype.getChild = function() {
    return this.childWidget;
}

/**
 * Set the child of the current widget.
 *
 * @method setChild
 * @param {photonui.Widget} child The new child of the widget.
 */
photonui.Widget.prototype.setChild = function(child) {
    if (child == this.childWidget || !this.getContainer()) {
        return;
    }

    if (this.childWidget) {
        var e = this.getContainer();
        while (e.firstChild) {
            e.removeChild(e.firstChild);
        }
    }

    this.childWidget = child;

    if (this.childWidget) {
        this.getContainer().appendChild(this.childWidget.getHtml())
    }
}


//////////////////////////////////////////
// Public Methods                       //
//////////////////////////////////////////


/**
 * Display the widget (alias of this.setVisible(true)).
 *
 * @method show
 */
photonui.Widget.prototype.show = function() {
    this.setVisible(true);
}

/**
 * Hide the widget (alias of this.setVisible(false)).
 *
 * @method hide
 */
photonui.Widget.prototype.hide = function() {
    this.setVisible(false);
}

/**
 * Destroy the widget and all its children.
 *
 * @method destroy
 */
photonui.Widget.prototype.destroy = function() {
    if (this.childWidget) {
        this.childWidget.destroy();
    }
    if (!this.getHtml()) {
        return;
    }
    this.getHtml().parentNode.removeChild(this.getHtml());
    this.childWidget = null;
}

/**
 * Add a class to the root HTML element of the widget.
 *
 * @method addClass
 * @param {String} class_ The class.
 */
photonui.Widget.prototype.addClass = function(class_) {
    var e = this.getHtml();
    if (!e) {
        return;
    }
    var classes = e.className.split(" ");
    if (classes.indexOf(class_) < 0) {
        classes.push(class_);
    }
    e.className = classes.join(" ");
}

/**
 * Remove a class from the root HTML element of the widget.
 *
 * @method removeClass
 * @param {String} class_ The class.
 */
photonui.Widget.prototype.removeClass = function(class_) {
    var e = this.getHtml();
    if (!e) {
        return;
    }
    var classes = e.className.split(" ");
    var index = classes.indexOf(class_);
    if (index >= 0) {
        classes.splice(index, 1);
    }
    e.className = classes.join(" ");
}

//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Basic event binding (for widget internal use).
 *
 * @method _bindEvent
 * @private
 * @param {String} id An unique id for the event.
 * @param {DOMElement} element The element on which the event will be bind.
 * @param {String} evName The event name (e.g. "mousemove", "click",...).
 * @param {Function} callback The function that will be called when the event occured.
 */
photonui.Widget.prototype._bindEvent = function(id, element, evName, callback) {
    this.__events[id] = {
        evName: evName,
        element: element,
        callback: callback
    };
    this.__events[id].element.addEventListener(
            this.__events[id].evName,
            this.__events[id].callback,
            false
    );
}

/**
 * Unbind event.
 *
 * @method _unbindEvent
 * @private
 * @param {String} id The id for the event.
 */
photonui.Widget.prototype._unbindEvent = function(id) {
    this.__events[id].element.removeEventListener(
            this.__events[id].evName,
            this.__events[id].callback,
            false
    );
    delete this.__events[id];
}

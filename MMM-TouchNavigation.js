/* global Module */

/* Magic Mirror
 * Module: MMM-TouchNavigation
 *
 * By Brian Janssen
 * MIT Licensed.
 */

Module.register("MMM-TouchNavigation", {
  // Default module config.
  defaults: {
    // Determines if the border around the buttons should be shown.
    showBorder: true,
    // The minimum width for all the buttons.
    minWidth: "0px",
    // The minimum height for all the buttons.
    minHeight: "0px",
    // The location of the symbol relative to the text.
    picturePlacement: "left",
    // The direction of the menu.
    direction: "row",
    // All the different buttons in the menu.
    buttons: {
      "default": {
        text: "Default",
        symbol: "ban"
      },
      "everyone": {
        text: "Example",
        symbol: "users"
      }
    },
    fadeButtons:false,
    fadeDelay:15000,
  },
  faded: false,
  // Define required styles.
  getStyles: function() {
    return ["font-awesome.css", this.file('MMM-TouchNavigation.css')];
  },

  // Override the default NotificationRecieved function
  notificationReceived: function(notification, payload, sender) {
    if (notification === "CHANGED_PROFILE") {
      this.selected = payload.to;
      this.updateDom(0);
    }
  },

  start: function() {
    this.config.picturePlacement = {
      "right": "row-reverse",
      "left": "row",
      "top": "column",
      "bottom": "column-reverse"
    }[this.config.picturePlacement];
  },

  fadeout: function(self){
      self.menu.style.opacity=.20;
      self.faded=true;
  },

  // Override dom generator.
  getDom: function() {
    if(!this.menu){
      this.menu = document.createElement("span");

      this.menu.className = "navigation-menu";
      this.menu.id = this.identifier + "_menu";
      this.menu.style.flexDirection = this.config.direction;
      this.menu.style.opacity=1;
      this.menu.style.transition = "opacity 1.25s"
      for (var name in this.config.buttons) {
        this.menu.appendChild(this.createButton(this, name, this.config.buttons[name]));
      }
      if(this.config.fadeButtons)
        this.handle=setTimeout(this.fadeout, this.config.fadeDelay, this)
    }
    return this.menu;
  },

  createButton: function(self, name, data) {
    var item = document.createElement("span");
    item.id = self.identifier + "_button_" + name;
    item.className = "navigation-button";
    item.style.minWidth = self.config.minWidth;
    item.style.minHeight = self.config.minHeight;
    item.style.flexDirection = self.config.picturePlacement;

    if (self.selected === name) {
      item.className += " current-profile";
    } else {
      item.addEventListener("click", function() {
        // if we are using fade out
        // AND we are faded out, and a button is pushed,
        if(self.config.fadeButtons && self.faded==true){
          // fade back in
          self.menu.style.opacity=1
          self.faded=false
          self.handle=setTimeout(self.fadeout, self.config.fadeDelay, self)
        }
        else {
          if(self.handle){
            clearTimeout(self.handle)
          }
          self.handle=setTimeout(self.fadeout, self.config.fadeDelay, self)
          self.sendNotification("CURRENT_PROFILE", name);
        }
      });
    }

    if (!self.config.showBorder) {
      item.style.borderColor = "black";
    }

    if (data.symbol) {
      var symbol = document.createElement("span");
      symbol.className = "navigation-picture fa fa-" + data.symbol;
      if (data.size) {
        symbol.className += " fa-" + data.size;
        symbol.className += data.size == 1 ? "g" : "x";
      }

      if (data.text && self.config.picturePlacement === "row") { // row = left
        symbol.style.marginRight = "10px";
      }

      item.appendChild(symbol);
    } else if (data.img) {
      var image = document.createElement("img");
      image.className = "navigation-picture";
      image.src = data.img;

      if (data.width) image.width = data.width;
      if (data.height) image.height = data.height;

      if (data.text && self.config.picturePlacement === "row") { // row = left
        image.style.marginRight = "10px";
      }

      item.appendChild(image);
    }

    if (data.text) {
      var text = document.createElement("span");
      text.className = "navigation-text";
      text.innerHTML = data.text;

      if ((data.symbol || data.img) && self.config.picturePlacement === "row-reverse") { // right = row-reverse
        text.style.marginRight = "10px";
      }

      item.appendChild(text);
    }

    return item;
  }
});

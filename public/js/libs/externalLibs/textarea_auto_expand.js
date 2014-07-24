/*!
 * jQuery Textarea AutoSize plugin
 * Author: Javier Julio
 * Licensed under the MIT license
 */
;(function ($, window, document, undefined) {

  var pluginName = "textareaAutoExpand";
  var pluginDataName = "plugin_" + pluginName;

  var containsText = function (value) {
    return (value.replace(/\s/g, '').length > 0);
  };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var height = this.$element.outerHeight();
      var paddingBottom = parseInt(this.$element.css('paddingBottom'))
      var paddingTop =parseInt(this.$element.css('paddingTop'));
      var diff = paddingBottom + paddingTop; 
                  
      // alert("height=" + height + "paddingBottom=" + paddingBottom + "paddingTop=" + paddingTop); 

      // Firefox: scrollHeight isn't full height on border-box
      if (this.element.scrollHeight + diff <= height) {
        diff = 0;
      }

      if (containsText(this.element.value)) {
        this.$element.height(this.element.scrollHeight);
      }

      // keyup is required for IE to properly reset height when deleting text
      this.$element.on('input keyup', function(event) {
        console.log("scrollHeight=" + this.scrollHeight + "diff=" + diff); 
        $(this)
          .height(0)
          .height(this.scrollHeight - diff);
        // $(this).css({overflow: 'hidden'})
      });
    }
  };

  $.fn[pluginName] = function (options) {
    this.each(function() {
      if (!$.data(this, pluginDataName)) {
        $.data(this, pluginDataName, new Plugin(this, options));
      }
    });
    return this;
  };

})(jQuery, window, document);
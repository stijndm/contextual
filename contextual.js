/* $Id$ */

Drupal.contextual = Drupal.contextual || {};
Drupal.contextual.active = new Array();

Drupal.behaviors.contextual = function(context) {

  var overlay = $('#contextual');
  var selectors = $('html').find('*');

  $(selectors).bind('mouseover', function(event) {

    var $target = $(event.target);

    // Check if the hovered element is not the contextual links.
    // We need to check this since the contextual links are placed above the hovered element.
    if ($target.attr('id') != 'contextual' && $target.parents('#contextual').length == 0) {
      
      // Check if the hovered element has a class .contextual-enabled or has any parents with that class, since this indicates that the contextual links should appear.
      var $elements = new Array();
      if ($target.hasClass('contextual-enabled')) {
        $elements.push($target);
      }
      if ($target.parents('.contextual-enabled').length > 0) {
        $elements = $.merge($elements, $target.parents('.contextual-enabled'));
      }

      if ($elements.length > 0) {
        // Set some variables.
        var left = 0;
        var right = 0;
        var top = 0;
        var bottom = 0;
        var marginLeft = 0;
        var marginRight = 0;
        var marginTop = 0;
        var marginBottom = 0;
        var borderWidth = 6;

        // Loop through all areas that the contextual links should appear on.
        $.each($elements, function(i, element) {

          // Find the id of the contextual link that should be shown.
          var $el = $(element);
          var id = '#contextual-'+ $el.attr("class").replace(/([^ ]+[ ]+)*contextual-([^ ]+)([ ]+[^ ]+)*/, '$2');

          // Continue if we have to move the contextual links.
          if (Drupal.contextual.active.length == 0 || $.inArray(id, Drupal.contextual.active) == -1) {
  
            // Hide the previous actions, unless we have more than one active action.
            if (Drupal.contextual.active.length > 0 && i == 0) {
              $.each(Drupal.contextual.active, function (j) {
                $(Drupal.contextual.active[j] + ' .contextual-links').hide();
                $(Drupal.contextual.active[j]).hide();
              });
              Drupal.contextual.active = [];
            }
  
            // Save the id as the new active element.
            Drupal.contextual.active[i] = id;
            var $id = $(id);
            
            // See if some margins should be used to avoid overlap when nesting.
            var position = $el.offset();
            if (i > 0) {
              marginLeft = (left - position.left < borderWidth) ? borderWidth - (left - position.left) : 0;
              marginRight = (position.left + $el.outerWidth() - right) < borderWidth ? borderWidth - (position.left + $el.outerWidth() - right) : 0;
              marginTop = (top - position.top < borderWidth) ? borderWidth - (top - position.top) : 0;
              marginBottom = (position.top + $el.outerHeight() - bottom) < borderWidth ? borderWidth - (position.top + $el.outerHeight() - bottom): 0;
            }

            // Calculate the new position.
            left = position.left;
            top = position.top;
            right = left + $el.outerWidth();
            bottom = top + $el.outerHeight();

            // Set the position on the borders and action links.
            $id.css({'top': top - $(window).scrollTop() - marginTop, 'left': left - $(window).scrollLeft() - marginLeft});
            $('.contextual-border-bottom', $id).css({'top': $el.outerHeight() + marginTop + marginBottom});
            $('.contextual-border-right', $id).css({'left': $el.outerWidth() + marginLeft + marginRight});
            $('.contextual-toggler', $id).css({'right': -5 - marginLeft - marginRight});
            $('.contextual-links', $id).css({'right': - marginLeft - marginRight});

            // Set the width and height.
            $id.css({'width': $el.outerWidth()});
            $('.contextual-border-top, .contextual-border-bottom', $id).css({'width': $el.outerWidth() + marginLeft + marginRight + 10});
            $('.contextual-border-bottom', $id).css({'width': $el.outerWidth() + marginLeft + marginRight + 10});
            $('.contextual-border-left', $id).css({'height': $el.outerHeight() + marginTop + marginBottom + 5});
            $('.contextual-border-right', $id).css({'height': $el.outerHeight() + marginTop + marginBottom + 5});

            // Show the action button.
            $id.show();

            // Show the borders.
            overlay.fadeIn('fast');
          }
        });
      }
      else {
        // Hide the contextual links, if any exist.
        if (Drupal.contextual.active.length > 0) {
          overlay.hide();
          $('.contextual-links', overlay).hide();
          $('.contextual-action', overlay).hide();
          $('.contextual-toggler-active', overlay).removeClass('contextual-toggler-active');
          Drupal.contextual.active = [];
        }
      }
    }
  });

  // Show the right actions when the actions toggler is clicked.
  $('#contextual .contextual-toggler').click(function(event) {
    var $links = $(this).next('.contextual-links');
    if ($links.is(':visible')) {
      $links.hide();
    }
    else {
      $('#contextual .contextual-links').hide();
      $links.show();
    }
    event.preventDefault();
  });

  // Make sure the borders move when scrolling.
  $(window).scroll(function() {
    Drupal.contextual.resetPosition();
  });
}

// Move the visible contextual links along with the page scroll.
Drupal.contextual.resetPosition = function () {
  var overlay = $('#contextual');
  if (overlay.is(':visible')) {
    $.each(Drupal.contextual.active, function (i) {
      var $id = $(Drupal.contextual.active[i]);
      var $el = $(Drupal.contextual.active[i].replace('#', '.'));
      var margin = i * 11;
      var position = $el.offset();
      var left = position.left;
      var top = position.top;
      $id.css({'top': top - $(window).scrollTop() - margin, 'left': left - $(window).scrollLeft() - margin});
      $('.contextual-border-bottom', $id).css({'top': $el.outerHeight() + (2 * margin)});
      $('.contextual-border-right', $id).css({'left': $el.outerWidth() + (2 * margin)});
    });
  }
};
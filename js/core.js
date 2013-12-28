(function (root) {
  var interval = 1000;
  
  // setup fix text resizing
  $('.ui-timer').find('.ui-timer-display').each(function () {
    $(this).text(moment(0, 'milliseconds').format('ss:mm')).fitText(0.45)
  });

  // $('button').each(function () {
  //   $(this).fitText(1.5);
  // });
  
  function createTimerInterval($start, $display, $reset, duration) {
    var durationMilliseconds = duration.asMilliseconds(),
      intervalId;

    $display.text(moment(durationMilliseconds).format('mm:ss'));

    intervalId = setInterval(function () {
      // decrement the duration
      durationMilliseconds = duration.asMilliseconds();
      duration = moment.duration(durationMilliseconds - interval, 'milliseconds');
      durationMilliseconds = duration.asMilliseconds();

      $display.data('current', durationMilliseconds);
      $display.text(moment(durationMilliseconds).format('mm:ss'));
      
      // if less than 10 seconds, change background color
      if (durationMilliseconds < 10000) {
        $display.addClass('alert');
      }
      
      if (durationMilliseconds === 0) {
        clearInterval(intervalId);
        $reset.data('interval-id', '');
        $display.data('current', '');
        $display.removeClass('alert');
        $start.prop('disabled', false).removeClass('disabled');
      }
    }, interval);
    
    $reset.data('interval-id', intervalId);
    $start.prop('disabled', true).addClass('disabled');
  }

  $('.ui-timer').on('touchstart', '.ui-start-timer', function () {
    var $start = $(this),
      $container = $start.closest('.ui-timer'),
      $display = $container.find('.ui-timer-display'),
      $reset = $container.find('.ui-reset-timer'),
      minutes = parseInt($container.find('.ui-timer-amount.active').data('minutes')),
      milliseconds = minutes * 60 * 1000,
      duration = moment.duration(milliseconds, 'milliseconds');
    
    if (!$start.prop('disabled')) {
      createTimerInterval($start, $display, $reset, duration);
    }
  });

  $('.ui-timer').on('touchstart', '.ui-reset-timer', function () {
    var $reset = $(this),
      $container = $reset.closest('.ui-timer'),
      $display = $container.find('.ui-timer-display'),
      $start = $container.find('.ui-start-timer');

    clearInterval($reset.data('intervalId'));
    $display.text(moment(moment.duration(0, 'milliseconds')).format('mm:ss'));
    $display.removeClass('alert');
    $start.prop('disabled', false).removeClass('disabled');
  });

  $('.ui-timer').on('touchstart', '.ui-timer-amount', function () {
    $(this).parent().children().removeClass('active').end().end().addClass('active');
  });

  $('.ui-pause-all').on('touchstart', function () {
    var $pauseButton = $(this),
      $container, minutes, milliseconds, $display, duration, intervalId;
    
    if ($pauseButton.hasClass('active')) {
      $pauseButton.removeClass('active').text('Pause All');
      
      $('.ui-timer').each(function () {
        var $container = $(this),
          $display = $container.find('.ui-timer-display'),
          current = $display.data('current'),
          $start, $reset, minutes, milliseconds, duration;

        if (current) {
          $start = $container.find('.ui-start-timer');
          $reset = $container.find('.ui-reset-timer');
          duration = moment.duration(current, 'milliseconds');
          
          createTimerInterval($start, $display, $reset, duration);
        }
      });
    } else {
      $pauseButton.addClass('active').text('Resume All');
      $('.ui-timer').each(function () {
        var $container = $(this),
          intervalId = $container.find('.ui-reset-timer').data('interval-id');
        
        if (intervalId) {
          clearInterval(intervalId);
        }
      });
    }
  });
})(window);
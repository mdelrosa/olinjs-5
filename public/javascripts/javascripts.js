$(document).ready(function() {

	$('#backcolor').click(function() {
      var back_color = $('input').val();
	  console.log(back_color);
      $('input').val('');
      $('#userdiv').css('background-color', back_color)
      $.post('/color/update', {
      	color: back_color
      });
	});

	$('#logout').click(function() {
		$.get('/logout')
	})

});
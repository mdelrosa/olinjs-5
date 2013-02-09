$(document).ready(function() {

	$('#backcolor').click(function() {
      var back_color = $('input').val();
	  console.log(back_color);
      $('input').val('');
      $.post('/color/update', {
      	color: back_color
      });
	});

	$('#logout').click(function() {
		$.get('/logout')
	})

});
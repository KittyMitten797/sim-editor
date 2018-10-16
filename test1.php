<!DOCTYPE html>
<html>
	<head>
		<title>Test1</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

		<script>
			var videoObj = new Array();
			$(document).ready(function() {
				var childWindow1 = window.open("test2.php","Child Window1", "location=0,status=0,scrollbars=0,width=320,height=250");
				var childWindow2 = window.open("test2.php","Child Window2", "location=0,status=0,scrollbars=0,width=320,height=250");
				
				$('#changeContent').click(function() {
					childWindow1.document.getElementById('target').innerHTML = 'You have been targeted!';
					childWindow2.document.getElementById('target').innerHTML = 'You have been targeted!';
					videoObj.push( childWindow1.document.getElementsByClassName('videoPlayer') );
					videoObj.push( childWindow2.document.getElementsByClassName('videoPlayer') );
					
					videoObj[0][0].play();
					videoObj[1][0].play();
				});
				$('#jumpContent').click(function() {
					videoObj[0][0].pause();
					videoObj[1][0].pause();
					videoObj[0][0].currentTime = 10;
					videoObj[1][0].currentTime = 10;
					videoObj[0][0].play();
					videoObj[1][0].play();
				});
				
				$('#mute-video1').click(function() {
					if(videoObj[0][0].muted === true) {
						videoObj[0][0].muted = false;
					} else {
						videoObj[0][0].muted = true;					
					}
				});
				$('#mute-video2').click(function() {
					if(videoObj[1][0].muted === true) {
						videoObj[1][0].muted = false;
					} else {
						videoObj[1][0].muted = true;					
					}
				});
				$('.pause').click(function() {
					var obj = $(this);
					var idParts = $(obj).attr('id' ).split('-');
					var which = idParts[1];
					console.log("Pause", which, obj );
					if ( videoObj[which][0].paused )
					{
						videoObj[which][0].play();
					}
					else
					{
						videoObj[which][0].pause();
					}
				});
			});
		</script>
	</head>

	<body>
		The content of the document......
		
		<button id="changeContent">Start Video...</button>
		<button id="jumpContent">Jump Video...</button>
		<button id="mute-video1">Toggle Mute Video1...</button>
		<button id="mute-video2">Toggle Mute Video2...</button>
		
		<button class="pause" id="pause-0">Pause/Start Video1...</button>
		<button class="pause" id="pause-1">Pause/Start Video2...</button>
	</body>
</html> 
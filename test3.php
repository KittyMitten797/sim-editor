<!DOCTYPE html>
<html>
	<head>
		<title>Test3</title>
		<script
			  src="http://code.jquery.com/jquery-3.3.1.min.js"
			  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
			  crossorigin="anonymous"></script>
		<script src="js/vwin.js"></script>
<script>
function doConnect( )
{
	vWin.connectVideo(1 );
	vWin.connectVideo(2 );
}
var vWin = new vWindow();

	$(document).ready(function() 
	{
		vWin.openWindow(320,250,"sampleVid.mp4");
		vWin.openWindow(320,250,"sampleVid.mp4");
		setTimeout(doConnect, 1000 );
		
		$('#changeContent').click(function() {
			vWin.play();
		});
		$('#jumpContent').click(function() {
			vWin.pause();
			vWin.seek(10);
			vWin.play();
		});
		
		$('.muteVideo').click(function() {
			var obj = $(this);
			var idParts = $(obj).attr('id' ).split('-');
			var which = idParts[1];
			vWin.mute_toggle(which);
		});
		$('.pauseVideo').click(function() {
			var obj = $(this);
			var idParts = $(obj).attr('id' ).split('-');
			var which = idParts[1];
			vWin.pause_toggle(which);
		});
	});
		</script>
	</head>

	<body>
		<p>The content of the document......</p>
		
		<button id="changeContent">Start Video...</button>
		<button id="jumpContent">Jump Video...</button>
		<button class="muteVideo" id="muteVideo-1">Toggle Mute Video1...</button>
		<button class="muteVideo" id="muteVideo-2">Toggle Mute Video2...</button>
		
		<button class="pauseVideo" id="pause-1">Pause/Start Video1...</button>
		<button class="pauseVideo" id="pause-2">Pause/Start Video2...</button>
	</body>
</html> 
	
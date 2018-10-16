<!DOCTYPE html>
<html>
	<head>
		<title>Test4</title>
		<script src="http://code.jquery.com/jquery-3.3.1.min.js"
			  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
			  crossorigin="anonymous"></script>

		<script>
			var windowReady = false;
			$(document).ready(function() 
			{
				var urlStr = window.location.href;
				var url = new URL(urlStr);
				filename = url.searchParams.get("filename" );
				
				$('#here').html(
'<video id="videoTest" class="videoPlayer" width=100% height="auto" >'+
'<source src="'+filename+'" type="video/mp4">'+
'</video>' );
			});
		</script>
		</head>

	<body>
		<div id='here'></div>
		<p id="target"></p>
	</body>
</html> 
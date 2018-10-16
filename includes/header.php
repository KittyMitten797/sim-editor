		<meta charset="UTF-8">
		<title>Vet School Scenario Editor</title>
		<link rel="shortcut icon" href="favicon.ico" />		
		<link rel="stylesheet" href="<?= BROWSER_CSS; ?>common.css" type="text/css" />
		<link rel="stylesheet" href="scripts/jquery-ui/1.11.4/jquery-ui.smoothness.min.css">
		<!-- <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css"> -->
        <link href="//fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">
        <link rel="stylesheet" href="<?= BROWSER_CSS; ?>jsPlumb/jsPlumbToolkit-defaults.css">
		<link rel="stylesheet" href="<?= BROWSER_CSS; ?>jsPlumb/jsPlumbToolkit-demo.css">
		<link rel="stylesheet" href="<?= BROWSER_CSS; ?>jsPlumb/app.css">
		<link rel="stylesheet" href="<?= BROWSER_CSS; ?>jsPlumbOverride.css">


		<link rel="stylesheet" href="<?= BROWSER_CSS; ?>controls.css" type="text/css" />
		<link rel="stylesheet" href="<?= BROWSER_CSS; ?>modal.css" type="text/css" />
		
		<?php
			// php defines in JS
			require_once(SERVER_INCLUDES."phpDefinesToJs.php");
		?>

		<script type="text/javascript" src="scripts/jquery/2.2.1/jquery.min.js"></script>
		<script src="scripts/jquery-ui/1.11.4/jquery-ui.js"></script>
		
		<script type="text/javascript" src="<?= BROWSER_SCRIPTS; ?>modal.js"></script>
		<script type="text/javascript" src="<?= BROWSER_SCRIPTS; ?>editor.js"></script>
        <script src="<?= BROWSER_JS; ?>jsPlumb/jsPlumb-2.2.8.js"></script>
		

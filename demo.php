<?php
	require_once('init.php');
?>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width">
        <link rel="shortcut icon" href="/img/favicon.ico">
        <title>jsPlumb Toolkit</title>
        <link href="//fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">
        <link rel="stylesheet" href="<?= BROWSER_CSS; ?>jsPlumb/jsPlumbToolkit-defaults.css">
		<link rel="stylesheet" href="<?= BROWSER_CSS; ?>jsPlumb/jsPlumbToolkit-demo.css">
		<link rel="stylesheet" href="<?= BROWSER_CSS; ?>jsPlumb/app.css">
    </head>

    <body>
		<div class="jtk-demo-main">
			<!-- demo -->
            <div class="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan" id="canvas">
                <div class="window jtk-node" id="flowchartWindow1"><strong>1</strong><br/><br/></div>
                <div class="window jtk-node" id="flowchartWindow2"><strong>2</strong><br/><br/></div>
                <div class="window jtk-node" id="flowchartWindow3"><strong>3</strong><br/><br/></div>
                <div class="window jtk-node" id="flowchartWindow4"><strong>4</strong><br/><br/></div>
            </div>
            <!-- /demo -->
		</div>
		<div class="full-width-container bg-sepia">
			<div class="container"></div>
		</div>
        <div class="clear-footer"></div>

        <script src="<?= BROWSER_JS; ?>jsPlumb/jsPlumb-2.2.8.js"></script>
        <script src="<?= BROWSER_JS; ?>jsPlumb/app.js"></script>
    </body>

</html>
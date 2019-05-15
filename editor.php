<?php
	require_once('init.php');
	
	// delete session data
	/*
	$status = adminClass::isUserLoggedIn();
	if($status === FALSE) {
		header('location: index.php');
	}
	
	$userRow = adminClass::getUserRowFromSession();
	$userName = $userRow['UserFirstName'] . " " . $userRow['UserLastName'];
	*/
	// get scenario list
	$scenarioList = scandir(SERVER_SCENARIOS);
	$scenarioContent = '';
	foreach($scenarioList as $key => $scenario) {
		if(is_dir(SERVER_SCENARIOS . $scenario) === TRUE) {
			continue;
		}
		
		// open file, create scenario dropdown
		$scenarioFileArray = pathinfo(SERVER_SCENARIOS . $scenario);
		$scenarioHeader = scenarioXML::getScenarioHeaderArray($scenarioFileArray['filename']);
		$scenarioContent .= '
			<option value="' . $scenarioFileArray['filename'] . '">';
		if ( isset($scenarioHeader['title']['name'] ) && strlen($scenarioHeader['title']['name']) > 0 ) {
			$scenarioContent .= $scenarioHeader['title']['name'];
		} else {
			$scenarioContent .= $scenarioFileArray['filename'];
		}
		$scenarioContent .= '</option>
		';
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript">
			var categories = new Object;
		</script>
		<?php require_once(SERVER_INCLUDES . "header.php"); ?>
		
		<script type="text/javascript">
			$(document).ready(function() {
				categories = {
					'ABC': {
						'defib': {
							'title': 'Defib',
							'priority': 1
						}
					},
					'Injected Drugs': {
						'drug-1': {
							'title': 'Inject Epinephrene',
							'priority': 0
						},
						'drug-2': {
							'title': 'Inject Vasopressin',
							'priority': 1
						}
					}
				};
				var test = 'Injected Drugs';
				var test2 = 'drug-4'
				categories[test][test2] = {
							'title': 'Drug 4',
							'priority': 1
						};

						
						
console.log(Object.keys(categories['ABC']).length);

Object.entries(categories).forEach(
    ([key, value]) => console.log(key)
)
			});
		</script>
        <script src="<?= BROWSER_JS; ?>scene.js"></script>
		
	</head>
	<body>
		<div id="sitewrapper">
			<div id="admin-nav">
				<h1>Cornell Vet School Scenario Editor</h1>
				<h1 class="welcome-title">Welcome <?= $userName; ?></h1>

				<ul id="main-nav">
					<li>
						<a href="javascript:void(2);" onclick="scene.addNextScene();">Add Scene</a>
					</li>
					<li>
						<a href="javascript:void(2);" onclick="scene.deleteAllConnections();">Delete All Connections</a>
					</li>
					<li>
						<a href="javascript:void(2);" onclick="modal.editEvents();">Edit Events</a>
					</li>

					<li class="logout">
						Version: <?= VERSION_MAJOR . '.' . VERSION_MINOR; ?>						
					</li>
					<li class="logout">
						<a href="index.php" class="event-link">Logout</a>						
					</li>
					<li class="logout">
						<a href="<?= BROWSER_II_REDIRECT; ?>" class="event-link">Instructor Interface</a>						
					</li>					
				</ul>
			</div>
			<div class="jtk-demo-main">
				<!-- demo -->
				<div class="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan" id="canvas">
				</div>
				<!-- /demo -->
			</div>
			

			<div class="clearer"></div>
		</div> <!-- sitewrapper -->
		
		<!-- Modal -->
		<div id="modal">
			<div class="container">
				<div id="modal-content">
				</div>
				<a class="close_modal" href="javascript: void(2);">
					<img src="<?= BROWSER_IMAGES; ?>x.png" alt="Close Modal">
				</a>
			</div>
		</div>
		<div id="test-params" style="height: 200px; width: 200px; background-color: #AEAEAE; z-index: 5000">
			test
		</div>
	</body>
</html>
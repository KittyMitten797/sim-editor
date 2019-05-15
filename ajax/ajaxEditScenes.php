<?php
	require_once("../init.php");
	$returnVal = array();


	$select = array();
	// CARDIAC
	$select['rhythm'] = array("sinus","afib","vfib","vtach1","vtach2","ront","asystole");
	$select['vpc'] = array("none", "1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1", "3-2", "3-3");
	$select['pea'] = array("1", "0");
	$select['vpc_freq'] = array("0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100");
	$select['vfib_amplitude'] = array("low", "medium", "high");
	$select['rate'] = 300; 
	$select['nibp_rate'] = 300;
	$select['bps_sys'] = 300;
	$select['bps_dia'] = 290;
	$select['pulse_strength'] = array("none", "weak", "medium", "strong");
	$select['heart_sound_volume'] = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
	$select['heart_sound'] = array("normal", "systolic_murmur", "pansystolic_murmur", "holosystolic_murmur", "continuous_murmur", "diastolic_murmur", "gallop");
	$select['ecg_indicator'] = array("0", "1");
	// RESPIRATION
	$select['left_lung_sound'] = array("normal", "coarse_crackles", "fine_crackles", "wheezes", "stridor", "stertor", "same_as_right");
	$select['left_lung_sound_volume'] = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
	$select['right_lung_sound'] = array("normal", "coarse_crackles", "fine_crackles", "wheezes", "stridor", "stertor");
	$select['right_lung_sound_volume'] = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
	$select['spo2'] = 100;
	$select['etco2'] = 150;
	$select['etco2_indicator'] = array("0", "1");
	$select['spo2_indicator'] = array("0", "1");
	$select['chest_movement'] = array("0", "1");
	// GENERAL
	$select['temperature'] = 1100;


	$jsonCategories = dbClass::valuesFromPost('data');
	$paramList = json_decode(str_replace('\\', '', $jsonCategories), TRUE);
	$sceneTitle = dbClass::valuesFromPost('title');
	$sceneTitle = str_replace('\\', '', $sceneTitle);
	//var_dump($paramList);
	// generate edit scene table
	$content = '
		<h1 id="modal-title">Edit Scene Parameters</h1>

		<div class="control-modal-div height-auto clearer width-auto">
			<table class="edit-event">
				<tr><th colspan="5">Scene Title: <input type="text" class="scene-title" value="' . $sceneTitle . '" onchange="modal.updateSceneTitle(this)"></th></tr>
				<tr><th colspan="5"><hr class="modal-divider clearer" /></th></tr>
				<tr>
					<th class="col-delete"></th>
					<th class="col-category">Category</th>
					<th class="col-delete"></th>
					<th class="col-event">Parameter</th>
					<th class="col-value">Value</th>
				</tr>
				<tr><th colspan="5"><hr class="modal-divider clearer" /></th></tr>
	';
	
	
	// Get initial values of parameters
	if(count($paramList) > 0) {
		foreach ($paramList as $category => $param) {
			$content .= '
				<tr>
					<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteSceneCat(\'' .  $category . '\')"><img src="' . BROWSER_IMAGES . 'delete.png"></a></td>
					<td class="col-category"><input class="data-category" type="text" data-cat="' . $category . '" value="' . $category . '"></td>
					<td class="col-delete"></td>
					<td class="col-event"></td>
					<td class="col-value"></td>
				</tr>			
			';
			if(count($param) > 0) {			
				foreach ($param as $key => $value) {
					if (!isset($select[$key])) {
						$valueInput = '<input class="data-event" type="text" onchange="modal.updateSceneValue(this)" data-cat="' . $category . '" data-event-tag="' . $key . '" value="' . $value . '">';
					} elseif (is_array($select[$key])) {
						$selectValue = '';
						for ($i=0; $i < count($select[$key]); $i++) {
							if ($select[$key][$i] == $value) {
							 	$selectValue .= '<option value="'.$select[$key][$i].'" selected>'.$select[$key][$i].'</option>';
							} else {
								$selectValue .= '<option value="'.$select[$key][$i].'">'.$select[$key][$i].'</option>';
							}
						}
						$valueInput = '<select class="data-event" data-cat="' . $category . '" data-event-tag="' . $key . '" onchange="modal.updateSceneValue(this)">' . $selectValue . '</select>';
					} elseif (is_int($select[$key])) {
						$valueInput = '<input class="data-event" type="number" onchange="modal.updateSceneValue(this)" data-cat="' . $category . '" data-event-tag="' . $key . '" min="0" max="'.$select[$key][$i].'" value="' . $value . '">';
					}					
					$content .= '
						<tr>
							<td class="col-delete"></d>
							<td class="col-category"></td>
							<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteSceneEvent(\'' .  $category . '\', \'' . $key . '\')"><img src="' . BROWSER_IMAGES . 'delete.png"></a></td>
							<td class="col-event"><input class="data-event" type="text" onchange="modal.updateSceneEvent(this)" data-cat="' . $category . '" data-event-tag="' . $key . '" value="' . $key . '"></td>
							<td class="col-value">' . $valueInput . '</td>
						</tr>
					';
				}
			}
			
			// add new parameter
			$content .= '
				<tr><td colspan="5"><button class="red-button modal-button" data-cat="' . $category . '" onclick="modal.addSceneParam(this)">Add Parameter</button></td></tr>
				<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>
			';			
		}
	}
	$content .= '
			</table>
		</div>		

		<div class="control-modal-div">
			<button class="red-button modal-button add-cat">Add Category</button>
			<button class="red-button modal-button edit-done">Save</button>
		</div>
	';

	$returnVal['status'] = AJAX_STATUS_OK;
	$returnVal['html'] = $content;
	echo json_encode($returnVal);
	exit();

?>
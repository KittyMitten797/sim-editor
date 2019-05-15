<?php

	// init
	require_once("../init.php");
	$returnVal = array();
	// is user logged in
	/*
	if(adminClass::isUserLoggedIn() === FALSE) {
		$returnVal['status'] = AJAX_STATUS_LOGIN_FAIL;
		echo json_encode($returnVal);
		exit();
	}
	*/

	$jsonEvents = dbClass::valuesFromPost('events');
	$categories = json_decode(str_replace('\\', '', $jsonEvents), TRUE);
	$jsonTriggers = dbClass::valuesFromPost('t');
	$triggerList = json_decode(str_replace('\\', '', $jsonTriggers), TRUE);
	/*
	$jsonTimeout = dbClass::valuesFromPost('timeout');
	$timeout = json_decode(str_replace('\\', '', $jsonTimeout), TRUE);
	$jsonCpr = dbClass::valuesFromPost('cpr');
	$cpr = json_decode(str_replace('\\', '', $jsonCpr), TRUE);
	*/
	//var_dump($triggerList);
	$cat = $categories['category'];
	# keep track of whether the events are used as trigger
	if(count($cat) > 0) { foreach ($cat as &$ctgr) {
		if(count($ctgr['event']) > 0) { foreach ($ctgr['event'] as &$ev) {	
			$ev['used'] = 0;
			if(count($triggerList['event']) > 0) {
				foreach($triggerList['event'] as &$tg) {
					if( isset($tg['event_id']) 
					 && $tg['event_id'] == $ev['id']) {
						$ev['used'] = 1;
						$tg['category'] = $ctgr['name'];
					}
				}

			}
		}}
	}}

	# generate trigger edit table
	$content = '
		<h1 id="modal-title">Edit Scene Triggers</h1>

		<div class="control-modal-div height-auto clearer width-auto">
			<table class="edit-trigger">
				<tr>
					<th class="col-delete"></th>
					<th class="col-category">Category</th>
					<th class="col-event">Event</th>
					<th class="col-priority">Value</th>
				</tr>
				<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>
	';
	$trgrOld = '';
	$trgrNew = '';
	//print_r($cat);
	if(count($triggerList['event']) > 0) {
		foreach($triggerList['event'] as &$trgr) {
			if(isset($trgr['category'])) {
				if(count($cat) > 0) { for($i = 0; $i < count($cat); $i++) {
					$c = $cat[$i];
					if($trgr['category'] == $c['name'] && $trgr['used'] == 1) {
					# existing triggers
						if(count($c['event']) > 0) { 
							foreach($c['event'] as $e) {
								if($e['id'] == $trgr['event_id']) {
									$trgrOld .= '
									<tr class="trigger-select">
										<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteTrigger(this)"><img src="' . BROWSER_IMAGES . 'delete.png"></a></th>
										<td class="col-category">'.$c['title'].'</th>
										<td class="col-event"><button type="button" value="' . $e['id'] . '" style="all:unset">'.$e['title'].'</button></th>
										<td class="col-priority"></th>
									</tr>
									<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>		
									';				
								}
							}
						}
					} elseif($trgr['category'] == $c['name'] && $trgr['used'] == 2) {
					# triggers under modification
						$selectCat1 = '';
						$selectEv1 = '';
						$currentEv = '';
						for($i = 0; $i < count($cat); $i++) {
							$category = $cat[$i];
							if($trgr['category'] == $category['name']) {
								$selectCat1 .= '
								<option class="data-category" data-cat="' . $category['name'] . '" value="' . $category['name'] . '" selected>' . $category['title'] . '</option>
								';
							} else {
								$selectCat1 .= '
								<option class="data-category" data-cat="' . $category['name'] . '" value="' . $category['name'] . '">' . $category['title'] . '</option>
								';
							}
						}
						if(!isset($triggerList['cpr'])
						 || count($triggerList['cpr']) == 0) {
							$selectCat1 .= '
								<option class="data-category" data-cat="cpr" value="cpr">CPR</option>
							';
						}
						if(!isset($triggerList['timeout'])
						 || count($triggerList['timeout']) == 0) {
							$selectCat1 .= '
								<option class="data-category" data-cat="timeout" value="timeout">Timeout</option>
							';
						}
						if(count($c['event']) > 0) { 
							foreach($c['event'] as $e) {
								if($trgr['event_id'] == $e['id']) {
									$selectEv1 .= '<option class="data-event" data-cat="' . $c['name'] . '" data-event-tag="' . $e['id'] . '" value="' . $e['id'] . '" selected>' . $e['title'] . '</option>'; 
									$currentEv = $e['id'];
								} elseif($e['used'] == 1) {
									$selectEv1 .= '<option class="data-event" data-cat="' . $c['name'] . '" data-event-tag="' . $e['id'] . '" value="' . $e['id'] . '" disabled>' . $e['title'] . '</option>'; 
								} else {
									$selectEv1 .= '<option class="data-event" data-cat="' . $c['name'] . '" data-event-tag="' . $e['id'] . '" value="' . $e['id'] . '">' . $e['title'] . '</option>'; 
									if(!isset($trgr['event_id'])) {
										$trgr['event_id'] = $e['id'];
									}
								}
							}
						}
						$trgrNew .= '
						<tr class="trigger-select">
							<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteTrigger(this)"><img src="' . BROWSER_IMAGES . 'delete.png"></a></td>
							<td class="col-category"><select onchange="modal.switchCat(this)">' . $selectCat1 . '</select></td>
							<td class="col-event"><select data-event-tag="' . $currentEv . '" onchange="modal.switchEv(this)">' . $selectEv1 . '</select></td>
							<td class="col-priority"></td>
						</tr>
						<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>
						';
					}
				}}				
			}					
		}
	}
	# cpr under modification
	if( count($triggerList['cpr']) > 0 
	 && ($triggerList['cpr']['used'] == 2)) {
	 	$selectCat = '';
	    $selectEv = '';
		for($i = 0; $i < count($cat); $i++) {
			$category = $cat[$i];
			$selectCat .= '
				<option class="data-category" data-cat="' . $category['name'] . '" value="' . $category['name'] . '">' . $category['title'] . '</option>
			';
		}
		$selectCat .= '
				<option class="data-category" data-cat="cpr" value="cpr" selected>CPR</option>
		';
		if(!isset($triggerList['timeout'])
		 || count($triggerList['timeout']) == 0) {
			$selectCat .= '
				<option class="data-category" data-cat="timeout" value="timeout">Timeout</option>
			';
		}
		$selectEv .= '<option class="data-event" data-cat="cpr" data-event-tag="cpr" value="cpr">CPR</option>';
		$cprDefault = (isset($triggerList['cpr']['duration']))? $triggerList['cpr']['duration'] : '60';
		$trgrNew .= '
		<tr class="trigger-select">
			<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteTrigger(this)"><img src="' . BROWSER_IMAGES . 'delete.png"></a></td>
			<td class="col-category"><select onchange="modal.switchCat(this)">' . $selectCat . '</select></td>
			<td class="col-event"><select>' . $selectEv . '</select></td>
			<td class="col-priority"><input class="data-event" type="text" data-cat="cpr" data-event="cpr" onchange="modal.updateCpr(this)" value="'. $cprDefault .'"></td>
		</tr>
		<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>
		';		
	}
	# timeout under modification
	if( count($triggerList['timeout']) > 0 
	 && ($triggerList['timeout']['used'] == 2)) {
	 	$selectCat = '';
	    $selectEv = '';
		for($i = 0; $i < count($cat); $i++) {
			$category = $cat[$i];
			$selectCat .= '
				<option class="data-category" data-cat="' . $category['name'] . '" value="' . $category['name'] . '">' . $category['title'] . '</option>
			';
		}
		$selectCat .= '
				<option class="data-category" data-cat="timeout" value="timeout" selected>Timeout</option>
		';
		if(!isset($triggerList['cpr'])
		 || count($triggerList['cpr']) == 0) {
			$selectCat .= '
				<option class="data-category" data-cat="cpr" value="cpr">CPR</option>
			';
		}
		$selectEv .= '<option class="data-event" data-cat="timeout" data-event-tag="timeout" value="timeout">Timeout</option>';
		$timeoutDefault	= (isset($triggerList['timeout']['timeout_value']))? $triggerList['timeout']['timeout_value'] : '15';
		$trgrNew .= '
		<tr class="trigger-select">
			<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteTrigger(this)"><img src="' . BROWSER_IMAGES . 'delete.png"></a></td>
			<td class="col-category"><select onchange="modal.switchCat(this)">' . $selectCat . '</select></td>
			<td class="col-event"><select>' . $selectEv . '</select></td>
			<td class="col-priority"><input class="data-event" type="text" data-cat="timeout" data-event="timeout" onchange="modal.updateTimeout(this)" value="'. $timeoutDefault .'"></td>
		</tr>
		<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>
		';	
	}
	# existng cpr or timeout
	if( count($triggerList['cpr']) > 0 
	 && ($triggerList['cpr']['used'] == 1)) {
		$content .= '
		<tr class="trigger-select">
			<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteTrigger(this)"><img src="' . BROWSER_IMAGES . 'delete.png"></a></th>
			<td class="col-category">CPR</th>
			<td class="col-event"><button type="button" value="cpr" style="all:unset">CPR</button></th>
			<td class="col-priority"><input class="data-event" type="text" data-cat="timeout" data-event="timeout" onchange="modal.updateCpr(this)" value="'.$triggerList['cpr']['duration'].'"></th>
		</tr>
		<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>		
		';
	}
	if( count($triggerList['timeout']) > 0 
	 && ($triggerList['timeout']['used'] == 1)) {
		$content .= '
		<tr class="trigger-select">
			<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteTrigger(this)"><img src="' . BROWSER_IMAGES . 'delete.png"></a></th>
			<td class="col-category">Timeout</th>
			<td class="col-event"><button type="button" value="timeout" style="all:unset">Timeout</button></th>
			<td class="col-priority"><input class="data-event" type="text" data-cat="timeout" data-event="timeout" onchange="modal.updateTimeout(this)" value="'.$triggerList['timeout']['timeout_value'].'"></th>
		</tr>
		<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>	
		';
	}
	$content .= $trgrOld;
	$content .= $trgrNew;

	# adding one new trigger when "Add Trigger" button clicked
	if ($triggerList['add'] == 1) {
		$triggerList['add'] = 0;
		$catOption = '';
		$eventOption = '';
		$currentEv = '';
		$newt = array('type' => 'event', 'used' => 2);
		if(count($cat) > 0) { 
			for($i = 0; $i < count($cat); $i++) {
				$c = $cat[$i];
				$catOption .= '
					<option class="data-category" data-cat="' . $c['name'] . '" value="' . $c['name'] . '">' . $c['title'] . '</option>
					';
				if(count($c['event']) > 0 && $i == 0) { 
					foreach($c['event'] as $e) {
						if($e['used'] == 0) {
							$eventOption .= '
							<option class="data-event" data-cat="' . $c['name'] . '" data-event-tag="' . $e['id'] . '" value="' . $e['id'] . '">' . $e['title'] . '</option>';
							if($currentEv == '') { $currentEv = $e['id']; }
							if(!isset($newt['event_id'])) {
								$newt['category'] = $c['name'];
								$newt['event_id'] = $e['id'];
							}
						} else {
							$eventOption .= '
							<option class="data-event" data-cat="' . $c['name'] . '" data-event-tag="' . $e['id'] . '" value="' . $e['id'] . '" disabled>' . $e['title'] . '</option>';
						}
					}

				}		
			}	
		}
		# add the new trigger to the array
		array_push($triggerList['event'], $newt);	

		if(!isset($triggerList['cpr'])
		 || count($triggerList['cpr']) == 0) {
			$catOption .= '
				<option class="data-category" data-cat="cpr" value="cpr">CPR</option>
			';
		}
		if(!isset($triggerList['timeout'])
		 || count($triggerList['timeout']) == 0) {
			$catOption .= '
				<option class="data-category" data-cat="timeout" value="timeout">Timeout</option>
			';
		}
		$content .= '
			<tr class="trigger-select">
				<td class="col-delete"><a href="javascript: void(2);" onclick="modal.deleteTrigger(this)"><img src="' . BROWSER_IMAGES . 'delete.png"></a></td>
				<td class="col-category"><select onchange="modal.switchCat(this)">' . $catOption . '</select></td>
				<td class="col-event"><select data-event-tag="' . $currentEv . '" onchange="modal.switchEv(this)">' . $eventOption . '</select></td>
				<td class="col-priority"></td>
			</tr>
			<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>		
		';
	}
	if ($triggerList['add'] == 0 
		&& count($triggerList['cpr']) == 0 
		&& count($triggerList['timeout']) == 0
		&& count($triggerList['event']) == 0) {
		$content .= '
		<tr><td colspan="5"> No Record </td></tr>
		<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>
		';
	}

	$content .= '
			</table>
		</div>		

		<div class="control-modal-div">
			<button class="red-button modal-button cancel">Cancel</button>
			<button class="red-button modal-button" id="add-trigger">Add Trigger</button>
			<button class="red-button modal-button edit-done">Save</button>
		</div>
	';

	$returnVal['status'] = AJAX_STATUS_OK;
	$returnVal['html'] = $content;
	$returnVal['tlist'] = $triggerList;
	echo json_encode($returnVal);
	exit();


?>
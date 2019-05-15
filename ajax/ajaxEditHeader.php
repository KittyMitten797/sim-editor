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

	$jsonHeader = dbClass::valuesFromPost('data');
	$header = json_decode(str_replace('\\', '', $jsonHeader), TRUE);
	$content = '
		<h1 id="modal-title">Edit Scenario Basic Information</h1>
		<div style="margin-bottom: 10px"> Scenario Title:
			<input type="text" class="scenario-name" onchange="modal.updateHeader(this)" value="' . $header['name'] . '">
		</div>
		<div style="margin-bottom: 10px"> Author:
			<input type="text" class="scenario-author" onchange="modal.updateHeader(this)" value="' . $header['author'] . '">
		</div>
		<div class="control-modal-div">
			<button class="red-button modal-button cancel">Cancel</button>
			<button class="red-button modal-button edit-done">Save</button>
		</div>
	';
	$returnVal['status'] = AJAX_STATUS_OK;
	$returnVal['html'] = $content;
	echo json_encode($returnVal);
	exit();

?>
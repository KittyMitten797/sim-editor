<?php
	require_once("../init.php");
	$returnVal = array();
	// $jsonContent = dbClass::valuesFromPost('data');
	// $xmlContent = json_decode(str_replace('\\', '', $jsonContent), TRUE);
	$xmlContent = dbClass::valuesFromPost('data');
	$time = date("YmdHis");
	$filename = "scenario" . $time . ".xml";
	if (!$fp = fopen( SERVER_SCENARIOS . $filename, 'w')) {
		$returnVal['status'] = AJAX_STATUS_FAIL;
		echo json_encode($returnVal);
		exit;
	}
	if (fwrite($fp, $xmlContent) === FALSE) {
		$returnVal['status'] = AJAX_STATUS_FAIL;
		echo json_encode($returnVal);
		exit;
	}
	$content = '<h1 id="modal-title">View XML File</h1>
				<a href="../scenarios/'. $filename .'" download>
					<button class="red-button modal-button">Download File</button>
					'. $filename .'
				</a>
				<textarea readonly style="font-size:14px" rows="30" cols="80">'. $xmlContent .'</textarea>
	';
	fclose($fp);
	$returnVal['status'] = AJAX_STATUS_OK;
	$returnVal['html'] = $content;
	echo json_encode($returnVal);
	exit();
?>
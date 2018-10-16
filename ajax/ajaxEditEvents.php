<?php

	// init
	require_once("../init.php");
	$returnVal = array();

	// is user logged in
	if(adminClass::isUserLoggedIn() === FALSE) {
		$returnVal['status'] = AJAX_STATUS_LOGIN_FAIL;
		echo json_encode($returnVal);
		exit();
	}
	
	$jsonCategories = dbClass::valuesFromPost('e');
	$categories = json_decode(str_replace('\\', '', $jsonCategories), TRUE);
	
	// generate edit event table
	$content = '
		<h1 id="modal-title">Edit Categories and Events</h1>

		<div class="control-modal-div height-auto clearer width-auto">
			<table class="edit-event">
				<tr>
					<th class="col-delete"></th>
					<th class="col-category">Category</th>
					<th class="col-delete"></th>
					<th class="col-event">Event</th>
					<th class="col-priority">Priority</th>
				</tr>
				<tr><th colspan="5"><hr class="modal-divider clearer" /></th></tr>
				<tr>
					<td class="col-delete"></td>
					<td class="col-category"><input class="data-category new" type="text" data-cat="" value="" placeholder="Add new category"></td>
					<td class="col-delete"></td>
					<td class="col-event"></td>
					<td class="col-priority"></td>
				</tr>
				<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>
	';
	
	// get categories
	if(count($categories) > 0) {
		foreach($categories as $category => $events) {
			$content .= '
				<tr>
					<td class="col-delete"><a href="javascript: void(2);" onclick="editor.deleteCategory(\'' . $category . '\'); return false;"><img src="' . BROWSER_IMAGES . 'delete.png"></a></td>
					<td class="col-category"><input class="data-category" type="text" data-cat="' . $category . '" value="' . $category . '"></td>
					<td class="col-delete"></td>
					<td class="col-event"></td>
					<td class="col-priority"></td>
				</tr>
			
			';
			
			// get events
			if(count($events) > 0) {
				foreach($events as $event => $metaData) {
					$checkedContent = ($metaData['priority'] == 1) ? ' checked="checked" ' : '';
					
					$content .= '
						<tr>
							<td class="col-delete"></d>
							<td class="col-category"></td>
							<td class="col-delete"><a href="javascript: void(2);" onclick="editor.deleteEvent(\'' .  $category . '\', \'' . $event . '\'); return false;"><img src="' . BROWSER_IMAGES . 'delete.png"></a></td>
							<td class="col-event"><input class="data-event" type="text" data-cat="' . $category . '" data-event-tag="' . $event . '" value="' . $metaData['title'] . '"></td>
							<td class="col-priority"><input type="checkbox" data-cat="' . $category . '" data-event-tag="' . $event . '"' . $checkedContent . '></td>
						</tr>
					';
				}
			}
			
			// add new event
			$content .= '
				<tr>
					<td class="col-delete"></td>
					<td class="col-category"></td>
					<td class="col-delete"></td>
					<td class="col-event"><input class="data-event new-event" type="text" data-cat="' . $category . '" data-event="" value="" placeholder="Add new event"></td>
					<td class="col-priority"></td>
				</tr>
				<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>
			';
		
		}
	}

	$content .= '
			</table>
		</div>		

		<div class="control-modal-div">
			<button class="red-button modal-button edit-done">Done</button>
		</div>
	';

	$returnVal['status'] = AJAX_STATUS_OK;
	$returnVal['html'] = $content;
	echo json_encode($returnVal);
	exit();


?>
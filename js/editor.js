	var editor = {
		deleteEvent: function(category, eventTag) {
			if(typeof category == 'undefined' || typeof eventTag == 'undefined') {
				return;
			}
			
			if(typeof categories[category][eventTag] == 'undefined') {
				return;
			}
			
			// delete item
			if(confirm('Warning message will be displayed if event is used in any scene!\n\rClick "OK" to delete event.  Click "Cancel" to cancel.') == true) {
				delete categories[category][eventTag];
				
				// refresh modal
				$('#modal-content').empty();
				modal.editEvents();
			}
		},
		
		deleteCategory: function(category) {
			// validate
			if(typeof category == 'undefined') {
				return;
			}
			
			if(typeof categories[category] == 'undefined') {
				return;
			}
			
			if(Object.keys(categories[category]).length != 0) {
				alert("Please delete all events before deleting category.");
				return;
			}
			
			// delete item
			delete categories[category];

			// refresh modal
			$('#modal-content').empty();
			modal.editEvents();
		},

		deleteSceneParam: function(category, param) {
			if(typeof category == 'undefined' || typeof param == 'undefined') {
				return;
			}
			
			if(typeof init[category][param] == 'undefined') {
				return;
			}
			
			// delete item
			if(confirm('Warning message will be displayed if parameter is used in any scene!\n\rClick "OK" to delete event.  Click "Cancel" to cancel.') == true) {
				delete init[category][param];
				
				// refresh modal
				$('#modal-content').empty();
				modal.editScenes();
			}
		},
		
		
	}
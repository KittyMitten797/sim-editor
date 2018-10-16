	var modal = {
		imgTop: '50px',
		imgPadding: '0px',
		
		textTop: '200px',
		textPadding: '20px',
		textWidth: 300,
		
		fadeDelay: 200,
		
		defaultControlWidth: 400,
		
		showText: function(content, text_align) {
			if(typeof text_align == 'undefined') {
				text_align = 'center';
			} else {
				switch(text_align) {
					case 'left':
					case 'center':
						break;
					default:
						text_align = 'center';
						break;
				}
			}
			$('#modal #modal-content').append(content);
			$('#modal .container').width(modal.textWidth);
			$('#modal .container').css({
										'height': 'auto',
										'padding': modal.textPadding,
										'text-align': text_align,
										'top': modal.textTop
			});
			$('#modal').css('position', 'fixed').fadeIn(modal.fadeDelay);
			modal.bindCloseModal();
		},
		
		editEvents: function() {
			$.ajax({
				url: BROWSER_AJAX + 'ajaxEditEvents.php',
				type: 'post',
				async: false,
				data: {e: JSON.stringify(categories)},
				dataType: 'json',
				success: function(response) {
					if(response.status == AJAX_STATUS_OK) {
						modal.showModal(response);
						$('#modal .container').css({
													'top': '50px',
													'width': '400px'
						});
						
						modal.bindCloseModal();
						
						// bind events
						$('td.col-priority input').click(function() {
							var checkedEventCategory = $(this).attr('data-cat');
							var checkedEventTag = $(this).attr('data-event-tag');
							
							if($(this).is(':checked') == true) {
								categories[checkedEventCategory][checkedEventTag].priority = 1;
							} else {
								categories[checkedEventCategory][checkedEventTag].priority = 0;							
							}
							
							$('#modal-content').empty();
							modal.editEvents();
						});	

						$('td.col-event input').change(function() {
							var checkedEventCategory = $(this).attr('data-cat');
							var checkedEventTag = $(this).attr('data-event-tag');
							
							// validate
							// existing input
							if($(this).hasClass('new-event') == false) {
								if($(this).val() == '') {
									alert('Invalid Input!');
								} else {
									categories[checkedEventCategory][checkedEventTag].title = $(this).val();
									$('#modal-content').empty();
									modal.editEvents();
								}							
							} else {
								// new input, create new event tag with unique timestamp
								// strip out all non letter characters
								var timeStamp = new Date().getTime();
								checkedEventTag = $(this).val().replace(/[^A-Za-z]/g, "") + '-' + timeStamp;
								categories[checkedEventCategory][checkedEventTag] = new Object;
								categories[checkedEventCategory][checkedEventTag]['title'] = $(this).val();
								categories[checkedEventCategory][checkedEventTag].priority = 0;
								$('#modal-content').empty();
								modal.editEvents();
							}
						});
						
						$('td.col-category input').change(function() {
							var currentCategory = $(this).attr('data-cat');
							
							// validate
							// existing input
							if($(this).hasClass('new') == false) {
								if($(this).val() == '') {
									alert('Invalid Input!');
								} else {
									categories[$(this).val()] = new Object;
									categories[$(this).val()] = categories[currentCategory];
									delete categories[currentCategory];
									$('#modal-content').empty();
									modal.editEvents();
								}							
							} else {
								// new input
								if($(this).val() == '') {
									alert('Invalid Input!');
								} else {
									categories[$(this).val()] = new Object;
									$('#modal-content').empty();
									modal.editEvents();
								}
							}
						});
						
						$('button.edit-done').click(function() {
							modal.closeModal();
						});
					}
				}
			});
		},
		
		/********************* Utils for modals *******************/

		bindCloseModalAudio: function() {
			$('a.close_modal, button.cancel').click(function() {
				controls.vocals.audio.loop = false;
				controls.vocals.repeat = false;
				controls.vocals.audio.load();				
				modal.closeModal();
			});
		},
		
		bindCloseModal: function() {
			$('a.close_modal, button.cancel').click(modal.closeModal);
		},
		
		showModal: function(response) {
			$('#modal-content').html(response.html);
			$('#modal').css('position', 'fixed').fadeIn(modal.fadeDelay);
			$('#modal .container').css('height', 'auto');
		},
		
		ajaxWait: function() {
			$('#modal .close_modal').hide();
			$('#modal #modal-content').append('<img class="image_modal modal_content" src="' + BROWSER_THEME_IMAGES + 'ajax_loader.gif" alt="Product Image">');
			$('#modal .container').width(modal.textWidth);
			$('#modal .container').css({
										'height': '150px',
										'padding': modal.textPadding,
										'text-align': 'center',
										'top': modal.textTop,
										'background-color': '#FFFFFF' 
			});
			$('#modal img').css('margin', 'auto');
			$('#modal').css('position', 'fixed').show();					
		},

		closeModal: function() {
			$('#modal').fadeOut(modal.fadeDelay,
				function() {
					$('#modal-content').empty();
					$('#modal .close_modal').show();
					$('#modal .container').css('width', '400px');
					$('#modal .container .control-modal-div').css('width', '345px');					
				}
			);
		},
		closeModalFast: function() {
			$('#modal').hide();
			$('#modal-content').empty();
			$('#modal .close_modal').show();
		},
	}

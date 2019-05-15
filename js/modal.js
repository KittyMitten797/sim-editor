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

showXML: function() {
	var s = new XMLSerializer();
	xmlStr = s.serializeToString(xml);
	$.ajax({
		url: BROWSER_AJAX + 'ajaxSaveXML.php',
		type: 'post',
		data: {data: xmlStr},
		dataType: 'json',
		success: function(response) {
			if(response.status == AJAX_STATUS_OK) {
				modal.showModal(response);
				$('#modal .container').css({
								'top': '50px',
								'width': '600px',
								'height': '600px'
				});
				modal.bindCloseModal();
			}
		}
	});
},

/********************* Edit Scenario Header *******************/
editHeader: function() {
	if (typeof hdInfo === 'undefined') {
		hdInfo = {};
		var headerInfo = xml.getElementsByTagName("header")[0];
		var authorNode = headerInfo.getElementsByTagName("author")[0];
		hdInfo['author'] = authorNode.childNodes[0].nodeValue;
		var scTitleNode = headerInfo.getElementsByTagName("title")[0];
		var scTitle = scTitleNode.getElementsByTagName("name")[0];
		hdInfo['name'] = scTitle.childNodes[0].nodeValue;
	}
	$.ajax({
		url: BROWSER_AJAX + 'ajaxEditHeader.php',
		type: 'post',
		data: {data: JSON.stringify(hdInfo)},
		dataType: 'json',
		success: function(response) {
			modal.showModal(response);	
			modal.bindCloseModal();
			$('button.edit-done').click(function() {
				var headerInfo = xml.getElementsByTagName("header")[0];
				var authorNode = headerInfo.getElementsByTagName("author")[0].childNodes[0];
				authorNode.nodeValue = hdInfo['author'];
				var scTitleNode = headerInfo.getElementsByTagName("title")[0];
				var scTitle = scTitleNode.getElementsByTagName("name")[0].childNodes[0];
				scTitle.nodeValue = hdInfo['name'];
				modal.closeModal();
			});			
		}
	});
},

updateHeader: function(thistag) {
	var classtype = $(thistag).attr('class');
	var newvalue = $(thistag).val();
	var patt = /^[a-zA-Z][\w\s\-]*[a-zA-Z0-9]*$/;
	if(newvalue == '' || !(patt.test(newvalue)) ) {
		alert('Invalid input!');
	}
	if (classtype == 'scenario-name') {
		hdInfo['name'] = newvalue;
		modal.editHeader();
	} else if (classtype == 'scenario-author') {
		hdInfo['author'] = newvalue;
		modal.editHeader();
	}
},


/********************* Edit Scene Parameters *******************/

editScenes: function(sceneID) {
	if (typeof param === 'undefined') {
		sceneNum = sceneID;
	}
	if (typeof param === 'undefined') {
		// param = init;
		// delete param['initial_scene'];
		// delete param['record'];
		// if (sceneID.toString() == '1') {
		// 	sceneTitle = 'Initial State';
		// } else {
		// 	var id = sceneID - 1;
		// 	sceneTitle = 'Scene ' + id;
		// }
		param = {cardiac: {}, respiration: {}, general: {}};
		scenes = xml.getElementsByTagName("scene");
		for (var i = 0; i < scenes.length; i++) {
			var idNode = scenes[i].getElementsByTagName("id")[0];
			var idTextNode = idNode.childNodes[0];
			var idText = idTextNode.nodeValue;
			if (idText.toString() == sceneID.toString()) {
				// Get scene title
				var titleNode = scenes[i].getElementsByTagName("title")[0];
				var titleTextNode = titleNode.childNodes[0];
				sceneTitle = titleTextNode.nodeValue;	
				// Get scene parameters			
				var initList = scenes[i].getElementsByTagName("init")[0];
				var cardiacNode = initList.getElementsByTagName("cardiac")[0];
				if (cardiacNode) {
					var cardiac = cardiacNode.childNodes;
					for (var i = 0; i < cardiac.length; i++) {
						if (cardiac[i].nodeType != 1) { continue;} 
						param['cardiac'][cardiac[i].nodeName] = cardiac[i].childNodes[0].nodeValue;
					}					
				}
				var respirationNode = initList.getElementsByTagName("respiration")[0];
				if (respirationNode) {
					var respiration = respirationNode.childNodes;
					for (var i = 0; i < respiration.length; i++) {
						if (respiration[i].nodeType != 1) { continue;}
						param['respiration'][respiration[i].nodeName] = respiration[i].childNodes[0].nodeValue;
					}					
				}
				var generalNode = initList.getElementsByTagName("general")[0];
				if (generalNode) {
					var general = generalNode.childNodes;
					for (var i = 0; i < general.length; i++) {
						if (general[i].nodeType != 1) { continue;}
						param['general'][general[i].nodeName] = general[i].childNodes[0].nodeValue;
					}					
				}
				
			}
		}
	}
	$.ajax({
		url: BROWSER_AJAX + 'ajaxEditScenes.php',
		type: 'post',
		data: {data: JSON.stringify(param), title: sceneTitle},
		dataType: 'json',
		success: function(response) {
			if(response.status == AJAX_STATUS_OK) {
				modal.showModal(response);
				$('#modal .container').css({
											'top': '50px',
											'width': '500px',
											'height': '600px'
				});
				
				modal.bindCloseModal();
				
				// bind scene parameters	
				$('button.add-cat').click(function() {
					var newcnt = 
						'<tr>'
							+ '<td class="col-delete"></td>'
							+ '<td class="col-category"><input class="data-category new" type="text" data-cat="" onchange="modal.updateSceneCat(this)" placeholder="Add new category"></td>'
							+ '<td class="col-delete"></td>'
							+ '<td class="col-event"></td>'
							+ '<td class="col-value"></td>'
						+ '</tr>'
						+ '<tr><td colspan="5"><button class="red-button modal-button" data-cat="" onclick="modal.addSceneParam(this)">Add Event</button></td></tr>'
						+ '<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>';
					$(this).parent().prev().children().append(newcnt);
				});

				$('button.edit-done').click(function() {
					scenes = xml.getElementsByTagName("scene");
					for (var i = 0; i < scenes.length; i++) {
						idNode = scenes[i].getElementsByTagName("id")[0];
						idTextNode = idNode.childNodes[0];
						idText = idTextNode.nodeValue;
						if (idText.toString() == sceneNum.toString()) {
							scenes[i].getElementsByTagName("title")[0].childNodes[0].nodeValue = sceneTitle;
							var initList = scenes[i].getElementsByTagName("init")[0];
							paramList = xml.createElement("init");
							for (cat in param) {
								var newCat = xml.createElement(cat);
								for (event in param[cat]) {
									var newEv = xml.createElement(event);
									var evText = xml.createTextNode(param[cat][event]);
									newEv.appendChild(evText);
									crlf1 = xml.createTextNode("\r\n\t\t\t\t");
									newCat.appendChild(crlf1);
									newCat.appendChild(newEv);
								}
								crlf2 = xml.createTextNode("\r\n\t\t\t");
								newCat.appendChild(crlf2);
								crlf3 = xml.createTextNode("\r\n\t\t\t");
								paramList.appendChild(crlf3);
								paramList.appendChild(newCat);
							}
							crlf4 = xml.createTextNode("\r\n\t\t");
							paramList.appendChild(crlf4);
							scenes[i].replaceChild(paramList, initList);
							break;
						}
					}
					delete sceneNum;
					modal.closeModal();
				});
			}
		}
	});
},

updateSceneEvent: function(thistag) {
	var currentSceneCat = $(thistag).attr('data-cat');
	var currentSceneParam = $(thistag).attr('data-event-tag');
	// existing input
	if($(thistag).hasClass('new-event') == false) {
		if($(thistag).val() == ''
			|| !(/^\w+$/.test($(thistag).val())) ) 
		{
			alert('Invalid Input!');
		} else {
			var newSceneParam = $(thistag).val().replace(/[^A-Za-z0-9_]/g, "");
			param[currentSceneCat][newSceneParam] = param[currentSceneCat][currentSceneParam];
			delete param[currentSceneCat][currentSceneParam];
			modal.editScenes();
		}							
	} else {
		// new input, strip out all non letter characters
		if($(thistag).val() == '' || !(/^\w+$/.test($(thistag).val())) ) {
			alert('Invalid Input!');
		} else {
			var newSceneParam = $(thistag).val().replace(/[^A-Za-z0-9_]+/g, "");
			param[currentSceneCat][newSceneParam] = $(thistag).parent().next().children().val().replace(/[^A-Za-z0-9_]/g, "");
			modal.editScenes();							
		}
	}	
},

updateSceneValue: function(thistag) {
	var currentSceneCat = $(thistag).attr('data-cat');
	var currentSceneParam = $(thistag).attr('data-event-tag');
	// existing input
	if($(thistag).hasClass('new-event') == false) {
		if($(thistag).val() == ''
			|| !(/^[\w\-]+$/.test($(thistag).val())) ) 
		{
			alert('Invalid Input!');
		} else if($(thistag).parent().prev().children().val() == '' || $(thistag).parent().prev().children().val() == 'Add new event') {
			alert('The name of this parameter is invalid!');
		} else {
			param[currentSceneCat][currentSceneParam] = $(thistag).val();
			modal.editScenes();
		}							
	} else {
		// new input, strip out all non letter characters
		if($(thistag).val() == '' || !(/^[\w\-]+$/.test($(thistag).val())) ) {
			alert('Invalid Input!');
		} else if($(thistag).parent().prev().children().val() == '' 
			|| $(thistag).parent().prev().children().val() == 'Add new event'
			|| !(/^[\w\-]+$/.test($(thistag).parent().prev().children().val())) ) {
			alert('The name of this parameter is invalid!');
		} else {
			currentSceneParam = $(thistag).parent().prev().children().val().replace(/[^A-Za-z0-9_\-]/g, "");
			param[currentSceneCat][currentSceneParam] = $(thistag).val();
			modal.editScenes();
		}
	}
},

updateSceneCat: function(thistag) {
	var currentCategory = $(thistag).attr('data-cat');
	if($(thistag).val() == '' || !(/^\w+$/.test($(thistag).val())) ) {
		alert('Invalid Input!');
	} else {
		// existing input
		if($(thistag).hasClass('new') == false) {
			init[$(thistag).val()] = init[currentCategory];
			delete init[currentCategory];
			modal.editScenes();									
		} else {
			// new input
			init[$(thistag).val()] = new Object;
			modal.editScenes();
		}
	}
},

updateSceneTitle: function(thistag) {
	if($(thistag).val() == '' || !(/^[a-zA-Z][\w\s]*[a-zA-Z0-9]*$/.test($(thistag).val())) ) {
		alert('Invalid Input!');
	} else {
		sceneTitle = $(thistag).val();
		modal.editScenes();
	}

},

deleteSceneEvent: function(cat, event) {
	delete param[cat][event];
	modal.editScenes();
},

deleteSceneCat: function(cat) {
	var r = confirm("Are you sure to delete the entire category?");
	if (r == true) {
		delete param[cat];
		modal.editScenes();		
	}
},

addSceneParam: function(thistag) {
	var cat = $(thistag).attr('data-cat');
	var newcnt = 
		'<tr>' 
			+ '<td class="col-delete"></td>'
			+ '<td class="col-category"></td>'
			+ '<td class="col-delete"></td>'
			+ '<td class="col-event"><input class="data-event new-event" type="text" data-cat="' + cat + '" data-event="" placeholder="Add new event" onchange="modal.updateSceneEvent(this)"></td>'
			+ '<td class="col-value"><input class="data-event new-event" type="text" onchange="modal.updateSceneValue(this)" data-cat="' + cat + '" data-event-tag=""></td>'
		+ '</tr>';
	$(thistag).parent().parent().before(newcnt);	
},

/********************* Edit Event List *******************/

editEvents: function() {
	if (typeof eventList === 'undefined') {
		eventList = {};
	}
	$.ajax({
		url: BROWSER_AJAX + 'ajaxEditEvents.php',
		type: 'post',
		data: {e: JSON.stringify(eventList)},
		dataType: 'json',
		success: function(response) {
			if(response.status == AJAX_STATUS_OK) {
				modal.showModal(response);
				$('#modal .container').css({
											'top': '50px',
											'width': '380px'
				});				
				modal.bindCloseModal();
				
				// bind events
				$('button.add-cat').click(function() {
					var newcnt = 
					'<tr>'
						+ '<td class="col-delete"></td>'
						+ '<td class="col-category"><input class="data-category new" type="text" data-cat="" placeholder="Add new category" onchange="modal.updateEventCat(this)"></td>'
						+ '<td class="col-delete"></td>'
						+ '<td class="col-event"></td>'
						+ '<td class="col-priority"></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td class="col-delete"></td>'
						+ '<td class="col-category"></td>'
						+ '<td class="col-delete"></td>'
						+ '<td class="col-event"><input class="data-event new-event" type="text" data-cat="" data-event="" value="" placeholder="Add new event" onchange="modal.updateEventName(this)"></td>'
						+ '<td class="col-priority"><input type="checkbox" disabled></td>'
					+ '</tr>'
					+ '<tr><td colspan="5"><button class="red-button modal-button" data-cat="" onclick="modal.addEvent(this)">Add Event</button></td></tr>'
					+ '<tr><td colspan="5"><hr class="modal-divider clearer" /></td></tr>';
					$(this).parent().prev().children().append(newcnt);
				});

				$('a.close_modal').click(function() {
					delete eventList;
					modal.closeModal();
				});

				$('button.edit-done').click(function() {
					var ev = xml.getElementsByTagName("events")[0];
					if (ev) {
						ev.parentNode.removeChild(ev);
					}
					var eventsNode  = xml.createElement("events");
					var initNode = xml.getElementsByTagName("init")[0];
					var scenarioNode = initNode.parentNode;
					scenarioNode.insertBefore(eventsNode, initNode);
					for (cat in eventList) {
						var cNode = xml.createElement("category");
						eventsNode.appendChild(cNode);
						var cnameNode = xml.createElement("name");
						var cnameText = xml.createTextNode(cat);
						cnameNode.appendChild(cnameText);
						cNode.appendChild(cnameNode);
						var ctitleNode = xml.createElement("title");
						var ctitleText = xml.createTextNode(eventList[cat]['title']);
						ctitleNode.appendChild(ctitleText);
						cNode.appendChild(ctitleNode);
						for (evInCat in eventList[cat]['event']) {
							var cEventNode = xml.createElement("event");
							cNode.appendChild(cEventNode);
							var cEvTitleNode = xml.createElement("title");
							var cEvTitleText = xml.createTextNode(eventList[cat]['event'][evInCat]['title']);
							cEvTitleNode.appendChild(cEvTitleText);
							cEventNode.appendChild(cEvTitleNode);
							var cEvIdNode = xml.createElement("id");
							var cEvIdText = xml.createTextNode(evInCat);
							cEvIdNode.appendChild(cEvIdText);
							cEventNode.appendChild(cEvIdNode);
							var cEvPriorityNode = xml.createElement("priority");
							var cEvPriorityText = xml.createTextNode(eventList[cat]['event'][evInCat]['priority']);
							cEvPriorityNode.appendChild(cEvPriorityText);
							cEventNode.appendChild(cEvPriorityNode);
						}
					}
					modal.closeModal();
				});
			}
		}
	});
},

addEvent: function(thistag) {
	var cat = $(thistag).attr('data-cat');
	var newcnt = '<tr>' 
			+ '<td class="col-delete"></td>'
			+ '<td class="col-category"></td>'
			+ '<td class="col-delete"></td>'
			+ '<td class="col-event"><input class="data-event new-event" type="text" data-cat="'+ cat +'" data-event="" value="" placeholder="Add new event" onchange="modal.updateEventName(this)"></td>'
			+ '<td class="col-priority"><input type="checkbox" disabled></td>'
		+ '</tr>';
	$(thistag).parent().parent().before(newcnt);
},

updateEventPriority: function(thistag) {
	var checkedEventCategory = $(thistag).attr('data-cat');
	var checkedEventTag = $(thistag).attr('data-event-tag');	
	if($(thistag).is(':checked') == true) {
		eventList[checkedEventCategory]['event'][checkedEventTag]['priority'] = 1;
	} else {
		eventList[checkedEventCategory]['event'][checkedEventTag]['priority'] = 0;							
	}
	modal.editEvents();
},

updateEventName: function(thistag) {
	var checkedEventCategory = $(thistag).attr('data-cat');
	var checkedEventTag = $(thistag).attr('data-event-tag');
	var newEventTitle = $(thistag).val();
	var patt = /^[a-zA-Z][\w\s]*[a-zA-Z0-9]*$/; // must begin with English letters and can't end with whitespace or underscore
	if(newEventTitle == '' 
		|| !(patt.test(newEventTitle)) ) {
		$(thistag).css("border-color", "#B31B1B");
		alert('Invalid event name!');
	} else {
		var newEventName = newEventTitle.toLowerCase().replace(/\s+/g, "_"); // Names only contain lowercase letters and no whitespace
		for (ev in eventList[checkedEventCategory]['event']) {
			if ($(thistag).hasClass('new-event') == false
				&& ev == checkedEventTag) {
				break;
			}
			if (eventList[checkedEventCategory]['event'][ev]['title'] == newEventTitle 
				|| ev == newEventName) {
				$(thistag).val('');
				alert('Duplicate event name!');
				return false;
			}
		}
		if($(thistag).hasClass('new-event') == false) {
			// existing input
			eventList[checkedEventCategory]['event'][newEventName] = eventList[checkedEventCategory]['event'][checkedEventTag];
			eventList[checkedEventCategory]['event'][newEventName]['title'] = newEventTitle;
			if (newEventName != checkedEventTag) {
				delete eventList[checkedEventCategory]['event'][checkedEventTag];
			}
			modal.editEvents();							
		} else {
			// new input, create new event tag with unique timestamp
			// strip out all non letter characters
			// var timeStamp = new Date().getTime();
			// checkedEventTag = $(thistag).val().replace(/[^A-Za-z]/g, "") + '-' + timeStamp;
			eventList[checkedEventCategory]['event'][newEventName] = new Object;
			eventList[checkedEventCategory]['event'][newEventName]['title'] = newEventTitle;
			eventList[checkedEventCategory]['event'][newEventName]['priority'] = 0;
			modal.editEvents();
		}
	}
},

updateEventCat: function(thistag) {
	var currentCategory = $(thistag).attr('data-cat');
	var newCatTitle = $(thistag).val();
	var patt = /^[a-zA-Z][\w\s]*[a-zA-Z0-9]*$/; // must begin with English letters and can't end with white space or underscore
	if(newCatTitle == '' 
		|| !(patt.test(newCatTitle)) ) {
		$(thistag).css("border-color", "#B31B1B");
		alert('Invalid category name!');
	} else {
		var newCatName = newCatTitle.toLowerCase().replace(/\s+/g, "_");
		for (cat in eventList) { // check for duplicate names
			if ($(thistag).hasClass('new') == false
				&& currentCategory == cat) {
				break;
			}
			if (eventList[cat]['title'] == newCatTitle 
				|| cat == newCatName) {
				$(thistag).val('');
				alert('Duplicate category name!');
				return false;
			}
		}
		if($(thistag).hasClass('new') == false) {
			// existing input
			eventList[newCatName] = eventList[currentCategory];
			eventList[newCatName]['title'] = newCatTitle;
			if (newCatName != currentCategory) {
				delete eventList[currentCategory];
			}
			$('#modal-content').empty();
			modal.editEvents();						
		} else {
			// new input
			eventList[newCatName] = new Object;			
			eventList[newCatName]['title'] = newCatTitle;
			eventList[newCatName]['event'] = new Object;
			modal.editEvents();
		}
	}
},

deleteEventCat: function(cat) {
	var r = confirm("Are you sure to delete the entire category?");
	if (r == true) {
		delete eventList[cat];
		modal.editEvents();	
	}
},

deleteEvent: function(cat, event) {
	delete eventList[cat]['event'][event];
	modal.editEvents();
},

/********************* Edit Triggers *******************/

editTriggers: function(triggerID) {	
	if (typeof tList === 'undefined'){
		// obtain source scene and target scene ID
	    tID = triggerID.split(' ');	
	    tID.splice(0,1);
	    tID.splice(1,2);
	    for (var i = 0; i < tID.length; i++) { 
	    	tID[i] = parseInt(tID[i])+1 
	    }
		// to obtain source scene from existing XML file
		scenes = xml.getElementsByTagName("scene");
		tList = {};
		eventTrgr = [];
		tList['add'] = 0;
		for (var i = 0; i < scenes.length; i++) {
			idNode = scenes[i].getElementsByTagName("id")[0];
			idTextNode = idNode.childNodes[0];
			idText = idTextNode.nodeValue;
			if (idText.toString() == tID[0].toString()) {
				// Event triggers
				triggerList = scenes[i].getElementsByTagName("trigger");
				for (var j = 0; j < triggerList.length; j++) {
					var t = triggerList[j];
					sID = t.getElementsByTagName("scene_id")[0].childNodes[0].nodeValue;
					cpr = t.getElementsByTagName("cpr");			
				    if(sID.toString() == tID[1].toString()) { 
				    	// check if this trigger is CPR
				    	if(cpr.length == 0) { 
					    	eID = t.getElementsByTagName("event_id")[0].childNodes[0].nodeValue;
					    	var newt = {
					    		type : 'event',
					    		event_id : eID,
					    		scene_id : sID,
					    		used : 1
					    	};
					    	eventTrgr.push(newt);			    		
				    	} else {
				    		var cprTrigger = {
				    			type : 'cpr',
				    			duration : t.getElementsByTagName("duration")[0].childNodes[0].nodeValue,
				    			scene_id : sID,
				    			used : 1
				    		};
				    		tList['cpr'] = cprTrigger;
				    	}
				    } 
				}
				tList['event'] = eventTrgr;
				// Timeout
				to = scenes[i].getElementsByTagName("timeout");
				//timeout = {};
				if(to.length > 0) {
					sID = to[0].getElementsByTagName("scene_id")[0].childNodes[0].nodeValue;
					if(sID.toString() == tID[1].toString()) {
						var timeout = {
							type : 'timeout',
							timeout_value : to[0].getElementsByTagName("timeout_value")[0].childNodes[0].nodeValue,
							scene_id : sID,
							used : 1
						};		
						tList['timeout'] = timeout;			
					}
				}
			}
		}		
	}
	if (typeof evList === 'undefined') {
		evList = {};
		evList['category'] = [];
		var evl = [];
		var eventsNode = xml.getElementsByTagName("events")[0];
		var cats = eventsNode.getElementsByTagName("category");
		for (var i = 0; i < cats.length; i++) {
			var cat = {}
			var name = cats[i].getElementsByTagName("name")[0];
			cat['name'] = name.childNodes[0].nodeValue;
			var title = cats[i].getElementsByTagName("title")[0];
			cat['title'] = title.childNodes[0].nodeValue;
			cat['event'] = [];
			var eventsInCat = cats[i].getElementsByTagName("event");
			for (var j = 0; j < eventsInCat.length; j++) {
				var eventObject = {};
				eventObject['title'] = eventsInCat[j].getElementsByTagName("title")[0].childNodes[0].nodeValue;
				eventObject['id'] = eventsInCat[j].getElementsByTagName("id")[0].childNodes[0].nodeValue;
				eventObject['priority'] = eventsInCat[j].getElementsByTagName("priority")[0].childNodes[0].nodeValue;
				cat['event'].push(eventObject);
			}
			evl.push(cat);
		}
		evList['category'] = evl;
	}

	$.ajax({
		url: BROWSER_AJAX + 'ajaxEditTriggers.php',
		type: 'post',
		data: {events: JSON.stringify(evList), t: JSON.stringify(tList)}, // events : events/evList
		dataType: 'json',
		success: function(response) {
			if(response.status == AJAX_STATUS_OK) {
				modal.showModal(response);
				tList = response.tlist;
				//console.log(tList['event']);
				$('#modal .container').css({
											'top': '50px',
											'width': '400px',
											'height': '400px'
				});
				$('table.edit-trigger').css({'width': '100%'});
				modal.bindCloseModal();
				
				$('#add-trigger').click(function() {
					tList['add'] = 1;
					modal.editTriggers();
				});

				$('button.edit-done').click(function() {
					// to obtain source scene from existing XML file
					scenes = xml.getElementsByTagName("scene");
					for (var i = 0; i < scenes.length; i++) {
						idNode = scenes[i].getElementsByTagName("id")[0];
						idTextNode = idNode.childNodes[0];
						idText = idTextNode.nodeValue;
						if (idText.toString() == tID[0].toString()) {
							var triggersOld = scenes[i].getElementsByTagName("triggers")[0];
							if (triggersOld) {
								// remove triggers whose target matches the current target from the old trigger list
								var trgrObj = triggersOld.getElementsByTagName("trigger");
								for (var j = trgrObj.length - 1; j >= 0; j--) {
									var sceneIdNode = trgrObj[j].getElementsByTagName("scene_id")[0];
									var sceneIdText = sceneIdNode.childNodes[0].nodeValue;
									if (sceneIdText.toString() == tID[1].toString()) {
										var rmv = trgrObj[j].parentNode.removeChild(trgrObj[j]);
									}									
								}
							} else {
								var triggersOld = xml.createElement("triggers");
								var crlf1 = xml.createTextNode("\t");
								scenes[i].appendChild(crlf1);
								scenes[i].appendChild(triggersOld);
								var crlf2 = xml.createTextNode("\r\n\t");
								scenes[i].appendChild(crlf2);
							}
							// ###### -- Event Triggers -- ###### //
							if (tList['event'].length > 0) {
								for (var k = 0; k < tList['event'].length; k++) {
									var trgr = tList['event'][k];
									var newTrigger = xml.createElement("trigger");
									var eventId = xml.createElement("event_id");
									var eIdText = xml.createTextNode(trgr['event_id']);
									eventId.appendChild(eIdText);
									newTrigger.appendChild(eventId);
									var sceneId = xml.createElement("scene_id");
									var sIdText = xml.createTextNode(tID[1]);
									sceneId.appendChild(sIdText);
									newTrigger.appendChild(sceneId);
									var crlf3 = xml.createTextNode("\r\n\t\t\t");
									triggersOld.appendChild(crlf3);
									triggersOld.appendChild(newTrigger);
								}								
							}
							// ###### -- CPR -- ###### //
							if (tList['cpr']) {
								var newCPRTrigger = xml.createElement("trigger");
								var test = xml.createElement("test");
								var testText = xml.createTextNode("GTE");
								test.appendChild(testText);
								newCPRTrigger.appendChild(test);
								var sceneId = xml.createElement("scene_id");
								var sIdText = xml.createTextNode(tID[1]);
								sceneId.appendChild(sIdText);
								newCPRTrigger.appendChild(sceneId);
								var cprNode = xml.createElement("cpr");
								var duration = xml.createElement("duration");
								var dText = xml.createTextNode(tList['cpr']['duration']);
								duration.appendChild(dText);
								cprNode.appendChild(duration);
								newCPRTrigger.appendChild(cprNode);
								var crlf4 = xml.createTextNode("\r\n\t\t\t");
								triggersOld.appendChild(crlf4);
								triggersOld.appendChild(newCPRTrigger);
							}
							// ###### -- Timeout -- ###### //
							var timeoutOld = scenes[i].getElementsByTagName("timeout")[0];
							if (timeoutOld) {
								var toutIdNode = timeoutOld.getElementsByTagName("scene_id")[0];
								var toutIdText = toutIdNode.childNodes[0].nodeValue;
								if (tList['timeout']) {
									timeoutOld.parentNode.removeChild(timeoutOld);
									newTimeout = xml.createElement("timeout");
									var crlf5 = xml.createTextNode("\t");
									scenes[i].appendChild(crlf5);
									scenes[i].appendChild(newTimeout);
									var crlf6 = xml.createTextNode("\r\n\t");
									scenes[i].appendChild(crlf6);
									var value = xml.createElement("timeout_value");
									var valueText = xml.createTextNode(tList['timeout']['timeout_value']);
									value.appendChild(valueText);
									newTimeout.appendChild(value);
									var sceneId = xml.createElement("scene_id");
									var sIdText = xml.createTextNode(tID[1]);
									sceneId.appendChild(sIdText);
									newTimeout.appendChild(sceneId);
								} else {
									if (toutIdText.toString() == tID[1].toString() ) {
										timeoutOld.parentNode.removeChild(timeoutOld);
									}
								}
							} else if (tList['timeout']) {
								newTimeout = xml.createElement("timeout");
								var crlf7 = xml.createTextNode("\t");
								scenes[i].appendChild(crlf7);
								scenes[i].appendChild(newTimeout);
								var crlf8 = xml.createTextNode("\r\n\t");
								scenes[i].appendChild(crlf8);
								var value = xml.createElement("timeout_value");
								var valueText = xml.createTextNode(tList['timeout']['timeout_value']);
								value.appendChild(valueText);
								newTimeout.appendChild(value);
								var sceneId = xml.createElement("scene_id");
								var sIdText = xml.createTextNode(tID[1]);
								sceneId.appendChild(sIdText);
								newTimeout.appendChild(sceneId);
							}							
						}							
					}						
					modal.closeModal();
					//modal.writeXMLFile();
				});
			}
		}
	});
},		

switchCat: function(thistag) {	
	var currentCategory = $(thistag).val();
	var currentEvent = $(thistag).parent().nextAll('.col-event').children('select').val();
	if (currentEvent == 'cpr') {
		delete tList['cpr'];
		if (currentCategory == 'timeout') {
			tList['timeout'] = {
				type : 'timeout',
				timeout_value : 60, // default
				used : 2
			};	
		} else if (currentCategory != 'cpr') {
			var newt = {
				type : 'event',
				category : currentCategory,
				used : 2
			};
			tList['event'].push(newt); 
		}
	} else if (currentEvent == 'timeout') {
		delete tList['timeout'];
		if (currentCategory == 'cpr') {
			tList['cpr'] = {
				type : 'cpr',
				duration : 15, // default
				used : 2
			};	
		} else if (currentCategory != 'timeout') {
			var newt = {
				type : 'event',
				category : currentCategory,
				used : 2
			};
			tList['event'].push(newt); 			
		}
	} else {
		if (currentCategory == 'cpr' 
		 || currentCategory == 'timeout') {
			for (var i = 0; i < tList['event'].length; i++) {
				if (currentEvent == tList['event'][i]['event_id']) {
					tList['event'].splice(i, 1); // remove the event
				}
			}
		}
		if (currentCategory == 'cpr') {
			tList['cpr'] = {
				type : 'cpr',
				duration : 15, // default
				used : 2
			};				
		} else if (currentCategory == 'timeout') {
			tList['timeout'] = {
				type : 'timeout',
				timeout_value : 60, // default
				used : 2
			}; 			
		} else {
			for (var i = 0; i < tList['event'].length; i++) {
				var t = tList['event'][i];
				if (currentEvent == t['event_id']) {
					tList['event'][i] = {
						type : 'event',
						category : currentCategory,
						used : 2
					};
				}
			}			
		}
	}
	modal.editTriggers();
},

updateCpr: function(thistag) {
	var newValue = $(thistag).val();
	var regex = new RegExp('^[1-9]{1}[0-9]{0,3}$');
	if (regex.test(newValue)) {
		tList['cpr']['duration'] = newValue;
		modal.editTriggers();		
	} else {
		alert('Please input a valid number!');		
		modal.editTriggers();
	}
},

updateTimeout: function(thistag) {
	var newValue = $(thistag).val();
	var regex = new RegExp('^[1-9]{1}[0-9]{0,3}$');
	if (regex.test(newValue)) {
		tList['timeout']['timeout_value'] = newValue;
		modal.editTriggers();		
	} else {
		alert('Please input a valid number!');
		modal.editTriggers();
	}
},

switchEv: function(thistag) {
	var prevEv = $(thistag).attr("data-event-tag");
	var currentEvent = $(thistag).val();
	var currentCategory = $(thistag).parent().prevAll('.col-category').children('select').val();
	for (var i = 0; i < tList['event'].length; i++) {
		var t = tList['event'][i];
		if (prevEv == t['event_id']) {
			tList['event'][i] = {
				type : 'event',
				event_id : currentEvent,
				category : currentCategory,
				used : 2
			};
		}
	}
	modal.editTriggers();
},

deleteTrigger: function(thistag) {
	var deleteEv = $(thistag).parents('.trigger-select').find('td.col-event select,button').val();
	//console.log(deleteEv);
	if (deleteEv == 'cpr') {
		delete tList['cpr'];
	} else if (deleteEv == 'timeout') {
		delete tList['timeout'];
	} else {
		for (var i = 0; i < tList['event'].length; i++) {
			if (deleteEv == tList['event'][i]['event_id']) {
				tList['event'].splice(i, 1); // remove the event
			}
		}		
	}
	modal.editTriggers();
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
	// delete trigger array when window is closed
	delete tList;
	delete param;
},

closeModalFast: function() {
	$('#modal').hide();
	$('#modal-content').empty();
	$('#modal .close_modal').show();
},
}

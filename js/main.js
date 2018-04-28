$(document).ready(function() {
	$('select').material_select();

	// Open request when clicked
	$('#fieldGo').click(openNewRequest);

	// Add new data field when clicked
	$('#fieldAddData').click(addNewDataField);

	// Delete all data fields when clicked
	$('#fieldDelAllData').click(deleteAllDataFields);
});

let performanceTime;

// Open a new request
function openNewRequest() {
	// Performance
	performanceTime = performance.now();

	// Disable button
	$('#fieldGo').addClass('disabled');

	// Clear result
	$('#jsonResult').html('');

	// Get variables
	let targetURL = $('#fieldURL').val();
	let requestMethod = $('#fieldMethod').val();

	console.log(requestMethod);

	// Make request
	$.ajax({
		url: targetURL,
		method: requestMethod,
		dataType: 'json',
		data: getDataFromDataFields(),
		success: function(resultData) {
			endRequest(true, resultData);
		},
		error: function(errorData) {
			endRequest(false, errorData);
		}
	});
	return true;
}

// End a request
function endRequest(success, data) {
	// Enable button
	$('#fieldGo').removeClass('disabled');

	// Place result on page
	let resultHTML = JSON.stringify(data, null, 4);
	resultHTML = Prism.highlight(resultHTML, Prism.languages.json);

	$('#jsonResult').html(
		resultHTML
	);

	// Status badge
	let statusTime = performance.now() - performanceTime;
	let statusText = ((success) ? 'Success' : 'Error') + ` (time elapsed: ${statusTime}ms)`;
	let statusColor = ((success) ? 'green' : 'red');

	$('#statusBadgeHolder').html(`
		<span class="new badge ${statusColor}" data-badge-caption="${statusText}" id="statusBadge"></span>
	`);
	return true;
}

// Adds a new field to add data/parameter
function addNewDataField() {
	$('#fieldDataHolder').append(`
		<div class="card-panel grey">
			<div class="row parameter-row">
				<div class="col s5 input-field">
					<input type="text" class="parameter-input" id="parameter-key-input" />
					<label for="parameter-key-input">Key</label>
				</div>
				<div class="col s5 input-field">
					<input type="text" class="parameter-input" id="parameter-value-input" />
					<label for="parameter-value-input">Value</label>
				</div>
				<div class="col s2">
					<a class="btn-floating waves-effect waves-light red right" onclick="deleteDataField(this)">
						<i class="material-icons">close</i>
					</a>
				</div>
			</div>
		</div>
	`);
	return true;
}

// Delete a data field
function deleteDataField(elem) {
	$(elem).addClass('disabled');
	let dataFieldContainer = $(elem).parents('.card-panel.grey')[0];

	$(dataFieldContainer).fadeOut(100, function() {
		$(dataFieldContainer).remove();
	});
}

// Get the count of current parameters
function getDataFieldCount() {
	return $('#fieldDataHolder .card-panel').length;
}

// Delete all parameters/data
function deleteAllDataFields() {
	if(!getDataFieldCount()) return true;

	if(confirm('Delete all parameters?')) {
		$('#fieldDataHolder .card-panel').remove();
	}
}

// Get data from data fields
function getDataFromDataFields() {
	let data = {};

	$('#fieldDataHolder .card-panel').each(function() {
		let key = $(this).find('#parameter-key-input').val();
		let value = $(this).find('#parameter-value-input').val();

		if(key.length && value.length) {
			data[key] = value;
		}
	});

	return data;
}
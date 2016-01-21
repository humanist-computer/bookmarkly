updateInputState = function(inputClass) {
	var input = $(inputClass),
		label = $(inputClass + '-label');
	if ($(input).val() != '') {
		$(label).addClass('active');
	} else {
		$(label).removeClass('active');
	}
}


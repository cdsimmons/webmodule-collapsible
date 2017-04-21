var collapsible = (function () {
	var selectors = {
		trigger: '[data-collapsible-target]', // Apply this to the triggers/buttons
		target: '[data-collapsible-id]', // Apply this to the targets/components that will collapse
		label: '[data-collapsible-label]', // Apply this to the child label of the trigger/buttons
		wrapper: '[data-collapsible-wrapper]' // Apply this to the wrapper of the target/collapsible... this is because we use CSS max-height
	}

	var attributes = {
		target: 'data-collapsible-target', // This value is linked with id
		id: 'data-collapsible-id', // This value is linked with target, to control which is collapsed... ie target collapses id
		labelExpanded: 'data-collapsible-label-expanded', // The label to display when expanded, to be defined on [data-collapsible-label]
		labelCollapsed: 'data-collapsible-label-collapsed' // The label to display when collapsed, to be defined on [data-collapsible-label]
	}

	var classes = {
		base: 'collapsible', // Always have this class on targets/components that will collapse
		expanded: 'expanded', // Class applied to collapsible when expanded
		collapsed: 'collapsed' // Class applied to collapsible when collapsed
	}

	var transitionDuration = 1000; // Currently have to manually adjust this to match the CSS transition duration... will later switch to transition end
	var slideDownTimeout;
	var busy = false;

	// Slide down the element...
	var slideDown = function($element) {
		var scrollHeight = $element[0].scrollHeight;

		$element.css('max-height', scrollHeight);

		// Have to set to auto to make sure it changes with screen size...
		slideDownTimeout = setTimeout(function() {
			$element.css('max-height', 'auto');
		});
	}

	// Slide up the element...
	var slideUp = function($element) {
		var scrollHeight = $element[0].scrollHeight;

		$element.css('max-height', scrollHeight);

		// Offset to make sure we have max-height first...
		setTimeout(function() {
			$element.css('max-height', 0);
		}, 1);
	}

	// Watch for click...
	$(selectors.trigger).on('click', function() {
		// Adding in a busy check... some devices seem to trigger it twice with one tap...
		if(!busy) {
			busy = true;

			var $this = $(this);
			var target = $this.attr(attributes.target);
			var $target = $('['+attributes.id+'='+target+']');
			var $label = $this.find(selectors.label);
			var $wrapper = $target.parents(selectors.wrapper);

			if($target.hasClass(classes.collapsed)) {
				slideDown($target);
				$target.addClass('expanded').removeClass('collapsed');
				$this.addClass('expanded').removeClass('collapsed');

				if($label.length > 0) {
					var label = $label.attr(attributes.labelExpanded);

					$label.html(label);
				}

				if($wrapper.length > 0) {
			    	var height = $(this).outerHeight();
			    	$wrapper.css('height', height+'px');
			    }
			} else {
				slideUp($target);
				$target.addClass('collapsed').removeClass('expanded');
				$this.addClass('collapsed').removeClass('expanded');

				if($label.length > 0) {
					var label = $label.attr(attributes.labelCollapsed);

					$label.html(label);
				}

				if($wrapper.length > 0) {
					setTimeout(function() {
				    	var height = $(this).outerHeight();
				    	$wrapper.css('height', 'auto');
				    }, transitionDuration);
			    }
			}

			setTimeout(function() {
				busy = false;
			}, 100);
		}
	});
	
	// If not collapsed for desktop, just override max-height on element

	return {};
}()); 
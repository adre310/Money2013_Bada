/*
* Extend Backbone for JQM 1.2.0
*/

define(['jquery','backbone','underscore','jquery.mobile'],function(){	
	// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
	var methodMap = {
	  'create': 'POST',
	  'update': 'PUT',
	  'delete': 'DELETE',
	  'read':   'GET'
	};

	Backbone.sync = function(method, model, options) {
	  var type = methodMap[method];

	  // Default options, unless specified.
	  options || (options = {});

	  // Default JSON-request options.
	  var params = {type: type, dataType: 'json'};

	  // Ensure that we have a URL.
	  if (!options.url) {
	    params.url = _.result(model, 'url') || urlError();
	  }

	  // Ensure that we have the appropriate request data.
	  if (!options.data && model && (method === 'create' || method === 'update')) {
	    params.contentType = 'application/json';
	    params.data = JSON.stringify(model);
	  }

	  // For older servers, emulate JSON by encoding the request into an HTML-form.
	  if (Backbone.emulateJSON) {
	    params.contentType = 'application/x-www-form-urlencoded';
	    params.data = params.data ? {model: params.data} : {};
	  }

	  // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	  // And an `X-HTTP-Method-Override` header.
	  if (Backbone.emulateHTTP) {
	    if (type === 'PUT' || type === 'DELETE') {
	      if (Backbone.emulateJSON) params.data._method = type;
	      params.type = 'POST';
	      params.beforeSend = function(xhr) {
	        xhr.setRequestHeader('X-HTTP-Method-Override', type);
	      };
	    }
	  }

	  // Don't process data on a non-GET request.
	  if (params.type !== 'GET' && !Backbone.emulateJSON) {
	    params.processData = false;
	  }

	  var success = options.success;
	  options.success = function(resp, status, xhr) {
		$.mobile.hidePageLoadingMsg();
	    if (success) success(resp, status, xhr);
	    model.trigger('sync', model, resp, options);
	  };

	  var error = options.error;
	  options.error = function(xhr, status, thrown) {
		console.log('fetch error: '+status);
		
		$.mobile.hidePageLoadingMsg();
		
		// show error message
		$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );

		// hide after delay
		setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
		
	    if (error) error(model, xhr, options);
	    model.trigger('error', model, xhr, options);
	  };
	  
	  $.mobile.showPageLoadingMsg();
	  // Make the request, allowing the user to override any Ajax options.
	  return $.ajax(_.extend(params, options));
	};
		
});
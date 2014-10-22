'use strict';

define(['app'], function(app) {
	app.factory('storage', function() {
		var STORAGE_ID = 'nlmg-app';

		return {
			get : function() {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},
			put : function(data) {
				localStorage.setItems(STORAGE_ID, JSON.stringify(data));
			}
		};
	});
});
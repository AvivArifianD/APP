/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comzhrx_changegroup_app/zhrx_changegroup_app/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

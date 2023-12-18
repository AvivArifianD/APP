/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comzhrx_changegroup/zhrx_changegroup/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

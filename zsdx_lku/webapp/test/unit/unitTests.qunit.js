/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comzsd_lku/zsdx_lku/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

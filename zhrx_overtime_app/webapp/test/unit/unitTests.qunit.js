/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comzhrx_overtime_app/zhrx_overtime_app/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

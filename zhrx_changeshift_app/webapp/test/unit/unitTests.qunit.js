/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comzhrx_changeshift_app/zhrx_changeshift_app/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comzhrx_changeshift/zhrx_changeshift/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

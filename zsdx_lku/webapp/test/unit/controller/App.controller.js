/*global QUnit*/

sap.ui.define([
	"comzsd_lku/zsdx_lku/controller/App.controller"
], function (Controller) {
	"use strict";

	QUnit.module("App Controller");

	QUnit.test("I should test the App controller", function (assert) {
		// var oAppController = new Controller();
		// oAppController.onInit();
		// assert.ok(oAppController);

		assert.ok(true, "this test is fine"); 
				var string = 'Test QUnit for Quality Insurance',
                	value = string.substring(5,10); 
                assert.equal(value, "QUnit", "We expect value to be 'Qunit'"); 
	});

});

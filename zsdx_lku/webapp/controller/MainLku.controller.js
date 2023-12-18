sap.ui.define([
    "com/zsdlku/zsdxlku/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/Text"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (B, C, MessageBox, Dialog, Button, mobileLibrary, JSONModel, MessageToast, Text) {
        "use strict";

        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return B.extend("com.zsdlku.zsdxlku.controller.MainCrdPrfl", {
            onInit: function () {
                this._oBusy = new sap.m.BusyDialog();
                this.oModel = this.getOwnerComponent().getModel();

                var loEventBus = sap.ui.getCore().getEventBus();
                loEventBus.subscribe("root", "update", this.onRoute, this);

            },

            onRoute: function (sChanel, sEvent, oData) {
                if (typeof this.getView().getModel() !== "undefined") {
                    this.getView().getModel().updateBindings();
                }
                this.oModel.refresh();
            },

            onEditView: function (oEvent) {
                var loRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var lvActivityId = oEvent.getSource().getText();
                loRouter.navTo("EditLku", {
                    ActivityId: window.encodeURIComponent(
                        lvActivityId
                    ),
                });
            },

        });
    });

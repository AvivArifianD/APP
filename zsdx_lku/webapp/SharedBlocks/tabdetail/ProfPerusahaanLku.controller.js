sap.ui.define([
    "com/zsdlku/zsdxlku/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (B, Controller, JSONModel, mobileLibrary) {
        "use strict";

        var URLHelper = mobileLibrary.URLHelper;

        return B.extend("com.zsdlku.zsdxlku.SharedBlocks.tabdetail.ProfPerusahaanLku", {
            onInit: function () {

                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oBusy = new sap.m.BusyDialog();

                // this.byId("id_SATable").setModel(new JSONModel(), "prflListSA");
            }

        });
    });

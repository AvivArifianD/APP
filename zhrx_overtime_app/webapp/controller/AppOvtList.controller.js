sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/unified/DateTypeRange",
    "sap/m/MessageBox",
    "sap/m/BusyDialog"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel, Fragment, Filter, FilterOperator, MessageBox, BusyDialog) {
        "use strict";

        return Controller.extend("com.zhrxovertimeapp.zhrxovertimeapp.controller.AppOvtList", {
            // formatter: f,
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this._oBusy = new sap.m.BusyDialog();
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            },

            onSearch: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("Zzdocid", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }
    
                // update list binding
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },

            onSelectionChange: function (oEvent) {
                this.oModel = this.getOwnerComponent().getModel();
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var lvItem = oEvent.getParameters().listItem.mProperties.title;
                // oRouter.navTo("DetailAppOvt", {
                //     DocumentID: window.encodeURIComponent(
                //         lvItem
                //     ),
                //  });

                    oRouter.navTo("DetailAppOvt", {
                        scenarioid: lvItem,
                        wfInstanceId: "WWWW",
                        taskPath:"TTT"
                    })
               
            }
        });
    });

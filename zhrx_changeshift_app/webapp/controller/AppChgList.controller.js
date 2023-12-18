sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator,) {
        "use strict";

        return Controller.extend("com.zhrxchangeshiftapp.zhrxchangeshiftapp.controller.AppChgList", {
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
                 // });

                    oRouter.navTo("DetailAppChg", {
                        scenarioid: lvItem,
                        wfInstanceId: "WWWW",
                        taskPath:"TTT"
                    })
               
            }
        });
    });

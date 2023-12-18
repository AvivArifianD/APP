sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("com.zhrxovertime.zhrxovertime.controller.CreateOvertimeH", {
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oBusy = new sap.m.BusyDialog();
                this.oRouter
                    .getRoute("CreateOvertimeH")
                    .attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                var sPath = "/zhr_sh_orgunitSet",
                    oODataModel = new JSONModel(),
                    that = this;
                this._oBusy.open();

                this.oModel.read(sPath, {
                    async: false,
                    success: function (oData, response) {
                        oODataModel.setData(oData.results[0]);
                        that.getView().setModel(oODataModel, "header");
                        that._isDirty = false;

                        that._oBusy.close();
                    },
                    error: function (oError) {
                        if (oError) {
                            if (oError.responseText) {
                                var oErrorMessage = JSON.parse(oError.responseText);
                            }
                        }
                        that._oBusy.close();
                    }
                });
            },

            onBackPress: function (oEvent) {
                // this.getView().setBindingContext(null);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainOvertime");
                this._reset();

            },

            onCreate: function () {
                var lvOrgeh = this.getView().byId("id_Orgeh").getSelectedKey();
                var lvOrget = this.getView().byId("id_Orgeh")._getSelectedItemText();
                var lvDate = this.byId("id_Date").mProperties.dateValue;
                lvDate.setDate(lvDate.getDate() + 1);

                if (lvOrgeh !== "" &&
                    lvOrget !== "" &&
                    lvDate !== ""
                ) {

                    var oModel = new JSONModel({
                        Zzorgeh: lvOrgeh,
                        Zzorget: lvOrget,
                        Zzedate: lvDate,
                        Action: "TC",
                        OvtHeader_to_OvtItem: [],
                        OvtHeader_to_OvtAttach: []
                    })

                    var that = this;
                    var a = this.getOwnerComponent();
                    // var r = a.getModel(this.oModel);
                    this.oModel.create("/zhr_ovtime_hSet", oModel.getData(),
                        {
                            async: false,
                            success: function (eData, a) {
                                if (eData.Status === "S") {
                                    // Clean up the oData from __metadata attribute
                                    delete eData.__metadata;
                                    var r = that.getOwnerComponent().getRouter();
                                    r.navTo("CreateOvertimeD", { data: encodeURIComponent(JSON.stringify(eData)) });
                                    lvDate.setDate(lvDate.getDate() - 1);
                                    that._reset();
                                } else {
                                    lvDate.setDate(lvDate.getDate() - 1);
                                    MessageBox.error(eData.Msg);
                                }

                            },
                            error: function (e) {
                                lvDate.setDate(lvDate.getDate() - 1);
                                MessageToast.show(e.message);
                            }
                        });
                } else {
                    MessageBox.error("Please fill mandatory fields (*)");
                }

            },

            _reset: function () {
                var lvOrgeh = this.byId("id_Orgeh"),
                    lvDate = this.byId("id_Date");

                lvOrgeh.setValue(null);
                lvDate.setValue(null);
            }  
        });
    });

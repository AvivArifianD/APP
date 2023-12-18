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

        return Controller.extend("com.zhrxchangeshift.zhrxchangeshift.controller.CreateECShiftH", {
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oBusy = new sap.m.BusyDialog();
                this.oRouter
                    .getRoute("CreateECShiftH")
                    .attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                var sPath = "/zhr_sh_orgunitSet",
                    oODataModel = new JSONModel(),
                    sPathSu = "/zhr_sh_orgsuSet",
                    oODataModelSu = new JSONModel(),
                    that = this;
                this._oBusy.open();

                this.oModel.read(sPath, {
                    async: false,
                    success: function (oData, response) {
                        oODataModel.setData(oData.results[0]);
                        that.getView().setModel(oODataModel, "header");
                    },
                    error: function (oError) {
                        if (oError) {
                            if (oError.responseText) {
                                var oErrorMessage = JSON.parse(oError.responseText);
                                console.log(oErrorMessage);
                            }
                        }

                    }
                });

                this.oModel.read(sPathSu, {
                    async: false,
                    success: function (oData, response) {
                        oODataModelSu.setData(oData.results[0]);
                        that.getView().setModel(oODataModelSu, "headerSu");
                        // that._isDirty = false;
                        that._oBusy.close();
                    },
                    error: function (oError) {
                        if (oError) {
                            if (oError.responseText) {
                                var oErrorMessage = JSON.parse(oError.responseText);
                                console.log(oErrorMessage);
                            }
                        }
                        that._oBusy.close();
                    }
                });
            },

            onBackPress: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainECShift");
                this._reset();

            },

            onCreate: function () {
                var lvOrgeh = this.getView().byId("id_Orgeh").getSelectedKey(),
                lvOrget = this.getView().byId("id_Orgeh")._getSelectedItemText(),
                lvOrgsu = this.getView().byId("id_Orgsu").getSelectedKey(),
                lvOrgst = this.getView().byId("id_Orgsu")._getSelectedItemText();
                if (lvOrgeh !== "" &&
                    lvOrget !== "" &&
                    lvOrgsu !== "" &&
                    lvOrgst !== ""
                ) {

                    var oModel = new JSONModel({
                        Zzorgeh: lvOrgeh,
                        Zzorget: lvOrget,
                        Zzorgsu: lvOrgsu,
                        Zzorgst: lvOrgst,
                        Action: "TC",
                        ChgHeader_to_ChgItem: [],
                        ChgHeader_to_ChgAttach: []
                    })

                    var that = this;
                    this.oModel.create("/zhr_ecshift_hSet", oModel.getData(),
                        {
                            async: false,
                            success: function (eData, a) {
                                if (eData.Status === "S") {
                                    // Clean up the oData from __metadata attribute
                                    delete eData.__metadata;
                                    var r = that.getOwnerComponent().getRouter();
                                    r.navTo("CreateECShiftD", { data: encodeURIComponent(JSON.stringify(eData)) });
                                    that._reset();
                                } else {
                                    MessageBox.error(eData.Msg);
                                }

                            },
                            error: function (e) {
                                MessageToast.show(e.message);
                            }
                        });
                } else {
                    MessageBox.error("Please fill mandatory fields (*)");
                }

            },

            _reset: function () {
                var lvOrgeh = this.byId("id_Orgeh"),
                    lvOrgsu = this.byId("id_Orgsu");

                lvOrgeh.setValue(null);
                lvOrgsu.setValue(null);
            }
 
        });
    });

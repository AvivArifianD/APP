sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("com.zhrxchangegroup.zhrxchangegroup.controller.DetailECGroup", {
            // formatter: f,
            onInit: function () {
                this._oBusy = new sap.m.BusyDialog();
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.getView().getModel().updateBindings();
                this.byId("id_splRequestTable").setModel(new JSONModel(), "chgList");

                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("DetailECGroup")
                    .attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {
                var loItem = oEvent.getParameter("arguments"),
                    lvPath = "/zhr_ecgroup_headSet('" + loItem.DocumentID + "')",
                    loODataModel = new JSONModel(),
                    that = this;
                this._oBusy.open();

                var loListModel = that.byId("id_splRequestTable").getModel("chgList");

                this.oModel.read(lvPath, {
                    async: false,
                    urlParameters:
                    {
                        $expand: "ChgHeader_to_ChgItem"
                    },

                    success: function (oData, response) {
                        delete oData.__metadata;
                        var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "KK:mm:ss a" });
                        // timezoneOffset is in hours convert to milliseconds
                        var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                        oData.FreeText = timeFormat.format(new Date(oData.CreateTime.ms + TZOffsetMs));
                        oData.Msg = timeFormat.format(new Date(oData.ChangeTime.ms + TZOffsetMs));
                        if (oData.Msg === '00:00:00 AM') {
                            oData.Msg = ''; 
                        }

                        loODataModel.setData(oData);
                        that.getView().setModel(loODataModel, "header");

                        loListModel.setData({
                            data: oData.ChgHeader_to_ChgItem.results
                        });

                        that._oBusy.close();
                    },
                    error: function (oError) {
                        that._oBusy.close();
                        MessageToast.show(oError.message);
                    }
                });
            },

            onBackPress: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainECGroup");
                this._reset();

            },

            _reset: function () {

                var lvDocid = this.byId("id_Docid"),
                    lvDocStatus = this.byId("id_DocStatus"),
                    lvApprover = this.byId("id_Approver"),
                    lvReq = this.byId("id_Req"),
                    lvOrgUnit = this.byId("id_OrgUnit"),
                    lvOrget = this.byId("id_OrgUnitText"),
                    lvCDate = this.byId("id_CDate"),
                    lvCTime = this.byId("id_CTime"),
                    lvCBy = this.byId("id_CBy"),
                    lvHDate = this.byId("id_HDate"),
                    lvHTime = this.byId("id_HTime"),
                    lvHBy = this.byId("id_HBy");

                lvDocid.setText(null);
                lvDocStatus.setText(null);
                lvApprover.setText(null);
                lvReq.setText(null);
                lvOrgUnit.setText(null);
                lvOrget.setText(null);
                lvCDate.setText(null);
                lvCTime.setText(null);
                lvCBy.setText(null);
                lvHDate.setText(null);
                lvHTime.setText(null);
                lvHBy.setText(null);

                var loFree = [];
                var loListModel = this.byId("id_splRequestTable").getModel("chgList");
                loListModel.setData({
                    data: loFree
                });

            }
        });
    });

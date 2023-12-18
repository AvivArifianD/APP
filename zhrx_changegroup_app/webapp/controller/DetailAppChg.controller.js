sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("com.zhrxchangegroupapp.zhrxchangegroupapp.controller.DetailAppChg", {

            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.byId("id_splRequestTable").setModel(new JSONModel(), "chgList");
                this.byId("id_splRequestTable2").setModel(new JSONModel(), "chgListApp");
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("DetailAppChg")
                    .attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {
                var oODataModel = new JSONModel(),
                    that = this;

                var compData = this.getOwnerComponent().getComponentData();
                var documentId = compData.startupParameters.Param1; //Document ID as Key --! Important
                // var documentId = 'CG348000000000030';
                var sPath = "/zhr_ecgroup_headSet('" + documentId + "')";


                var oListModel = that.byId("id_splRequestTable").getModel("chgList"),
                    oListModelApp = that.byId("id_splRequestTable2").getModel("chgListApp");

                this.oModel.read(sPath, {
                    async: false,
                    urlParameters: {
                        $expand: "ChgHeader_to_ChgItem,ChgHeader_to_ChgApp"
                    },
                    success: function (oData, response) {
                        oODataModel.setData(oData);
                        if (oData.Zzpernrnotif1 == '00000000') {
                            oData.Zzpernrnotif1 = '';
                        }

                        if (oData.Zzpernrnotif2 == '00000000') {
                            oData.Zzpernrnotif2 = '';
                        }

                        if (oData.Zzpernrnotif3 == '00000000') {
                            oData.Zzpernrnotif3 = '';
                        }
                        that.getView().setModel(oODataModel, "header");

                        oListModel.setData({
                            data: oData.ChgHeader_to_ChgItem.results
                        });

                        oListModelApp.setData({
                            data: oData.ChgHeader_to_ChgApp.results
                        });
                    },
                    error: function (oError) {
                        if (oError) {
                            if (oError.responseText) {
                                var oErrorMessage = JSON.parse(oError.responseText);
                                console.log();
                            }
                        }
                    }
                });
            },

            onSelectionChange: function (oEvent) {
                var oPath = oEvent.getSource().getParent().oBindingContexts.chgList.sPath,
                    oModels = this.byId("id_splRequestTable").getModel("chgList"),
                    oText = oModels.getProperty(oPath + "/FreeText"),
                    oDatax = oModels.getProperty(oPath),
                    oDataCheck = oDatax;
                delete oDataCheck.__metadata;

                var oModel = new JSONModel({
                    Action: 'CK',
                    Zzdocid: this.getView().getModel("header").getData().Zzdocid,
                    Zzdstat: this.getView().getModel("header").getData().Zzdstat,

                    ChgHeader_to_ChgItem: []
                }),
                    oData = oModel.getProperty("/ChgHeader_to_ChgItem");

                var chgItem = oDataCheck;
                oData.push(chgItem);

                if (oText === 'true') {
                    oModels.setProperty(oPath + "/ZzistatTmp", "X");
                } else {
                    oModels.setProperty(oPath + "/ZzistatTmp", " ");
                }

                this.oModel.create("/zhr_ecgroup_headSet", oModel.getData(), {
                    async: false,
                    success: function (eData, a) {
                        if (eData.Status === "S") {
                            console.log("Success");
                        } else {
                            MessageToast.show(eData.Msg);
                        }

                    },
                    error: function (e) {
                        MessageToast.show(e.message);
                    }
                });
            }
        });
    });

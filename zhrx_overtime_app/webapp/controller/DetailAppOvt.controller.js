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

        return Controller.extend("com.zhrxovertimeapp.zhrxovertimeapp.controller.DetailAppOvt", {

            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.byId("id_AttachTable").setModel(new JSONModel(), "ovtListAttach");
                this.byId("id_splRequestTable").setModel(new JSONModel(), "ovtList");
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("DetailAppOvt")
                    .attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {
                var oODataModel = new JSONModel(),
                    that = this;

                var compData = this.getOwnerComponent().getComponentData();
                var documentId = compData.startupParameters.Param1; //Document ID as Key --! Important
                // var documentId = 'OT3480000000077'; //Document ID as Key --! Important
                var sPath = "/zhr_ovtime_hSet('" + documentId + "')";


                var oListModel = that.byId("id_splRequestTable").getModel("ovtList");
                var oListModelAttach = that.byId("id_AttachTable").getModel("ovtListAttach");

                this.oModel.read(sPath, {
                    async: false,
                    urlParameters: {
                        $expand: "OvtHeader_to_OvtItem,OvtHeader_to_OvtAttach"
                    },
                    success: function (oData, response) {
                        oODataModel.setData(oData);
                        that.getView().setModel(oODataModel, "header");
                        that._isDirty = false;

                        oListModel.setData({
                            data: oData.OvtHeader_to_OvtItem.results
                        });

                        oListModelAttach.setData({
                            data: oData.OvtHeader_to_OvtAttach.results
                        });
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
            },

            onBackPress: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteAppOvtList");
                this._reset();

            },

            _reset: function () {
                var oid_Docid = this.byId("id_Docid"),
                    oid_Orgeh = this.byId("id_Orgeh"),
                    oid_Ottyp = this.byId("id_Ottyp"),
                    oid_Edate = this.byId("id_Edate");

                oid_Docid.setText(null);
                oid_Orgeh.setText(null);
                oid_Ottyp.setText(null);
                oid_Edate.setText(null);


                var oFree = [];
                var oListModel = this.byId("id_splRequestTable").getModel("ovtList");
                oListModel.setData({
                    data: oFree
                });

                var oListModelAttach = this.byId("id_AttachTable").getModel("ovtListAttach");
                oListModelAttach.setData({
                    data: oFree
                });
            },

            onSelectionChange: function (oEvent) {
                var oPath = oEvent.getSource().getParent().oBindingContexts.ovtList.sPath,
                    oModels = this.byId("id_splRequestTable").getModel("ovtList"),
                    oText = oModels.getProperty(oPath + "/FreeText"),
                    oDatax = oModels.getProperty(oPath),
                    oDataCheck = oDatax;
                delete oDataCheck.__metadata;

                var oModel = new JSONModel({
                    Action: 'CK',
                    Zzdocid: this.getView().getModel("header").getData().Zzdocid,
                    Zzdstat: this.getView().getModel("header").getData().Zzdstat,

                    OvtHeader_to_OvtItem: []
                })
                    ,
                    oData = oModel.getProperty("/OvtHeader_to_OvtItem");

                var ovtItem = oDataCheck;
                oData.push(ovtItem);

                if (oText === 'true') {
                    oModels.setProperty(oPath + "/ZzestatTmp", "X");
                } else {
                    oModels.setProperty(oPath + "/ZzestatTmp", " ");
                }


                this.oModel.create("/zhr_ovtime_hSet", oModel.getData(), {
                    async: false,
                    success: function (eData, a) {
                        if (eData.Status === "S") {
                            console.log("sukses");
                        } else {
                            MessageToast.show(eData.Msg);
                        }

                    },
                    error: function (e) {
                        MessageToast.show(e.message);
                    }
                });
            },

            onItemPressedAtta: function (oEvent) {
                var oCtx = oEvent.getParameter("listItem").getBindingContext("ovtListAttach"),
                    oModels = oCtx.getModel("ovtListAttach"),
                    sPath = oCtx.getPath(),
                    lvSubject = oModels.getProperty(sPath + "/Filename"),
                    lvDocid = oModels.getProperty(sPath + "/Zzdocid"),
                    lvFileid = oModels.getProperty(sPath + "/Fileid");

                this.oPDFViewer = new sap.m.PDFViewer();

                var that = this;
                var sServiceURL = that.getView().getModel().sServiceUrl;
                var sSource = sServiceURL + "/zhr_ovtime_attachmentSet(Zzdocid='" + lvDocid + "',Fileid='" + lvFileid + "')/$value";
                this.getView().addDependent(this.oPDFViewer);
                this.oPDFViewer.setSource(sSource);
                this.oPDFViewer.setTitle(lvSubject);
                this.oPDFViewer.open();
            }
        });
    });

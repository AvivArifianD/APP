sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.zhrxovertime.zhrxovertime.controller.DetailOvertime", {
            // formatter: f,
            onInit: function () {
                this._oBusy = new sap.m.BusyDialog();
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.getView().getModel().updateBindings();
                this.byId("id_AttachTable").setModel(new JSONModel(), "ovtListAttach");
                this.byId("id_splRequestTable").setModel(new JSONModel(), "ovtList");

                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("DetailOvertime")
                    .attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {
                var oItem = oEvent.getParameter("arguments"),
                    sPath = "/zhr_ovtime_hSet('" + oItem.DocumentID + "')",
                    oODataModel = new JSONModel(),
                    that = this;
                this._oBusy.open();

                var oListModel = that.byId("id_splRequestTable").getModel("ovtList");
                var oListModelAttach = that.byId("id_AttachTable").getModel("ovtListAttach");

                this.oModel.read(sPath, {
                    async: false,
                    urlParameters:
                    {
                        $expand: "OvtHeader_to_OvtItem,OvtHeader_to_OvtAttach"
                    },

                    success: function (oData, response) {
                        oODataModel.setData(oData);
                        var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "KK:mm:ss a" });
                        // timezoneOffset is in hours convert to milliseconds
                        var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                        oData.FreeText = timeFormat.format(new Date(oData.CreateTime.ms + TZOffsetMs));
                        oData.Msg = timeFormat.format(new Date(oData.ChangeTime.ms + TZOffsetMs));
                        if (oData.Msg === '00:00:00 AM') {
                            oData.Msg = ''; 
                        }

                        that.getView().setModel(oODataModel, "header");

                        oListModel.setData({
                            data: oData.OvtHeader_to_OvtItem.results
                        });


                        oListModelAttach.setData({
                            data: oData.OvtHeader_to_OvtAttach.results
                        });

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
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainOvertime");
                this._reset();

            },

            _reset: function () {
                var oid_Docid = this.byId("id_Docid"),
                    oid_DocStatus = this.byId("id_DocStatus"),
                    oid_Approver = this.byId("id_Approver"),
                    oid_Req = this.byId("id_Req"),
                    oid_OrgUnit = this.byId("id_OrgUnit"),
                    oid_OtypeDesc = this.byId("id_OtypeDesc"),
                    oid_CDate = this.byId("id_CDate"),
                    oid_CTime = this.byId("id_CTime"),
                    oid_CBy = this.byId("id_CBy"),
                    oid_HDate = this.byId("id_HDate"),
                    oid_HTime = this.byId("id_HTime"),
                    oid_HBy = this.byId("id_HBy");

                oid_Docid.setText(null);
                oid_DocStatus.setText(null);
                oid_Approver.setText(null);
                oid_Req.setText(null);
                oid_OrgUnit.setText(null);
                oid_OtypeDesc.setText(null);
                oid_CDate.setText(null);
                oid_CTime.setText(null);
                oid_CBy.setText(null);
                oid_HDate.setText(null);
                oid_HTime.setText(null);
                oid_HBy.setText(null);

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

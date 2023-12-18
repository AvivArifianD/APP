sap.ui.define([
    "com/zsdlku/zsdxlku/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/NumberFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (B, Controller, JSONModel, mobileLibrary, Filter, FilterOperator,NumberFormat) {
        "use strict";

        var URLHelper = mobileLibrary.URLHelper;

        return B.extend("com.zsdlku.zsdxlku.SharedBlocks.tabdetail.InformasiUmumLku", {
            onInit: function () {

                // this.oModel = this.getOwnerComponent().getModel();
                // this.getView().setModel(this.oModel);
                // this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // this._oBusy = new sap.m.BusyDialog();
            },

            onChangeReqTop: function (oEvent) {
                let newValue = oEvent.getParameter("newValue");
                var oSource = oEvent.getSource(),
                    oParams = oEvent.getParameters(),
                    oBindingContext = oSource.getBindingContext();
                var sObjectPath = oBindingContext.getPath(),
                    oObject = oBindingContext.getProperty(sObjectPath);
                this._readWithFilter("/ZsdShTopSet", [new Filter("Zterm", FilterOperator.EQ, newValue)]).then(
                    function(oResolve){
                        var oResponse = oResolve.results[0];
                        if (typeof oResponse !== "undefined" && oResponse != null) {
                            this.getModel().setProperty(sObjectPath + "/head_to_info" + "/ReqTop", newValue);
                            this.getModel().setProperty(sObjectPath + "/head_to_info" + "/Ztagg", oResponse.Ztag1);
                            this.getModel().setProperty(sObjectPath + "/head_to_info" + "/ReqTopTxt", oResponse.Text1);

                        } else {
                            this.getModel().setProperty(sObjectPath + "/head_to_info" + "/ReqTop", newValue);
                            this.getModel().setProperty(sObjectPath + "/head_to_info" + "/Ztagg", '');
                            this.getModel().setProperty(sObjectPath + "/head_to_info" + "/ReqTopTxt", '');
                        }
                            

                    }.bind(this),
                    function(oReject){
    
                    }
                );
            
            },

            onLiveChangeReqLimit: function (oEvent) {
                var oSource = oEvent.getSource(),
                    oBindingContext = oSource.getBindingContext(),
                    sObjectPath = oBindingContext.getPath(),
                    oObject = oBindingContext.getProperty(sObjectPath),
                    loFieldControl = this.getModel("fieldControl");
    
                let newValue = oEvent.getParameter("newValue");
                if (newValue == '') {
                    newValue = 0;
                } 
                
                var sPathValueState = "/info-ReqLimit-valueState",
                    sPathValueStateMsg = "/info-ReqLimit-valueStateMsg",
                    sValueStateMsg = "";

                if (newValue < 1) {
                    loFieldControl.setProperty(sPathValueState, sap.ui.core.ValueState.Error);
                    sValueStateMsg = "Please fill greater than 0";
                    loFieldControl.setProperty(sPathValueStateMsg, sValueStateMsg);
                    this.getModel().setProperty(sObjectPath + "/head_to_info" + "/ReqLimit", newValue)
                } else {
                    loFieldControl.setProperty(sPathValueState, "None");
                    loFieldControl.setProperty(sPathValueStateMsg, sValueStateMsg);
                }
    
            },
            onChangeProductType: function (oEvent) {
                let newValue = oEvent.getParameter("newValue");
                var oSource = oEvent.getSource(),
                    oBindingContext = oSource.getBindingContext(),
                    sObjectPath = oBindingContext.getPath();
                this._readWithFilter("/ZsdShProductTypeSet", [new Filter("ProductType", FilterOperator.EQ, newValue)]).then(
                    function(oResolve){
                        var oResponse = oResolve.results[0];
                            this.getModel().setProperty(sObjectPath + "/head_to_info" + "/ProductTypeText", oResponse.Description);
                    }.bind(this),
                    function(oReject){
    
                    }
                );
            
            },

            _readWithFilter: function(sPath, oFilters){
                return new Promise( function (fnResolve, fnReject){
                    this.getModel().read(sPath, {
                        filters: oFilters,
                        success: function (oResponse) {
                            fnResolve(oResponse);
                        },
                        error: function (oError) {
                            fnReject(oError);
                        }
                    })
                }.bind(this));
            },
        });
    });

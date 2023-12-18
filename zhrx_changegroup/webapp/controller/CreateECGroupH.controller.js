sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel, MessageBox, Fragment, Filter, FilterOperator, Token) {
        "use strict";

        return Controller.extend("com.zhrxchangegroup.zhrxchangegroup.controller.CreateECGroupH", {
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oBusy = new sap.m.BusyDialog();
                this.oRouter
                    .getRoute("CreateECGroupH")
                    .attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                var lvPath = "/zhr_sh_orgunitSet",
                    loODataModel = new JSONModel(),
                    that = this;
                this._oBusy.open();

                this.oModel.read(lvPath, {
                    async: false,
                    success: function (oData, response) {
                        loODataModel.setData(oData.results[0]);
                        that.getView().setModel(loODataModel, "header");
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
                oRouter.navTo("RouteMainECGroup");
                this._reset();

            },

            //Pernr
            onVHPernr: function (oEvent) {
                var loInputValue = oEvent.getSource().getValue(),
                    loView = this.getView();

                if (!this._pValueHelpDialogPer) {
                    this._pValueHelpDialogPer = Fragment.load({
                        id: loView.getId(),
                        name: "com.zhrxchangegroup.zhrxchangegroup.view.fragment.ValueHelpDialogPer",
                        controller: this
                    }).then(function (oDialog) {
                        loView.addDependent(oDialog);
                        loView.byId("selectPernr").setMultiSelect(true);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogPer.then(function (oDialog) {
                    // var oOrgeh = oView.oModels.headerArray.oData.Zzorgeh;
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("Pernr", FilterOperator.Contains, loInputValue),
                    new Filter("Cname", FilterOperator.Contains, loInputValue)
                    ]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(loInputValue);
                });
            },

            onValueHelpSearchPer: function (oEvent) {
                var loValue = oEvent.getParameter("value");

                var oFilter = new Filter({
                    filters: [
                        new Filter({
                            path: 'Pernr',
                            operator: FilterOperator.Contains,
                            value1: loValue
                        }),
                        new Filter({
                            path: 'Cname',
                            operator: FilterOperator.Contains,
                            value1: loValue
                        })
                    ],
                    and: true
                })

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpClosePer: function (oEvent) {
                var laSelectedItems = oEvent.getParameter("selectedItems"),
                    lvPernr = this.byId("id_Pernr");
                if (typeof laSelectedItems != "undefined") {
                    var lvLenSel = laSelectedItems.length;

                    if (lvLenSel > 3) {
                        MessageBox.error('Maximum 3 of Employees');
                    } else {
                        var loPernr = this.getView().byId("id_Pernr"),
                            loTokenPer = loPernr.getTokens(),
                            lvLenToken = loTokenPer.length,
                            lvLenTotal = lvLenToken + lvLenSel;

                        if (lvLenTotal > 3) {
                            MessageBox.error('Maximum 3 of Employees');
                        } else {
                            if (laSelectedItems && lvLenSel > 0) {
                                laSelectedItems.forEach(function (oItem) {
                                    lvPernr.addToken(new Token({
                                        text: oItem.getTitle()
                                    }));
                                });
                            }
                        }
                    }
                }
            },

            onCreate: function () {
                var lvOrgeh = this.getView().byId("id_Orgeh").getSelectedKey(),
                    lvOrget = this.getView().byId("id_Orgeh")._getSelectedItemText(),
                    loPernr = this.getView().byId("id_Pernr"),
                    loTokenPer = loPernr.getTokens(),
                    lwHeaderArray = {};
                if (loTokenPer.length > 0) {
                    for (var i = 0; i < loTokenPer.length; i++) {
                        switch (i) {
                            case 0:
                                lwHeaderArray.Zzpernrnotif1 = loTokenPer[i].getText();
                                break;

                            case 1:
                                lwHeaderArray.Zzpernrnotif2 = loTokenPer[i].getText();
                                break;

                            case 2:
                                lwHeaderArray.Zzpernrnotif3 = loTokenPer[i].getText();
                                break;
                        }
                    }
                }
                if (lvOrgeh !== "" &&
                    lvOrget !== ""
                ) {

                    lwHeaderArray.Zzorgeh = lvOrgeh;
                    lwHeaderArray.Zzorget = lvOrget;
                    lwHeaderArray.Zzpernrnotif1Name = '';
                    lwHeaderArray.Zzpernrnotif2Name = '';
                    lwHeaderArray.Zzpernrnotif3Name = '';
                    lwHeaderArray.Zzpersa = '';
                    lwHeaderArray.Zzbtrtl = '';
                    lwHeaderArray.PersaTxt = '';
                    lwHeaderArray.BtrtlTxt = '';
                    lwHeaderArray.Zzreque = '';
                    lwHeaderArray.ZzrequeName = '';

                    var oModel = new JSONModel({
                        Zzorgeh: lwHeaderArray.Zzorgeh,
                        Zzorget: lwHeaderArray.Zzorget,
                        Zzpernrnotif1: lwHeaderArray.Zzpernrnotif1,
                        Zzpernrnotif2: lwHeaderArray.Zzpernrnotif2,
                        Zzpernrnotif3: lwHeaderArray.Zzpernrnotif3,
                        Action: "TC"
                    })

                    var that = this;
                    this.oModel.create("/zhr_ecgroup_headSet", oModel.getData(),
                        {
                            async: false,
                            success: function (oData, oResponse) {
                                if (oData.Status === "S") {
                                    lwHeaderArray.Zzpernrnotif1Name = oData.Zzpernrnotif1Name;
                                    lwHeaderArray.Zzpernrnotif2Name = oData.Zzpernrnotif2Name;
                                    lwHeaderArray.Zzpernrnotif3Name = oData.Zzpernrnotif3Name;
                                    lwHeaderArray.Zzpersa = oData.Zzpersa;
                                    lwHeaderArray.Zzbtrtl = oData.Zzbtrtl;
                                    lwHeaderArray.PersaTxt = oData.PersaTxt;
                                    lwHeaderArray.BtrtlTxt = oData.BtrtlTxt;
                                    lwHeaderArray.Zzreque = oData.Zzreque;
                                    lwHeaderArray.ZzrequeName = oData.ZzrequeName;

                                    var r = that.getOwnerComponent().getRouter();
                                    r.navTo("CreateECGroupD", { data: encodeURIComponent(JSON.stringify(lwHeaderArray)) });
                                    that._reset();
                                } else {
                                    MessageBox.error(oData.Msg);
                                }

                            },
                            error: function (e) {
                                console.log(e.responseText);
                            }
                        });
                } else {
                    MessageBox.error("Please fill mandatory fields (*)");
                }

            },

            _reset: function () {
                var lvOrgeh = this.byId("id_Orgeh"),
                    loPernr = this.getView().byId("id_Pernr");

                lvOrgeh.setValue(null);
                loPernr.removeAllTokens();
            }

        });
    });

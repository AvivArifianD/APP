sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Text"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, Filter, FilterOperator, MessageBox, Dialog, Button, mobileLibrary, Text) {
        "use strict";

        let oCheckArr = [];

        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("com.zhrxchangeshift.zhrxchangeshift.controller.CreateECShiftD", {
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this._oBusy = new sap.m.BusyDialog();
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("CreateECShiftD")
                    .attachPatternMatched(this._onRouteMatched, this);
                this.byId("id_splRequestTable").setModel(new JSONModel(), "chgList");
                this.byId("id_Subst").setModel(new JSONModel(), "dwsSet");
                oCheckArr = [];

            },

            _onRouteMatched: function (oEvent) {
                var oModel = new JSONModel();
                // read params from routing
                var headerArray = JSON.parse(decodeURIComponent(oEvent.getParameter("arguments").data));
                oModel.setData(headerArray);
                this.getView().setModel(oModel, "headerArray");

                var sPath = "/zhr_sh_dwsSet",
                    oODataModel = this.byId("id_Subst").getModel("dwsSet"),
                    oPersa = headerArray.Zzpersa,
                    that = this,
                    oFilter = new Array(),
                    lo_pickedFilter = new sap.ui.model.Filter({
                        path: 'Tprog',
                        operator: FilterOperator.EQ,
                        value1: oPersa
                    });
                oFilter.push(lo_pickedFilter);

                this._oBusy.open();

                this.oModel.read(sPath, {
                    filters: oFilter,
                    async: false,
                    success: function (oData, response) {
                        oODataModel.setData({
                            data: oData.results
                        });
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
                oRouter.navTo("CreateECShiftH");
                this._resetAll();

            },

            //Pernr
            onValueHelpRequestPer: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();

                if (!this._pValueHelpDialogPer) {
                    this._pValueHelpDialogPer = Fragment.load({
                        id: oView.getId(),
                        name: "com.zhrxchangeshift.zhrxchangeshift.view.fragment.ValueHelpDialogPer",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogPer.then(function (oDialog) {
                    var oOrgeh = oView.oModels.headerArray.oData.Zzorgeh;
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("Pernr", FilterOperator.Contains, sInputValue),
                    new Filter("Cname", FilterOperator.Contains, sInputValue),
                    new Filter("Orgeh", FilterOperator.EQ, oOrgeh)
                    ]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },

            onValueHelpSearchPer: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oOrgeh = this.getView().byId("id_Orgeh").getText();

                var oFilter = new Filter({
                    filters: [
                        new Filter({
                            path: 'Pernr',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        }),
                        new Filter({
                            path: 'Cname',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        })
                        ,
                        new Filter({
                            path: 'Orgeh',
                            operator: FilterOperator.EQ,
                            value1: oOrgeh
                        })
                    ],
                    and: true
                })

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpClosePer: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                this.byId("id_Pernr").setValue(oSelectedItem.getTitle());
            },

            //Subem
            onValueHelpRequestSub: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();

                if (!this._pValueHelpDialogSub) {
                    this._pValueHelpDialogSub = Fragment.load({
                        id: oView.getId(),
                        name: "com.zhrxchangeshift.zhrxchangeshift.view.fragment.ValueHelpDialogSub",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogSub.then(function (oDialog) {
                    var oOrgeh = oView.oModels.headerArray.oData.Zzorgsu;
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("Pernr", FilterOperator.Contains, sInputValue),
                    new Filter("Cname", FilterOperator.Contains, sInputValue),
                    new Filter("Orgeh", FilterOperator.EQ, oOrgeh)
                    ]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },

            onValueHelpSearchSub: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oOrgeh = this.getView().byId("id_Orgsu").getText();

                var oFilter = new Filter({
                    filters: [
                        new Filter({
                            path: 'Pernr',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        }),
                        new Filter({
                            path: 'Cname',
                            operator: FilterOperator.Contains,
                            value1: sValue
                        })
                        ,
                        new Filter({
                            path: 'Orgeh',
                            operator: FilterOperator.EQ,
                            value1: oOrgeh
                        })
                    ],
                    and: true
                })

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpCloseSub: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                this.byId("id_Subem").setValue(oSelectedItem.getTitle());
            },

            onReset: function () {
                this._reset();
            },

            _reset: function () {
                var oPernr = this.byId("id_Pernr"),
                    oEdate = this.byId("id_Edate"),
                    chgart = this.byId("id_Vtart"),
                    oSubst = this.byId("id_Subst"),
                    oSubem = this.byId("id_Subem"),
                    oRmrks = this.byId("id_Rmrks"),
                    oAdd = this.byId("id_btnAdd"),
                    oRes = this.byId("id_btnReset");
                oPernr.setValue(null);
                oEdate.setValue(null);
                chgart.setValue(null);
                oSubst.setValue(null);
                oSubem.setValue(null);
                oRmrks.setValue(null);
                oAdd.setText("Add");
                oAdd.setIcon("sap-icon://add");
                oRes.setText("Reset");
                oRes.setIcon("sap-icon://reset");
                try {
                    oPernr.setEditable(true);
                } catch (err) {
                    oPernr.setEnabled(true);
                };

            },

            _resetAll: function () {
                var oPernr = this.byId("id_Pernr"),
                    oEdate = this.byId("id_Edate"),
                    chgart = this.byId("id_Vtart"),
                    oSubst = this.byId("id_Subst"),
                    oSubem = this.byId("id_Subem"),
                    oRmrks = this.byId("id_Rmrks"),
                    oAdd = this.byId("id_btnAdd"),
                    oRes = this.byId("id_btnReset"),

                    oid_OrgUnit = this.byId("id_OrgUnit"),
                    oid_OrgSub = this.byId("id_OrgSub"),
                    oid_Orgeh = this.byId("id_Orgeh"),
                    oid_OrgSu = this.byId("id_Orgsu"),
                    oid_Persa = this.byId("id_Persa"),
                    oid_Btrtl = this.byId("id_Btrtl");

                oPernr.setValue(null);
                oEdate.setValue(null);
                chgart.setValue(null);
                oSubst.setValue(null);
                oSubem.setValue(null);
                oRmrks.setValue(null);

                oid_OrgUnit.setText(null);
                oid_Orgeh.setText(null);
                oid_OrgSub.setText(null);
                oid_OrgSu.setText(null);
                oid_Persa.setText(null);
                oid_Btrtl.setText(null);

                oAdd.setText("Add");
                oAdd.setIcon("sap-icon://add");
                oRes.setText("Reset");
                oRes.setIcon("sap-icon://reset");
                try {
                    oPernr.setEditable(true);
                } catch (err) {
                    oPernr.setEnabled(true);
                };

                var oFree = [];
                var oListModel = this.byId("id_splRequestTable").getModel("chgList");
                oListModel.setData({
                    data: oFree
                });

                oCheckArr = [];

            },

            onAdd: function () {
                if (!this.chgValidation()) {
                    return false;
                } else {

                    var lvPernr = this.byId("id_Pernr").getValue(),
                        lvEdate = this.byId("id_Edate").mProperties.dateValue,
                        lvEdatex = this.byId("id_Edate").getValue(),
                        lvVtart = this.getView().byId("id_Vtart").getSelectedKey(),
                        lvVtext = this.getView().byId("id_Vtart")._getSelectedItemText(),
                        lvSubst = this.getView().byId("id_Subst").getSelectedKey(),
                        lvStext = this.getView().byId("id_Subst")._getSelectedItemText(),
                        lvSubem = this.byId("id_Subem").getValue(),
                        lvRmrks = this.byId("id_Rmrks").getValue(),
                        lvOrgeh = this.byId("id_Orgeh").getText(),
                        lvOrgsu = this.byId("id_Orgsu").getText(),
                        lvPersa = this.byId("id_Persa").getText(),
                        lvBtrtl = this.byId("id_Btrtl").getText(),
                        oEntry = {};

                    lvEdate.setDate(lvEdate.getDate() + 1);

                    oEntry.Zzpernr = lvPernr;
                    oEntry.Zzedate = lvEdate;
                    oEntry.Zzvtart = lvVtart;
                    oEntry.Zzvtext = lvVtext;
                    oEntry.Zzsubst = lvSubst;
                    oEntry.ZzsubstTxt = lvStext;
                    oEntry.Zzsubem = lvSubem;
                    oEntry.Zzrmrks = lvRmrks;
                    oEntry.Zzorgeh = lvOrgeh;
                    oEntry.Zzorgsu = lvOrgsu;
                    oEntry.Zzpersa = lvPersa;
                    oEntry.Zzbtrtl = lvBtrtl;

                    var oModel = this.byId("id_splRequestTable").getModel("chgList"),
                        oData = oModel.getProperty("/data");


                    if (this.byId("id_btnAdd").getText() === "Add") {
                        var that = this;

                        if (oCheckArr.includes(lvPernr + lvEdatex) === true) {
                            MessageBox.error("Duplicate data pernr and substitution date");
                            return;
                        }

                        this._oBusy.open();
                        this.oModel.create("/zhr_ecshift_iSet", oEntry,
                            {
                                async: false,
                                success: function (eData, a) {
                                    if (eData.Status === "S") {
                                        // Clean up the oData from __metadata attribute
                                        delete eData.__metadata;
                                        var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "KK:mm:ss a" });
                                        // timezoneOffset is in hours convert to milliseconds
                                        var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                                        eData.FreeText = timeFormat.format(new Date(eData.Zzbegzt.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzendzt.ms + TZOffsetMs)));
                                        eData.Msg = timeFormat.format(new Date(eData.Zzsubeg.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzsuend.ms + TZOffsetMs)));
                                        if (typeof oData !== "undefined" && oData !== null && oData.length > 0) {
                                            oData.push(eData);
                                        } else {
                                            oData = [];
                                            oData.push(eData);
                                        }
                                        oModel.setData({
                                            data: oData
                                        });

                                        oCheckArr.push(eData.Zzpernr + lvEdatex);
                                        that._oBusy.close();
                                        that._reset();

                                    } else {
                                        lvEdate.setDate(lvEdate.getDate() - 1);
                                        that._oBusy.close();
                                        MessageBox.error(eData.Msg);
                                    }

                                },
                                error: function (e) {
                                    lvEdate.setDate(lvEdate.getDate() - 1);
                                    that._oBusy.close();
                                    MessageBox.error(e.message);
                                }
                            });
                    } else {
                        var thats = this;
                        var xPath = this._sPath,
                            i = parseInt(xPath.substring(xPath.lastIndexOf('/') + 1), 10);

                        if (oCheckArr[i] !== lvPernr + lvEdatex) {
                            if (oCheckArr.includes(lvPernr + lvEdatex) === true) {
                                MessageBox.error("Duplicate data pernr and substitution date");
                                return;
                            }
                        }

                        this._oBusy.open();
                        this.oModel.create("/zhr_ecshift_iSet", oEntry,
                            {
                                async: false,
                                success: function (eData, y) {
                                    if (eData.Status === "S") {
                                        thats._oBusy.close();
                                        // Clean up the oData from __metadata attribute
                                        delete eData.__metadata;
                                        var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "KK:mm:ss a" });
                                        // timezoneOffset is in hours convert to milliseconds
                                        var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                                        eData.FreeText = timeFormat.format(new Date(eData.Zzbegzt.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzendzt.ms + TZOffsetMs)));
                                        eData.Msg = timeFormat.format(new Date(eData.Zzsubeg.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzsuend.ms + TZOffsetMs)));
                                        oModel.setProperty(xPath, eData);

                                        oCheckArr.splice(i, 1);
                                        oCheckArr.push(eData.Zzpernr + lvEdatex);

                                        oModel.refresh();
                                        thats._reset();
                                    } else {
                                        lvEdate.setDate(lvEdate.getDate() - 1);
                                        thats._oBusy.close();
                                        MessageBox.error(eData.Msg);
                                    }

                                },
                                error: function (e) {
                                    lvEdate.setDate(lvEdate.getDate() - 1);
                                    thats._oBusy.close();
                                    MessageBox.error(e.message);
                                }
                            });

                    }
                }
            },

            chgValidation: function () {
                var isValid = true,
                    lvPernr = this.byId("id_Pernr"),
                    lvEdate = this.byId("id_Edate"),
                    lvVtart = this.byId("id_Vtart"),
                    lvSubst = this.byId("id_Subst");

                if (!lvPernr.getValue()) {
                    isValid = false;
                    MessageBox.error("Please Fill Employee");
                    return isValid;
                    // lvPernr.setValueStateText("Please Fill Employee");
                    // lvPernr.setValueState(sap.ui.core.ValueState.Error);
                } else {
                    // lvPernr.setValueState(sap.ui.core.ValueState.None);
                }

                if (!lvEdate.getValue()) {
                    isValid = false;
                    MessageBox.error("Enter Substitution Date");
                    return isValid;
                }

                if (!lvVtart.getSelectedKey()) {
                    if (!lvVtart.getValue()) {
                        isValid = false;
                        MessageBox.error("Please Fill Substitution Type");
                        return isValid;
                    }
                }

                if (!lvSubst.getSelectedKey()) {
                    if (!lvSubst.getValue()) {
                        isValid = false;
                        MessageBox.error("Please Fill DWS Substitution");
                        return isValid;
                    }
                }

                return isValid;
            },

            onSubmit: function (oEvent) {
                var oListModel = this.byId("id_splRequestTable").getModel("chgList"),
                    oListData = oListModel.getProperty("/data"),
                    oBtn = oEvent.oSource.mProperties.text,
                    oAction,
                    oZzdstat,
                    oZzdstattext,
                    that = this;

                if (oBtn === 'Submit') {
                    oAction = 'CR';
                    oZzdstat = '1';
                    oZzdstattext = 'Posted to Approver 1';


                } else {
                    oAction = 'SV';
                    oZzdstat = '0';
                    oZzdstattext = 'Draft';
                }

                var oModel = new JSONModel({
                    Action: oAction,
                    Zzdstat: oZzdstat,
                    ZzdstatText: oZzdstattext,
                    Zzorgeh: this.getView().getModel("headerArray").getData().Zzorgeh,
                    Zzorget: this.getView().getModel("headerArray").getData().Zzorget,
                    Zzorgsu: this.getView().getModel("headerArray").getData().Zzorgsu,
                    Zzorgst: this.getView().getModel("headerArray").getData().Zzorgst,
                    Zzpersa: this.getView().getModel("headerArray").getData().Zzpersa,
                    Zzbtrtl: this.getView().getModel("headerArray").getData().Zzbtrtl,

                    ChgHeader_to_ChgItem: [],
                    ChgHeader_to_ChgAttach: []
                }),
                    oData = oModel.getProperty("/ChgHeader_to_ChgItem");

                for (var i = 0; i < oListData.length; i++) {
                    var chgItem = {
                        Zzpernr: oListData[i].Zzpernr,
                        ZzpernrName: oListData[i].ZzpernrName,
                        Zzedate: oListData[i].Zzedate,
                        Zzvtart: oListData[i].Zzvtart,
                        Zzvtext: oListData[i].Zzvtext,
                        Zzsubst: oListData[i].Zzsubst,
                        ZzsubstTxt: oListData[i].ZzsubstTxt,
                        Zzsubem: oListData[i].Zzsubem,
                        Zzsubna: oListData[i].Zzsubna,
                        Zzrmrks: oListData[i].Zzrmrks,

                        Zztprog: oListData[i].Zztprog,
                        ZztprogTxt: oListData[i].ZztprogTxt,
                        Zzbegzt: oListData[i].Zzbegzt,
                        Zzendzt: oListData[i].Zzendzt,
                        Zzsubeg: oListData[i].Zzsubeg,
                        Zzsuend: oListData[i].Zzsuend,

                        Zzbgjob: '0',
                        Zzestat: oZzdstat,
                        ZzestatTxt: oZzdstattext,
                        ZzestatTmp: 'X'

                    };
                    oData.push(chgItem);
                }
                if (typeof chgItem === "undefined") {
                    MessageBox.error('Please Fill Item');

                } else {

                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Do you want to " + oBtn + " this data?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Yes",
                            press: function () {
                                this._oBusy.open();
                                this.oModel.create("/zhr_ecshift_hSet", oModel.getData(), {
                                    async: false,
                                    success: function (eData, a) {
                                        if (eData.Status === "S") {
                                            that._oBusy.close();
                                            var oMsg = "Document ID " + eData.Zzdocid + " was created as " + eData.ZzdstatText;

                                            MessageBox.success(oMsg, {
                                                onClose: function (oAction) {
                                                    var oEventBus = sap.ui.getCore().getEventBus();
                                                    oEventBus.publish("root", "update", "refresh");

                                                    var oEventBusi = sap.ui.getCore().getEventBus();
                                                    oEventBusi.publish("rooti", "update", "refresh");

                                                    var r = that.getOwnerComponent().getRouter();
                                                    r.navTo("RouteMainECShift");
                                                    that._resetAll();
                                                }
                                            });

                                        } else {
                                            that._oBusy.close();
                                            MessageBox.error(eData.Msg);

                                        }

                                    },
                                    error: function (e) {
                                        that._oBusy.close();
                                        MessageBox.error(e.message);
                                    }
                                });
                                this.oApproveDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "No",
                            press: function () {
                                this.oApproveDialog.close();
                            }.bind(this)
                        })
                    });
                }
                this.oApproveDialog.open();
            },

            onItemPressed: function (oEvent) {
                var oCtx = oEvent.getParameter("listItem").getBindingContext("chgList"),
                    oModel = oCtx.getModel("chgList"),
                    sPath = oCtx.getPath();
                this._sPath = sPath;
                this._reset();

                var oPernr = this.byId("id_Pernr"),
                    oVtart = this.byId("id_Vtart"),
                    oEdate = this.byId("id_Edate"),
                    oSubst = this.byId("id_Subst"),
                    oSubem = this.byId("id_Subem"),
                    oRmrks = this.byId("id_Rmrks"),
                    oAdd = this.byId("id_btnAdd"),
                    oRes = this.byId("id_btnReset");

                var oDay = oModel.getProperty(sPath + "/Zzedate"),
                    dd = oDay.getDate(),
                    mm = oDay.getMonth() + 1, //January is 0!
                    yyyy = oDay.getFullYear(),
                    oDay1 = (dd + '.' + mm + '.' + yyyy);

                oPernr.setValue(oModel.getProperty(sPath + "/Zzpernr"));
                oVtart.setSelectedKey(oModel.getProperty(sPath + "/Zzvtart"));
                oVtart.setValue(oModel.getProperty(sPath + "/Zzvtext"));
                oEdate.setValue(oDay1);
                oSubst.setSelectedKey(oModel.getProperty(sPath + "/Zzsubst"));
                oSubem.setValue(oModel.getProperty(sPath + "/Zzsubem"));
                oRmrks.setValue(oModel.getProperty(sPath + "/Zzrmrks"));
                oAdd.setText("Update");
                oAdd.setIcon("sap-icon://edit");
                oRes.setText("Cancel");
                oRes.setIcon("sap-icon://cancel");
                try {
                    oPernr.setEditable(false);
                } catch (err) {
                    oPernr.setEnabled(false);
                }
            },

            onItemDeleted: function (oEvent) {
                var oCtx = oEvent.getParameter("listItem").getBindingContext("chgList"),
                    oModel = oCtx.getModel("chgList"),
                    oData = oModel.getProperty("/data"),
                    sPath = oCtx.getPath(),
                    i = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1), 10);
                oCheckArr.splice(i, 1);
                oData.splice(i, 1);
                oModel.setData({ data: oData });
                this._reset();
            },

            isValidDate: function(date) {
                var temp = date.split('/');
                var d = new Date(temp[2] + '/' + temp[0] + '/' + temp[1]);
                return (d && (d.getMonth() + 1) == temp[0] && d.getDate() == Number(temp[1]) && d.getFullYear() == Number(temp[2]));
            },

            onPaste: function (oEvent) {
                var aData = oEvent.getParameter("data"),
                    lvOrgeh = this.byId("id_Orgeh").getText(),
                    lvOrgsu = this.byId("id_Orgsu").getText(),
                    lvPersa = this.byId("id_Persa").getText(),
                    lvBtrtl = this.byId("id_Btrtl").getText(),
                    lv_break,
                    oNol = '0';

                var oModel = this.byId("id_splRequestTable").getModel("chgList"),
                    oData = oModel.getProperty("/data");

                for (var i = 0; i < aData.length; i++) {

                    if (lv_break === 'X') {
                        break;
                    }

                    var lvLine = i + 1,
                        lvPernr = aData[i][0],
                        lvEdate = aData[i][1],
                        lvVtart = aData[i][2],
                        lvSubst = aData[i][3],
                        lvSubem = aData[i][4],
                        lvRmrks = aData[i][5],

                        oEntry = {};

                    var d = lvEdate.substring(0, 2),
                        m = lvEdate.substring(3, 5),
                        y = lvEdate.substring(6, 10);

                    var oDate = new Date(y + '-' + m + '-' + d),
                    oDate2 = m.concat("/", d, "/", y);

                    oEntry.Zzpernr = lvPernr;
                    oEntry.Zzvtart = lvVtart;
                    oEntry.Zzedate = oDate;
                    oEntry.Zzsubst = lvSubst;
                    oEntry.Zzsubem = lvSubem;
                    oEntry.Zzrmrks = lvRmrks;
                    oEntry.Zzorgeh = lvOrgeh;
                    oEntry.Zzorgsu = lvOrgsu;
                    oEntry.Zzpersa = lvPersa;
                    oEntry.Zzbtrtl = lvBtrtl;
                    oEntry.FreeText = lvLine.toString();

                    let isValidDate = this.isValidDate(oDate2);

                    if (oEntry.Zzpernr === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Employee at Line " + lvLine);
                    } else if (oEntry.Zzvtart === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Substitution Type at Line " + lvLine);
                    } else if (lvEdate === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Substitution Date at Line " + lvLine);
                    } else if (oEntry.Zzsubst === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill DWS Substitution at Line " + lvLine);
                    } else if (isValidDate === false) {
                        lv_break = 'X';
                        MessageBox.error("Invalid Date at Line " + lvLine);
                    } else {

                        if (lv_break !== 'X') {
                            var that = this;
                            this._oBusy.open();
                            this.oModel.create("/zhr_ecshift_iSet", oEntry,
                                {
                                    async: false,
                                    success: function (eData, a) {
                                        if (lv_break !== 'X') {
                                            if (eData.Status === "S") {
                                                // Clean up the oData from __metadata attribute
                                                delete eData.__metadata;

                                                var oDay = eData.Zzedate,
                                                    dd = oDay.getDate(),
                                                    mm = oDay.getMonth() + 1, //January is 0!
                                                    bulan = mm.toString(),
                                                    yyyy = oDay.getFullYear();
                                                if (bulan.length === 1) {
                                                    bulan = oNol.concat(mm);
                                                }
                                                var oDay1 = (dd + '.' + bulan + '.' + yyyy);

                                                if (oCheckArr.includes(eData.Zzpernr + oDay1) === true) {
                                                    MessageBox.error("Duplicate data pernr and substitution date");
                                                    lv_break = 'X';
                                                } else {
                                                    oCheckArr.push(eData.Zzpernr + oDay1);

                                                    var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "KK:mm:ss a" });
                                                    // timezoneOffset is in hours convert to milliseconds
                                                    var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                                                    eData.FreeText = timeFormat.format(new Date(eData.Zzbegzt.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzendzt.ms + TZOffsetMs)));
                                                    eData.Msg = timeFormat.format(new Date(eData.Zzsubeg.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzsuend.ms + TZOffsetMs)));
                                                    if (typeof oData !== "undefined" && oData !== null && oData.length > 0) {
                                                        oData.push(eData);
                                                    } else {
                                                        oData = [];
                                                        oData.push(eData);
                                                    }

                                                    oModel.setData({
                                                        data: oData
                                                    });
                                                }

                                                that._oBusy.close();
                                            } else {
                                                var lvMsg = eData.Msg + " at Line " + eData.FreeText;
                                                MessageBox.error(lvMsg);
                                                lv_break = 'X';
                                                that._oBusy.close();
                                            }
                                        } else {
                                            that._oBusy.close();
                                        }

                                    },
                                    error: function (e) {
                                        if (lv_break !== 'X') {
                                            MessageBox.error(e.message);
                                            lv_break = 'X';
                                            that._oBusy.close();
                                        }
                                    }
                                });
                        }
                    }
                }
            }
        });
    });

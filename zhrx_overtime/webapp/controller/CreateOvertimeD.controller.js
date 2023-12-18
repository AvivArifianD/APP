sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
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
    function (Controller, MessageToast, JSONModel, Fragment, Filter, FilterOperator, MessageBox, Dialog, Button, mobileLibrary, Text) {
        "use strict";

        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("com.zhrxovertime.zhrxovertime.controller.CreateOvertimeD", {
            // formatter: f,
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.byId("id_AttachTable").setModel(new JSONModel(), "ovtListAttach");

                this._oBusy = new sap.m.BusyDialog();
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("CreateOvertimeD")
                    .attachPatternMatched(this._onRouteMatched, this);
                this.byId("id_splRequestTable").setModel(new JSONModel(), "ovtList");
                this.byId("id_Compt").setModel(new JSONModel(), "Zzcompt");

            },

            _onRouteMatched: function (oEvent) {
                var oModel = new JSONModel();
                // read params from routing
                var headerArray = JSON.parse(decodeURIComponent(oEvent.getParameter("arguments").data));
                headerArray.Zzedate = new Date(headerArray.Zzedate);
                oModel.setData(headerArray);
                this.getView().setModel(oModel, "headerArray");
            },

            onBackPress: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CreateOvertimeH");
                this._resetAll();

            },

            //Pernr
            onValueHelpRequestPer: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();

                if (!this._pValueHelpDialogPer) {
                    this._pValueHelpDialogPer = Fragment.load({
                        id: oView.getId(),
                        name: "com.zhrxovertime.zhrxovertime.view.fragment.ValueHelpDialogPer",
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


                var oPernr = this.getView().byId("id_Pernr").getValue();
                var oFilter = new Array(); // Don't normally do this but just for the example.
                var lo_pickedDateFilter = new sap.ui.model.Filter({
                    path: 'Zzpernr',
                    operator: FilterOperator.EQ,
                    value1: oPernr
                });
                oFilter.push(lo_pickedDateFilter);

                var lvEdate = this.formatoDataString(this.getView().getModel("headerArray").getData().Zzedate);

                lo_pickedDateFilter = new sap.ui.model.Filter({
                    path: 'Zzedate',
                    operator: FilterOperator.EQ,
                    value1: lvEdate
                });
                oFilter.push(lo_pickedDateFilter);

                var sPath = "/zhr_ovtime_zcomptSet";
                var oModelZzcompt = this.byId("id_Compt").getModel("Zzcompt");
                this.oModel.read(sPath, {
                    filters: oFilter,
                    async: false,
                    success: function (oData, response) {
                        oModelZzcompt.setData({
                            data: oData.results
                        });
                    },
                    error: function (oError) {
                        if (oError) {
                            if (oError.responseText) {
                                var oErrorMessage = JSON.parse(oError.responseText);
                            }
                        }

                    }
                });

            },

            onPernrChg: function (oEvent) {
                var oPernr = this.getView().byId("id_Pernr").getValue();
                var oFilter = new Array(); // Don't normally do this but just for the example.
                var lo_pickedDateFilter = new sap.ui.model.Filter({
                    path: 'Zzpernr',
                    operator: FilterOperator.EQ,
                    value1: oPernr
                });
                oFilter.push(lo_pickedDateFilter);

                var lvEdate = this.formatoDataString(this.getView().getModel("headerArray").getData().Zzedate);

                lo_pickedDateFilter = new sap.ui.model.Filter({
                    path: 'Zzedate',
                    operator: FilterOperator.EQ,
                    value1: lvEdate
                });
                oFilter.push(lo_pickedDateFilter);

                var sPath = "/zhr_ovtime_zcomptSet";
                var oModelZzcompt = this.byId("id_Compt").getModel("Zzcompt");
                this.oModel.read(sPath, {
                    filters: oFilter,
                    async: false,
                    success: function (oData, response) {
                        oModelZzcompt.setData({
                            data: oData.results
                        });
                    },
                    error: function (oError) {
                        if (oError) {
                            if (oError.responseText) {
                                var oErrorMessage = JSON.parse(oError.responseText);
                            }
                        }

                    }
                });
            },

            onTimesChgB: function (oEvent) {
                var oTimesBeg = this.getView().byId("id_Otbeg").getValue(),
                    oTimesBegSub = oTimesBeg.substring(3, 5),
                    oOtbeg = this.byId("id_Otbeg");

                // var oVarTimes = oEvent.getParameters().id.substring(82, 87);
                // var oVarTimes = oEvent.getParameters().id.substring(70, 75);

                if (oTimesBegSub !== '00' && oTimesBegSub !== '30') {
                    MessageBox.error('Only multiples of 30 minutes can be submitted');
                    oOtbeg.setValue(null);
                }

            },

            onTimesChgE: function (oEvent) {
                var oTimesEnd = this.getView().byId("id_Otend").getValue(),
                    oTimesEndSub = oTimesEnd.substring(3, 5),
                    oOtend = this.byId("id_Otend");

                if (oTimesEndSub !== '00' && oTimesEndSub !== '30') {
                    MessageBox.error('Only multiples of 30 minutes can be submitted');
                    oOtend.setValue(null);
                }
            },

            onReset: function () {
                this._reset();
            },

            _reset: function () {
                var oPernr = this.byId("id_Pernr"),
                    oAwart = this.byId("id_Awart"),
                    oCompt = this.byId("id_Compt"),
                    oOtbeg = this.byId("id_Otbeg"),
                    oOtend = this.byId("id_Otend"),
                    oRmrks = this.byId("id_Rmrks"),
                    oAdd = this.byId("id_btnAdd"),
                    oRes = this.byId("id_btnReset"),
                    oAtta = this.byId("id_Attach");
                oPernr.setValue(null);
                oAwart.setValue(null);
                oCompt.setValue(null);
                oOtbeg.setValue(null);
                oOtend.setValue(null);
                oRmrks.setValue(null);
                oAtta.setValue(null);
                oAdd.setText("Add");
                oAdd.setIcon("sap-icon://add");
                oRes.setText("Reset");
                oRes.setIcon("sap-icon://reset");
                try {
                    oPernr.setEditable(true);
                } catch (err) {
                    oPernr.setEnabled(true);
                };

                var oModel = this.byId("id_Compt").getModel("Zzcompt");         //Get Hold of the Model
                oModel.setData(null);     //Set the model data to blank / null
            },

            _resetAll: function () {
                var oPernr = this.byId("id_Pernr"),
                    oAwart = this.byId("id_Awart"),
                    oCompt = this.byId("id_Compt"),
                    oKostl = this.byId("id_Kostl"),
                    oOtbeg = this.byId("id_Otbeg"),
                    oOtend = this.byId("id_Otend"),
                    oRmrks = this.byId("id_Rmrks"),
                    oAdd = this.byId("id_btnAdd"),
                    oRes = this.byId("id_btnReset"),
                    oAtta = this.byId("id_Attach"),

                    oid_OrgUnit = this.byId("id_OrgUnit"),
                    oid_Orgeh = this.byId("id_Orgeh"),
                    oid_Date = this.byId("id_Date"),
                    oid_Edate = this.byId("id_Edate"),
                    oid_OtypeDesc = this.byId("id_OtypeDesc"),
                    oid_Otype = this.byId("id_Otype");

                oPernr.setValue(null);
                oAwart.setValue(null);
                oCompt.setValue(null);
                oKostl.setValue(null);
                oOtbeg.setValue(null);
                oOtend.setValue(null);
                oRmrks.setValue(null);
                oAtta.setValue(null);

                oid_OrgUnit.setText(null);
                oid_Orgeh.setText(null);
                oid_Date.setText(null);
                oid_Edate.setText(null);
                oid_OtypeDesc.setText(null);
                oid_Otype.setText(null);

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
                var oListModel = this.byId("id_splRequestTable").getModel("ovtList");
                oListModel.setData({
                    data: oFree
                });

                var oListModelAttach = this.byId("id_AttachTable").getModel("ovtListAttach");
                oListModelAttach.setData({
                    data: oFree
                });
            },

            ovtValidation: function () {
                var isValid = true,
                    lvPernr = this.byId("id_Pernr"),
                    lvAwart = this.byId("id_Awart"),
                    lvCompt = this.byId("id_Compt"),
                    lvOtbeg = this.byId("id_Otbeg"),
                    lvOtend = this.byId("id_Otend");

                if (!lvPernr.getValue()) {
                    isValid = false;
                    MessageBox.error("Please Fill Employee");
                    return isValid;
                }

                // if (!lvAwart.getSelectedKey()) {
                if (!lvAwart.getValue()) {
                    isValid = false;
                    MessageBox.error("Please Fill Overtime Reason Code");
                    return isValid;
                }
                // }

                // if (!lvCompt.getSelectedKey()) {
                if (!lvCompt.getValue()) {
                    isValid = false;
                    MessageBox.error("Please Fill Compensation Type");
                    return isValid;
                }
                // }

                if (!lvOtbeg.getValue()) {
                    isValid = false;
                    MessageBox.error("Please Fill Start Time");
                    return isValid;
                }

                if (!lvOtend.getValue()) {
                    isValid = false;
                    MessageBox.error("Please Fill End Time");
                    return isValid;
                }
                return isValid;
            },

            onAdd: function (oEvent) {
                if (!this.ovtValidation()) {
                    return false;

                } else {
                    var lvPernr = this.byId("id_Pernr").getValue(),
                        lvAwart = this.getView().byId("id_Awart").getSelectedKey(),
                        lvAtext = this.getView().byId("id_Awart")._getSelectedItemText(),
                        lvCompt = this.getView().byId("id_Compt").getValue(),
                        lvKostl = this.getView().byId("id_Kostl").getSelectedKey(),
                        lvKostlTxt = this.getView().byId("id_Kostl")._getSelectedItemText(),
                        lvOtbeg = this.byId("id_Otbeg").getValue(),
                        lvOtend = this.byId("id_Otend").getValue(),
                        lvRmrks = this.byId("id_Rmrks").getValue(),
                        lvOrgeh = this.byId("id_Orgeh").getText(),
                        lvEdate = this.getView().getModel("headerArray").getData().Zzedate,
                        oOtbegTmp,
                        oOtendTmp,
                        oText = this.getView().byId("id_colAkumtxt"),
                        oTextW = this.getView().byId("id_colAkumWtxt"),

                        oEntry = {};

                    if (lvAwart === '') {
                        lvAwart = this.getView().byId("id_Awart").getValue();
                    }

                    if (lvCompt === '') {
                        lvCompt = this.getView().byId("id_Compt").getValue();
                    }

                    if (lvKostl === '') {
                        lvKostl = this.getView().byId("id_Kostl").getValue();
                    }

                    if (lvOtbeg.substring(9, 11) === "PM") {
                        oOtbegTmp = parseInt(lvOtbeg.substring(0, 2)) + 12;
                    } else {
                        oOtbegTmp = lvOtbeg.substring(0, 2);
                    }

                    if (lvOtend.substring(9, 11) === "PM") {
                        oOtendTmp = parseInt(lvOtend.substring(0, 2)) + 12;
                    } else {
                        oOtendTmp = lvOtend.substring(0, 2);
                    }

                    oEntry.Zzpernr = lvPernr;
                    oEntry.Zzawart = lvAwart;
                    oEntry.Zzatext = lvAtext;
                    oEntry.Zzcompt = lvCompt;
                    oEntry.Zzkostl = lvKostl;
                    oEntry.ZzkostlTxt = lvKostlTxt;
                    oEntry.Zzotbeg = "PT".concat(oOtbegTmp, "H", lvOtbeg.substring(3, 5), "M00S");
                    oEntry.Zzotend = "PT".concat(oOtendTmp, "H", lvOtend.substring(3, 5), "M00S");
                    oEntry.Zzrmrks = lvRmrks;
                    oEntry.Zzorgeh = lvOrgeh;
                    oEntry.Zzedate = lvEdate;

                    var oModel = this.byId("id_splRequestTable").getModel("ovtList"),
                        oData = oModel.getProperty("/data");

                    if (oEntry.Zzpernr !== "" &&
                        oEntry.Zzawart !== "" &&
                        oEntry.Zzcompt !== "" &&
                        oEntry.Zzotbeg !== "" &&
                        oEntry.Zzotend !== ""
                    ) {
                        if (this.byId("id_btnAdd").getText() === "Add") {
                            var that = this;
                            this._oBusy.open();
                            this.oModel.create("/zhr_ovtime_iSet", oEntry,
                                {
                                    async: false,
                                    success: function (eData, a) {
                                        if (eData.Status === "S") {
                                            // Clean up the oData from __metadata attribute
                                            delete eData.__metadata;
                                            var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "KK:mm:ss a" });
                                            // timezoneOffset is in hours convert to milliseconds
                                            var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                                            eData.FreeText2 = timeFormat.format(new Date(eData.Zzotbeg.ms + TZOffsetMs));
                                            eData.FreeText3 = timeFormat.format(new Date(eData.Zzotend.ms + TZOffsetMs));
                                            eData.Msg = timeFormat.format(new Date(eData.Zzbegzt.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzendzt.ms + TZOffsetMs)));

                                            if (eData.Flag === 'X') {
                                                oText.setText("Accumulation Monthly Group");
                                                oTextW.setText("Accumulation Weekly Group");
                                            } else {
                                                oText.setText("Accumulation Monthly Individual");
                                                oTextW.setText("Accumulation Weekly Individual");
                                            }

                                            var oQinacOri_d = 0,
                                                oQinacOri_w = 0,
                                                oQinacOri = 0,

                                                oQinacTmp_d = 0,
                                                oQinacTmp_w = 0,
                                                oQinacTmp = 0,

                                                oOthrsTmp = 0,

                                                oOthrsOri = 0,

                                                oQinacFinal_d = 0,
                                                oQinacFinal_w = 0,
                                                oQinacFinal = 0;

                                            oQinacOri_d = parseFloat(eData.ZzqinacDay);
                                            oQinacOri_w = parseFloat(eData.ZzqinacWeek);
                                            oQinacOri = parseFloat(eData.Zzqinac);

                                            oOthrsOri = parseFloat(eData.Zzothrs);

                                            if (eData.Flag === 'X') { //Group
                                                if (typeof oData !== "undefined") {
                                                    for (var i = 0; i < oData.length; i++) {
                                                        oOthrsTmp = parseFloat(oData[i].Zzothrs);

                                                        oQinacTmp = parseFloat(oQinacTmp + oOthrsTmp);
                                                        oQinacTmp_d = parseFloat(oQinacTmp_d + oOthrsTmp);
                                                        oQinacTmp_w = parseFloat(oQinacTmp_w + oOthrsTmp);
                                                    }
                                                }

                                            } else { //individual
                                                if (typeof oData !== "undefined") {
                                                    for (var i = 0; i < oData.length; i++) {
                                                        if (oData[i].Zzpernr === lvPernr) {
                                                            oOthrsTmp = parseFloat(oData[i].Zzothrs);

                                                            oQinacTmp = parseFloat(oQinacTmp + oOthrsTmp);
                                                            oQinacTmp_d = parseFloat(oQinacTmp_d + oOthrsTmp);
                                                            oQinacTmp_w = parseFloat(oQinacTmp_w + oOthrsTmp);
                                                        }
                                                    }
                                                }
                                            }

                                            oQinacFinal_d = parseFloat(oQinacOri_d + oQinacTmp_d + oOthrsOri);
                                            oQinacFinal_w = parseFloat(oQinacOri_w + oQinacTmp_w + oOthrsOri);
                                            oQinacFinal = parseFloat(oQinacOri + oQinacTmp + oOthrsOri);

                                            eData.ZzqinacDay = oQinacFinal_d;
                                            eData.ZzqinacWeek = oQinacFinal_w;
                                            eData.Zzqinac = oQinacFinal;

                                            if (typeof oData !== "undefined" && oData !== null && oData.length > 0) {
                                                oData.push(eData);
                                            } else {
                                                oData = [];
                                                oData.push(eData);
                                            }
                                            oModel.setData({
                                                data: oData
                                            });

                                            that._oBusy.close();
                                            if (eData.Indicator === 'X') {
                                                MessageBox.information(eData.FreeText);
                                            }
                                            eData.FreeText = '';
                                            that._reset();
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
                        } else {
                            var thats = this,
                                xPath = this._sPath;

                            this._oBusy.open();
                            this.oModel.create("/zhr_ovtime_iSet", oEntry,
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
                                            eData.FreeText2 = timeFormat.format(new Date(eData.Zzotbeg.ms + TZOffsetMs));
                                            eData.FreeText3 = timeFormat.format(new Date(eData.Zzotend.ms + TZOffsetMs));
                                            eData.Msg = timeFormat.format(new Date(eData.Zzbegzt.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzendzt.ms + TZOffsetMs)));

                                            if (eData.Flag === 'X') {
                                                oText.setText("Accumulation Monthly Group");
                                            } else {
                                                oText.setText("Accumulation Monthly Individual");
                                            }

                                            var oQinacOri_d = 0,
                                                oQinacOri_w = 0,
                                                oQinacOri = 0,

                                                oOthrsOri = 0,
                                                oOthrsTmp = 0,
                                                oOthrsTmpData = 0,
                                                ItemTmp = {},
                                                ItemTmpArr = [],
                                                oDataTmp = [],
                                                oPath = parseInt(xPath.substring(xPath.lastIndexOf('/') + 1), 10);

                                            oQinacOri_d = parseFloat(eData.ZzqinacDay);
                                            oQinacOri_w = parseFloat(eData.ZzqinacWeek);
                                            oQinacOri = parseFloat(eData.Zzqinac);

                                            oOthrsOri = parseFloat(eData.Zzothrs);

                                            if (eData.Flag === 'X') { //group
                                                if (typeof oData !== "undefined") {
                                                    for (var i = 0; i < oData.length; i++) {
                                                        ItemTmp = {};
                                                        oOthrsTmpData = parseFloat(oData[i].Zzothrs);

                                                        //jika index looping lebih kecil dari index yang di edit
                                                        if (i < oPath) {
                                                            oOthrsTmp = parseFloat(oOthrsTmp + oOthrsTmpData);
                                                            oDataTmp.push(oData[i]);

                                                            //jika index looping lebih besar sama dengan index yang di edit
                                                        } else {
                                                            //jika index looping sama dengan index yang di edit
                                                            if (i === oPath) {
                                                                oOthrsTmp = parseFloat(oOthrsTmp + oOthrsOri);
                                                                eData.ZzqinacDay = parseFloat(oOthrsTmp + oQinacOri_d);
                                                                eData.ZzqinacWeek = parseFloat(oOthrsTmp + oQinacOri_w);
                                                                eData.Zzqinac = parseFloat(oOthrsTmp + oQinacOri);
                                                                oDataTmp.push(eData);

                                                                //jika index looping lebih besar dari index yang di edit
                                                            } else {
                                                                oOthrsTmp = parseFloat(oOthrsTmp + oOthrsTmpData);
                                                                oData[i].ZzqinacDay = parseFloat(oOthrsTmp + oQinacOri_d);
                                                                oData[i].ZzqinacWeek = parseFloat(oOthrsTmp + oQinacOri_w);
                                                                oData[i].Zzqinac = parseFloat(oOthrsTmp + oQinacOri);
                                                                oDataTmp.push(oData[i]);
                                                            }
                                                        }
                                                    }
                                                }

                                            } else { //individual
                                                if (typeof oData !== "undefined") {
                                                    for (var i = 0; i < oData.length; i++) {
                                                        ItemTmp = {};
                                                        oOthrsTmpData = parseFloat(oData[i].Zzothrs);

                                                        var names = ItemTmpArr.map(el => el.Zzpernr),
                                                            oIdx = names.indexOf(oData[i].Zzpernr);

                                                        //jika index looping lebih kecil dari index yang di edit
                                                        if (i < oPath) {
                                                            //tambah total othrs per pernr
                                                            if (oIdx >= 0) {
                                                                oOthrsTmp = parseFloat(ItemTmpArr[oIdx].Zzothrs);
                                                                ItemTmpArr[oIdx].Zzothrs = parseFloat(oOthrsTmp + oOthrsTmpData);
                                                            } else {
                                                                ItemTmp = {
                                                                    Zzpernr: oData[i].Zzpernr,
                                                                    Zzothrs: oData[i].Zzothrs
                                                                }
                                                                ItemTmpArr.push(ItemTmp);
                                                            }
                                                            oDataTmp.push(oData[i]);

                                                            //jika index looping lebih besar sama dengan index yang di edit
                                                        } else {
                                                            //jika index looping sama dengan index yang di edit
                                                            if (i === oPath) {
                                                                //cek apakah ada di table tampungan total othrs
                                                                if (oIdx >= 0) {
                                                                    oOthrsTmp = parseFloat(ItemTmpArr[oIdx].Zzothrs);
                                                                    ItemTmpArr[oIdx].Zzothrs = parseFloat(oOthrsTmp + oOthrsOri);
                                                                    oOthrsTmp = parseFloat(ItemTmpArr[oIdx].Zzothrs);
                                                                    eData.ZzqinacDay = parseFloat(oOthrsTmp + oQinacOri_d);
                                                                    eData.ZzqinacWeek = parseFloat(oOthrsTmp + oQinacOri_w);
                                                                    eData.Zzqinac = parseFloat(oOthrsTmp + oQinacOri);

                                                                } else {
                                                                    ItemTmp = {
                                                                        Zzpernr: oData[i].Zzpernr,
                                                                        Zzothrs: oOthrsOri
                                                                    }
                                                                    ItemTmpArr.push(ItemTmp);
                                                                    eData.ZzqinacDay = parseFloat(oOthrsOri + oQinacOri_d);
                                                                    eData.ZzqinacWeek = parseFloat(oOthrsOri + oQinacOri_w);
                                                                    eData.Zzqinac = parseFloat(oOthrsOri + oQinacOri);
                                                                }
                                                                oDataTmp.push(eData);

                                                                //jika index looping lebih besar dari index yang di edit
                                                            } else {
                                                                //cek apakah ada di table tampungan total othrs
                                                                if (oIdx >= 0) {
                                                                    oOthrsTmp = parseFloat(ItemTmpArr[oIdx].Zzothrs);
                                                                    ItemTmpArr[oIdx].Zzothrs = parseFloat(oOthrsTmp + oOthrsTmpData);
                                                                    oOthrsTmp = parseFloat(ItemTmpArr[oIdx].Zzothrs);
                                                                    oData[i].ZzqinacDay = parseFloat(oOthrsTmp + oQinacOri_d);
                                                                    oData[i].ZzqinacWeek = parseFloat(oOthrsTmp + oQinacOri_w);
                                                                    oData[i].Zzqinac = parseFloat(oOthrsTmp + oQinacOri);
                                                                } else {
                                                                    ItemTmp = {
                                                                        Zzpernr: oData[i].Zzpernr,
                                                                        Zzothrs: oData[i].Zzothrs
                                                                    }
                                                                    ItemTmpArr.push(ItemTmp);
                                                                }
                                                                oDataTmp.push(oData[i]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            // oQinacFinal = parseFloat(oQinacOri + oQinacTmp + oOthrsOri);

                                            // eData.Zzqinac = parseFloat(oQinacFinal);
                                            // oModel.setProperty(xPath, eData);
                                            // oModel.refresh();
                                            oModel.setData({
                                                data: oDataTmp
                                            });

                                            if (eData.Indicator === 'X') {
                                                MessageBox.information(eData.FreeText);
                                            }
                                            eData.FreeText = '';

                                            thats._reset();
                                        } else {
                                            thats._oBusy.close();
                                            MessageBox.error(eData.Msg);
                                        }

                                    },
                                    error: function (e) {
                                        thats._oBusy.close();
                                        MessageBox.error(e.message);
                                    }
                                });
                        }
                    }
                }


            },


            onSubmit: function (oEvent) {
                var oListModel = this.byId("id_splRequestTable").getModel("ovtList"),
                    oListData = oListModel.getProperty("/data"),
                    oListModelAttach = this.byId("id_AttachTable").getModel("ovtListAttach"),
                    oListDataAttach = oListModelAttach.getProperty("/data"),
                    oZzorgeh = this.getView().getModel("headerArray").getData().Zzorgeh,
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
                    Action: 'TM',
                    Zzdstat: oZzdstat,
                    ZzdstatText: oZzdstattext,
                    DocidObs: '',
                    DocidObsStat: '',
                    Zzorgeh: this.getView().getModel("headerArray").getData().Zzorgeh,
                    Zzorget: this.getView().getModel("headerArray").getData().Zzorget,
                    Zzedate: this.getView().getModel("headerArray").getData().Zzedate,
                    Zzpersa: this.getView().getModel("headerArray").getData().Zzpersa,
                    Zzbtrtl: this.getView().getModel("headerArray").getData().Zzbtrtl,
                    Zzottyp: this.getView().getModel("headerArray").getData().Zzottyp,
                    ZzottypTxt: this.getView().getModel("headerArray").getData().ZzottypTxt,

                    OvtHeader_to_OvtItem: [],
                    OvtHeader_to_OvtAttach: []
                }),
                    oData = oModel.getProperty("/OvtHeader_to_OvtItem"),
                    oDataAttach = oModel.getProperty("/OvtHeader_to_OvtAttach");


                for (var i = 0; i < oListData.length; i++) {
                    var ovtItem = {
                        Zzpernr: oListData[i].Zzpernr,
                        ZzpernrName: oListData[i].ZzpernrName,
                        Zzawart: oListData[i].Zzawart,
                        Zzatext: oListData[i].Zzatext,
                        Zzcompt: oListData[i].Zzcompt,
                        Zzkostl: oListData[i].Zzkostl,
                        ZzkostlTxt: oListData[i].ZzkostlTxt,
                        Zzotbeg: oListData[i].Zzotbeg,
                        Zzotend: oListData[i].Zzotend,
                        // DWS
                        Zzothrs: oListData[i].Zzothrs,
                        ZzqinacDay: oListData[i].ZzqinacDay.toString(),
                        ZzqinacWeek: oListData[i].ZzqinacWeek.toString(),
                        Zzqinac: oListData[i].Zzqinac.toString(),
                        Zzrmrks: oListData[i].Zzrmrks,

                        Zztprog: oListData[i].Zztprog,
                        ZztprogTxt: oListData[i].ZztprogTxt,
                        Zzbegzt: oListData[i].Zzbegzt,
                        Zzendzt: oListData[i].Zzendzt,

                        Zzpersa: oListData[i].Zzpersa,
                        Zzedate: oListData[i].Zzedate,

                        Zzbgjob: '0',
                        Zzestat: oZzdstat,
                        ZzestatTxt: oZzdstattext,
                        ZzestatTmp: 'X',
                        Zzorgeh: oZzorgeh

                    };
                    oData.push(ovtItem);
                }

                if (typeof oListDataAttach !== "undefined") {
                    for (var i = 0; i < oListDataAttach.length; i++) {
                        var oFileId = "eOvertime_Attachment_Item" + i;
                        var ovtItemA = {
                            Fileid: oFileId,
                            Filetype: oListDataAttach[i].Filetype,
                            Filename: oListDataAttach[i].Filename,
                            Attachment: oListDataAttach[i].Content,
                            Fileurl: "",
                            Action: "NEW"

                        };
                        oDataAttach.push(ovtItemA);
                    }
                }

                if (typeof ovtItem === "undefined") {
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
                                //CEK FIRST VALIDATION
                                this.oModel.create("/zhr_ovtime_hSet", oModel.getData(), {
                                    async: false,
                                    success: function (oData, a) {
                                        oModel.getData().Action = oAction;
                                        oModel.getData().DocidObs = oData.DocidObs;

                                        oModel.getData().DocidObsStat = oData.DocidObsStat;

                                        var MsgQuetion = oData.Msg;

                                        if (oData.Status === "S" || oAction == 'SV') {
                                            //SUBMIT
                                            that.oModel.create("/zhr_ovtime_hSet", oModel.getData(), {
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
                                                                r.navTo("RouteMainOvertime");
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

                                        } else {
                                            that._oBusy.close();
                                            if (oData.Flag == 'X') {
                                                MessageBox.error(MsgQuetion);
                                            } else {
                                                that.oApproveDialog2 = new Dialog({
                                                    type: DialogType.Message,
                                                    title: "Confirm",
                                                    content: new Text({ text: MsgQuetion }),
                                                    beginButton: new Button({
                                                        type: ButtonType.Emphasized,
                                                        text: "Yes",
                                                        press: function () {
                                                            that._oBusy.open();
                                                            that.oModel.create("/zhr_ovtime_hSet", oModel.getData(), {
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
                                                                                r.navTo("RouteMainOvertime");
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
                                                            that.oApproveDialog2.close();
                                                        }.bind(that)
                                                    }),
                                                    endButton: new Button({
                                                        text: "No",
                                                        press: function () {
                                                            that.oApproveDialog2.close();
                                                        }.bind(that)
                                                    })
                                                });
                                                that.oApproveDialog2.open();
                                            }


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
                var oCtx = oEvent.getParameter("listItem").getBindingContext("ovtList"),
                    oModel = oCtx.getModel("ovtList"),
                    sPath = oCtx.getPath();
                this._sPath = sPath;
                this._reset();

                var oPernr = this.byId("id_Pernr"),
                    oAwart = this.byId("id_Awart"),
                    oCompt = this.byId("id_Compt"),
                    oKostl = this.byId("id_Kostl"),
                    oOtbeg = this.byId("id_Otbeg"),
                    oOtend = this.byId("id_Otend"),
                    oRmrks = this.byId("id_Rmrks"),
                    oAdd = this.byId("id_btnAdd"),
                    oRes = this.byId("id_btnReset");
                oPernr.setValue(oModel.getProperty(sPath + "/Zzpernr"));
                oAwart.setSelectedKey(oModel.getProperty(sPath + "/Zzawart"));
                oKostl.setSelectedKey(oModel.getProperty(sPath + "/Zzkostl"));

                if (oModel.getProperty(sPath + "/FreeText2").substring(9, 11) === 'PM' &&
                    oModel.getProperty(sPath + "/FreeText2").substring(2, 0) === '00') {
                    oOtbeg.setValue("00:00:00 PM");
                } else if (oModel.getProperty(sPath + "/FreeText2").substring(9, 11) === 'AM' &&
                    oModel.getProperty(sPath + "/FreeText2").substring(2, 0) === '00') {
                    oOtbeg.setValue("00:00:00 AM");
                } else {
                    oOtbeg.setValue(oModel.getProperty(sPath + "/FreeText2"));
                }

                if (oModel.getProperty(sPath + "/FreeText3").substring(9, 11) === 'PM' &&
                    oModel.getProperty(sPath + "/FreeText3").substring(2, 0) === '00') {
                    oOtend.setValue("00:00:00 PM");
                } else if (oModel.getProperty(sPath + "/FreeText3").substring(9, 11) === 'AM' &&
                    oModel.getProperty(sPath + "/FreeText3").substring(2, 0) === '00') {
                    oOtend.setValue("00:00:00 AM");
                } else {
                    oOtend.setValue(oModel.getProperty(sPath + "/FreeText3"));
                }

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

                var oPernr2 = oModel.getProperty(sPath + "/Zzpernr");
                var oFilter = new Array(); // Don't normally do this but just for the example.
                var lo_pickedDateFilter = new sap.ui.model.Filter({
                    path: 'Zzpernr',
                    operator: FilterOperator.EQ,
                    value1: oPernr2
                });
                oFilter.push(lo_pickedDateFilter);

                var lvEdate = this.formatoDataString(this.getView().getModel("headerArray").getData().Zzedate);

                lo_pickedDateFilter = new sap.ui.model.Filter({
                    path: 'Zzedate',
                    operator: FilterOperator.EQ,
                    value1: lvEdate
                });
                oFilter.push(lo_pickedDateFilter);

                var sPath2 = "/zhr_ovtime_zcomptSet";
                var oModelZzcompt = this.byId("id_Compt").getModel("Zzcompt");
                this.oModel.read(sPath2, {
                    filters: oFilter,
                    async: false,
                    success: function (oData, response) {
                        oModelZzcompt.setData({
                            data: oData.results
                        });
                        oCompt.setSelectedKey(oModel.getProperty(sPath + "/Zzcompt"));
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

            onItemDeleted: function (oEvent) {
                var oCtx = oEvent.getParameter("listItem").getBindingContext("ovtList"),
                    oModel = oCtx.getModel("ovtList"),
                    oData = oModel.getProperty("/data"),
                    sPath = oCtx.getPath(),
                    oIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1), 10);
                // oData.splice(oIndex, 1);
                // oModel.setData({ data: oData });
                // this._reset();

                var lvPernr = oData[oIndex].Zzpernr,
                    oOthrsDel = 0,

                    oQinacOri_d = 0,
                    oQinacOri_w = 0,
                    oQinacOri = 0,
                    oDataTmp = [],

                    oGrp = oData[oIndex].Flag;

                oOthrsDel = parseFloat(oData[oIndex].Zzothrs);

                oData.splice(oIndex, 1);

                for (var i = 0; i < oData.length; i++) {

                    //jika index looping lebih kecil dari index yang di edit, langsung push
                    if (i < oIndex) {
                        oDataTmp.push(oData[i]);

                        //jika index looping lebih besar dari sama dengan index yang di delete, maka di kurangi saja Qinac nya jika pernr nya sama
                    } else {
                        if (oGrp === 'X') { //Group
                            oQinacOri_d = parseFloat(oData[i].ZzqinacDay);
                            oQinacOri_w = parseFloat(oData[i].ZzqinacWeek);
                            oQinacOri = parseFloat(oData[i].Zzqinac);

                            oData[i].ZzqinacDay = parseFloat(oQinacOri_d - oOthrsDel);
                            oData[i].ZzqinacWeek = parseFloat(oQinacOri_w - oOthrsDel);
                            oData[i].Zzqinac = parseFloat(oQinacOri - oOthrsDel);

                        } else { //Individual
                            if (oData[i].Zzpernr === lvPernr) {
                                oQinacOri_d = parseFloat(oData[i].ZzqinacDay);
                                oQinacOri_w = parseFloat(oData[i].ZzqinacWeek);
                                oQinacOri = parseFloat(oData[i].Zzqinac);

                                oData[i].ZzqinacDay = parseFloat(oQinacOri_d - oOthrsDel);
                                oData[i].ZzqinacWeek = parseFloat(oQinacOri_w - oOthrsDel);
                                oData[i].Zzqinac = parseFloat(oQinacOri - oOthrsDel);
                            }
                        }


                        oDataTmp.push(oData[i]);
                    }
                }

                oModel.setData({
                    data: oDataTmp
                });

            },

            onPaste: function (oEvent) {
                var aData = oEvent.getParameter("data"),
                    lvOrgeh = this.byId("id_Orgeh").getText(),
                    lvEdate = this.getView().getModel("headerArray").getData().Zzedate,
                    oText = this.getView().byId("id_colAkumtxt"),
                    oTextW = this.getView().byId("id_colAkumWtxt"),
                    lv_break,
                    oTimesBegSub,
                    oTimesEndSub;

                var oModel = this.byId("id_splRequestTable").getModel("ovtList"),
                    oData = oModel.getProperty("/data");

                for (var i = 0; i < aData.length; i++) {
                    if (lv_break === 'X') {
                        break;
                    }

                    var lvLine = i + 1,
                        lvPernr = aData[i][0],
                        lvAwart = aData[i][1],
                        lvCompt = aData[i][2],
                        lvKostl = aData[i][3],
                        lvOtbeg = aData[i][4],
                        lvOtend = aData[i][5],
                        lvRmrks = aData[i][6],
                        oTimesBegSub = lvOtbeg.substring(3, 5),
                        oTimesEndSub = lvOtend.substring(3, 5),
                        oEntry = {};

                    if (oTimesBegSub === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Overtime Duration Start at Line " + lvLine);
                        return;
                    } else if (oTimesEndSub === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Overtime Duration End at Line " + lvLine);
                        return;
                    }

                    if (oTimesBegSub !== '00' && oTimesBegSub !== '30') {
                        lv_break = 'X';
                        MessageBox.error('Only multiples of 30 minutes can be submitted for Begin Time at Line ' + lvLine);
                    }

                    if (lv_break === 'X') {
                        break;
                    }

                    if (oTimesEndSub !== '00' && oTimesBegSub !== '30') {
                        lv_break = 'X';
                        MessageBox.error('Only multiples of 30 minutes can be submitted for End Time at Line ' + lvLine);
                    }

                    if (lv_break === 'X') {
                        break;
                    }

                    oEntry.Zzpernr = lvPernr;
                    oEntry.Zzawart = lvAwart;
                    oEntry.Zzcompt = lvCompt;
                    oEntry.Zzkostl = lvKostl;
                    oEntry.Zzotbeg = "PT".concat(lvOtbeg.substring(0, 2), "H", lvOtbeg.substring(3, 5), "M00S");
                    oEntry.Zzotend = "PT".concat(lvOtend.substring(0, 2), "H", lvOtend.substring(3, 5), "M00S");
                    oEntry.Zzrmrks = lvRmrks;
                    oEntry.Zzorgeh = lvOrgeh;
                    oEntry.Zzedate = lvEdate;
                    oEntry.FreeText = lvLine.toString();

                    if (oEntry.Zzpernr === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Employee at Line " + lvLine);
                    } else if (oEntry.Zzawart === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Overtime Reason Code at Line " + lvLine);
                    } else if (oEntry.Zzcompt === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Compensation Type at Line " + lvLine);
                    } else if (oEntry.Zzotbeg === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Overtime Duration Start at Line " + lvLine);
                    } else if (oEntry.Zzotend === "") {
                        lv_break = 'X';
                        MessageBox.error("Please Fill Overtime Duration End at Line " + lvLine);
                    } else {

                        if (lv_break === 'X') {
                            break;
                        }
                        if (lv_break !== 'X') {
                            var that = this;
                            this._oBusy.open();
                            this.oModel.create("/zhr_ovtime_iSet", oEntry,
                                {
                                    async: false,
                                    success: function (eData, a) {
                                        if (lv_break !== 'X') {
                                            if (eData.Status === "S") {
                                                // Clean up the oData from __metadata attribute
                                                delete eData.__metadata;
                                                var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "KK:mm:ss a" });
                                                // timezoneOffset is in hours convert to milliseconds
                                                var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                                                eData.FreeText2 = timeFormat.format(new Date(eData.Zzotbeg.ms + TZOffsetMs));
                                                eData.FreeText3 = timeFormat.format(new Date(eData.Zzotend.ms + TZOffsetMs));
                                                eData.Msg = timeFormat.format(new Date(eData.Zzbegzt.ms + TZOffsetMs)).concat(" - ", timeFormat.format(new Date(eData.Zzendzt.ms + TZOffsetMs)));
                                                // if (typeof oData !== "undefined" && oData !== null && oData.length > 0) {
                                                //     oData.push(eData);
                                                // } else {
                                                //     oData = [];
                                                //     oData.push(eData);
                                                // }
                                                // oModel.setData({
                                                //     data: oData
                                                // });

                                                if (eData.Flag === 'X') {
                                                    oText.setText("Accumulation Monthly Group");
                                                    oTextW.setText("Accumulation Weekly Group");
                                                } else {
                                                    oText.setText("Accumulation Monthly Individual");
                                                    oTextW.setText("Accumulation Weekly Individual");
                                                }

                                                var oQinacOri_d = 0,
                                                    oQinacOri_w = 0,
                                                    oQinacOri = 0,

                                                    oQinacTmp_d = 0,
                                                    oQinacTmp_w = 0,
                                                    oQinacTmp = 0,

                                                    oOthrsTmp = 0,

                                                    oOthrsOri = 0,

                                                    oQinacFinal_d = 0,
                                                    oQinacFinal_w = 0,
                                                    oQinacFinal = 0,

                                                    oPernr;

                                                oQinacOri_d = parseFloat(eData.ZzqinacDay);
                                                oQinacOri_w = parseFloat(eData.ZzqinacWeek);
                                                oQinacOri = parseFloat(eData.Zzqinac);

                                                oOthrsOri = parseFloat(eData.Zzothrs);

                                                oPernr = eData.Zzpernr;

                                                if (eData.Flag === 'X') { //Group
                                                    if (typeof oData !== "undefined") {
                                                        for (var i = 0; i < oData.length; i++) {
                                                            oOthrsTmp = parseFloat(oData[i].Zzothrs);

                                                            oQinacTmp = parseFloat(oQinacTmp + oOthrsTmp);
                                                            oQinacTmp_d = parseFloat(oQinacTmp_d + oOthrsTmp);
                                                            oQinacTmp_w = parseFloat(oQinacTmp_w + oOthrsTmp);
                                                        }
                                                    }

                                                } else { //individual
                                                    if (typeof oData !== "undefined") {
                                                        for (var i = 0; i < oData.length; i++) {
                                                            if (oData[i].Zzpernr === oPernr) {
                                                                oOthrsTmp = parseFloat(oData[i].Zzothrs);

                                                                oQinacTmp = parseFloat(oQinacTmp + oOthrsTmp);
                                                                oQinacTmp_d = parseFloat(oQinacTmp_d + oOthrsTmp);
                                                                oQinacTmp_w = parseFloat(oQinacTmp_w + oOthrsTmp);
                                                            }
                                                        }
                                                    }
                                                }

                                                oQinacFinal_d = parseFloat(oQinacOri_d + oQinacTmp_d + oOthrsOri);
                                                oQinacFinal_w = parseFloat(oQinacOri_w + oQinacTmp_w + oOthrsOri);
                                                oQinacFinal = parseFloat(oQinacOri + oQinacTmp + oOthrsOri);

                                                eData.ZzqinacDay = parseFloat(oQinacFinal_d);
                                                eData.ZzqinacWeek = parseFloat(oQinacFinal_w);
                                                eData.Zzqinac = parseFloat(oQinacFinal);

                                                if (typeof oData !== "undefined" && oData !== null && oData.length > 0) {
                                                    oData.push(eData);
                                                } else {
                                                    oData = [];
                                                    oData.push(eData);
                                                }
                                                oModel.setData({
                                                    data: oData
                                                });
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
                                            // MessageToast.show(e.message);
                                            MessageBox.error(e.message);
                                            lv_break = 'X';
                                            that._oBusy.close();
                                        }
                                    }
                                });
                        }
                    }
                }
            },

            onHandleType: function (oEvent) {
                var aFileTypes = oEvent.getSource().getFileType();
                aFileTypes.map(function (sType) {
                    return "*." + sType;
                });
                MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                    " is not supported. Choose one of the following types: " +
                    aFileTypes.join(", "));
            },

            // When user select the file then this method will call....
            onHandleSelectFile: function (oEvent) {
                var fileDetails = oEvent.getParameters("id_Attach").files[0];
                sap.ui.getCore().fileUploadArr = [];
                if (fileDetails) {
                    var mimeDet = fileDetails.type,
                        fileName = fileDetails.name,
                        size = fileDetails.size;

                    // Calling method....
                    this.base64coonversionMethod(mimeDet, fileName, fileDetails, size, "001");
                } else {
                    sap.ui.getCore().fileUploadArr = [];
                }

            },

            // Base64 conversion of selected file(Called method)....
            base64coonversionMethod: function (fileMime, fileName, fileDetails, fileSize, DocNum) {
                var that = this;
                if (fileSize > 2000000) {
                    MessageBox.error("Attachment more than 2MB");
                } else {
                    if (!FileReader.prototype.readAsBinaryString) {
                        FileReader.prototype.readAsBinaryString = function (fileData) {
                            var binary = "";
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var bytes = new Uint8Array(reader.result);
                                var length = bytes.byteLength;
                                for (var i = 0; i < length; i++) {
                                    binary += String.fromCharCode(bytes[i]);
                                }
                                that.base64ConversionRes = btoa(binary);
                            };
                            reader.readAsArrayBuffer(fileData);
                        };
                    }
                    var reader = new FileReader();
                    reader.onload = function (readerEvt) {
                        var binaryString = readerEvt.target.result;
                        var oModel = that.byId("id_AttachTable").getModel("ovtListAttach"),
                            oData = oModel.getProperty("/data");
                        that.base64ConversionRes = btoa(binaryString);
                        if (typeof oData !== "undefined" && oData !== null && oData.length > 0) {
                            oData.push({
                                "DocumentType": DocNum,
                                "Filetype": fileMime,
                                "Filename": fileName,
                                "Content": that.base64ConversionRes,

                            });
                        } else {
                            oData = [];
                            oData.push({
                                "DocumentType": DocNum,
                                "Filetype": fileMime,
                                "Filename": fileName,
                                "Content": that.base64ConversionRes,

                            });
                        }
                        oModel.setData({
                            data: oData
                        });
                    };
                    reader.readAsBinaryString(fileDetails);
                }

            },

            onItemDeletedAttach: function (oEvent) {
                var oCtx = oEvent.getParameter("listItem").getBindingContext("ovtListAttach"),
                    oModel = oCtx.getModel("ovtListAttach"),
                    oData = oModel.getProperty("/data"),
                    sPath = oCtx.getPath(),
                    i = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1), 10);

                oData.splice(i, 1);
                oModel.setData({ data: oData });
                this._reset();
            },

            formatDateUtc: function (d) {
                var loDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-ddTKK:mm:ss"
                }),
                    lvDateVal = new Date(loDateFormat.format(d));
                lvDateVal.setMinutes(lvDateVal.getTimezoneOffset() * -1);
                return lvDateVal;
            },

            formatoDataString: function (iDate) {
                var d = iDate.getDate(),
                    m = iDate.getMonth(),
                    y = iDate.getFullYear();
                return y + "-" + ("0" + (m + 1)).substr(-2) + "-" + ("0" + d).substr(-2) + "T00:00:00";
            }
        });
    });

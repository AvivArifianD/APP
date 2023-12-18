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

        return Controller.extend("com.zhrxchangegroup.zhrxchangegroup.controller.UpdateECGroup", {
            // formatter: f,
            onInit: function () {
                this._oBusy = new sap.m.BusyDialog();
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);
                this.getView().getModel().updateBindings();
                this.byId("id_splRequestTable").setModel(new JSONModel(), "chgList");

                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("UpdateECGroup")
                    .attachPatternMatched(this._onRouteMatched, this);

                oCheckArr = [];

            },

            _onRouteMatched: function (oEvent) {
                var loItem = oEvent.getParameter("arguments"),
                    lvPath = "/zhr_ecgroup_headSet('" + loItem.DocumentID + "')",
                    loODataModel = new JSONModel(),
                    lvDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd.MM.yyyy" }),
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

                        if (typeof oData.ChgHeader_to_ChgItem !== "undefined" && oData.ChgHeader_to_ChgItem !== null && oData.ChgHeader_to_ChgItem.results.length > 0) {
                            for (var i = 0; i < oData.ChgHeader_to_ChgItem.results.length; i++) {
                                var lvDateFormatted = lvDateFormat.format(oData.ChgHeader_to_ChgItem.results[i].Zzbegda);
                                oCheckArr.push(oData.ChgHeader_to_ChgItem.results[i].Zzpernr + lvDateFormatted);
                            }
                        }

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
                this._resetAll();

            },


            //Pernr
            onValueHelpRequestPer: function (oEvent) {
                var loInputValue = oEvent.getSource().getValue(),
                    loView = this.getView();

                if (!this._pValueHelpDialogPer) {
                    this._pValueHelpDialogPer = Fragment.load({
                        id: loView.getId(),
                        name: "com.zhrxchangegroup.zhrxchangegroup.view.fragment.ValueHelpDialogPer",
                        controller: this
                    }).then(function (oDialog) {
                        loView.addDependent(oDialog);
                        loView.byId("selectPernr").setMultiSelect(false);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogPer.then(function (oDialog) {
                    var lvOrgeh = loView.oModels.header.oData.Zzorgeh;
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("Pernr", FilterOperator.Contains, loInputValue),
                    new Filter("Cname", FilterOperator.Contains, loInputValue),
                    new Filter("Orgeh", FilterOperator.EQ, lvOrgeh)
                    ]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(loInputValue);
                });
            },

            onValueHelpSearchPer: function (oEvent) {
                var loValue = oEvent.getParameter("value");
                var lvOrgeh = this.getView().byId("id_Orgeh").getText();

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
                        ,
                        new Filter({
                            path: 'Orgeh',
                            operator: FilterOperator.EQ,
                            value1: lvOrgeh
                        })
                    ],
                    and: true
                })

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpClosePer: function (oEvent) {
                var loSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!loSelectedItem) {
                    return;
                }

                this.byId("id_Pernr").setValue(loSelectedItem.getTitle());
            },

            //WSR
            onVHWsr: function (oEvent) {
                var loInputValue = oEvent.getSource().getValue(),
                    loView = this.getView();

                if (!this._pValueHelpDialogwsr) {
                    this._pValueHelpDialogwsr = Fragment.load({
                        id: loView.getId(),
                        name: "com.zhrxchangegroup.zhrxchangegroup.view.fragment.ValueHelpDialogWsr",
                        controller: this
                    }).then(function (oDialog) {
                        loView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogwsr.then(function (oDialog) {
                    // Create a filter for the binding
                    var lvPernr = loView.byId("id_Pernr").getValue();

                    oDialog.getBinding("items").filter([new Filter("Schkz", FilterOperator.Contains, loInputValue),
                    new Filter("Pernr", FilterOperator.EQ, lvPernr)
                    ]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(loInputValue);
                });
            },

            onVHSearchWsr: function (oEvent) {
                var loValue = oEvent.getParameter("value"),
                    lvPernr = this.getView().byId("id_Pernr").getValue();

                var oFilter = new Filter({
                    filters: [
                        new Filter({
                            path: 'Schkz',
                            operator: FilterOperator.Contains,
                            value1: loValue
                        }),
                        new Filter({
                            path: 'Pernr',
                            operator: FilterOperator.EQ,
                            value1: lvPernr
                        })
                    ],
                    and: true
                })

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onVHCloseWsr: function (oEvent) {
                var loSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!loSelectedItem) {
                    return;
                }

                this.byId("id_Wsr").setValue(loSelectedItem.getTitle());
            },

            onReset: function () {
                this._reset();
            },

            _reset: function () {
                var loPernr = this.byId("id_Pernr"),
                    loWsrD = this.byId("id_WsrD"),
                    loWsr = this.byId("id_Wsr"),
                    loRmrks = this.byId("id_Rmrks"),
                    loAdd = this.byId("id_btnAdd"),
                    loRes = this.byId("id_btnReset"),
                    loSecno = this.byId("id_Secno");

                loPernr.setValue(null);
                loWsrD.setValue(null);
                loWsr.setValue(null);
                loRmrks.setValue(null);
                loSecno.setValue(null);
                loAdd.setText("Add");
                loAdd.setIcon("sap-icon://add");
                loRes.setText("Reset");
                loRes.setIcon("sap-icon://reset");
                try {
                    loPernr.setEditable(true);
                } catch (err) {
                    loPernr.setEnabled(true);
                };

            },

            _resetAll: function () {
                var loDocid = this.byId("id_Docid"),
                    loPernr = this.byId("id_Pernr"),
                    loWsrD = this.byId("id_WsrD"),
                    loWsr = this.byId("id_Wsr"),
                    loRmrks = this.byId("id_Rmrks"),
                    loAdd = this.byId("id_btnAdd"),
                    loRes = this.byId("id_btnReset"),

                    loOrgUnit = this.byId("id_OrgUnit"),
                    loOrgeh = this.byId("id_Orgeh"),
                    loPersa = this.byId("id_Persa"),
                    loBtrtl = this.byId("id_Btrtl"),
                    loOrget = this.byId("id_Orget"),
                    loPersaTxt = this.byId("id_PersaTxt"),
                    loBtrtlTxt = this.byId("id_BtrtlTxt"),
                    loZzpernrnotif1Name = this.byId("id_Zzpernrnotif1Name"),
                    loZzpernrnotif2Name = this.byId("id_Zzpernrnotif2Name"),
                    loZzpernrnotif3Name = this.byId("id_Zzpernrnotif3Name"),
                    loZzpernrnotif1 = this.byId("id_Zzpernrnotif1"),
                    loZzpernrnotif2 = this.byId("id_Zzpernrnotif2"),
                    loZzpernrnotif3 = this.byId("id_Zzpernrnotif3");

                loDocid.setText(null);
                loPernr.setValue(null);
                loWsrD.setValue(null);
                loWsr.setValue(null);
                loRmrks.setValue(null);

                loOrgUnit.setText(null);
                loOrgeh.setText(null);
                loPersa.setText(null);
                loBtrtl.setText(null);
                loOrget.setText(null);
                loPersaTxt.setText(null);
                loBtrtlTxt.setText(null);
                loZzpernrnotif1Name.setText(null);
                loZzpernrnotif2Name.setText(null);
                loZzpernrnotif3Name.setText(null);
                loZzpernrnotif1.setText(null);
                loZzpernrnotif2.setText(null);
                loZzpernrnotif3.setText(null);

                loAdd.setText("Add");
                loAdd.setIcon("sap-icon://add");
                loRes.setText("Reset");
                loRes.setIcon("sap-icon://reset");
                try {
                    loPernr.setEditable(true);
                } catch (err) {
                    loPernr.setEnabled(true);
                };

                var laFree = [];
                var loListModel = this.byId("id_splRequestTable").getModel("chgList");
                loListModel.setData({
                    data: laFree
                });

                oCheckArr = [];

            },

            formatDateUtc: function (d) {
                var loDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-ddTKK:mm:ss"
                }),
                    lvDateVal = new Date(loDateFormat.format(d));
                lvDateVal.setMinutes(lvDateVal.getTimezoneOffset() * -1);
                return lvDateVal;
            },

            onItemPressed: function (oEvent) {
                var loCtx = oEvent.getParameter("listItem").getBindingContext("chgList"),
                    loModel = loCtx.getModel("chgList"),
                    lvPath = loCtx.getPath();
                this._sPath = lvPath;
                this._reset();

                var loPernr = this.byId("id_Pernr"),
                    loWsrD = this.byId("id_WsrD"),
                    loWsr = this.byId("id_Wsr"),
                    loRmrks = this.byId("id_Rmrks"),
                    loAdd = this.byId("id_btnAdd"),
                    loRes = this.byId("id_btnReset"),
                    loDay = loModel.getProperty(lvPath + "/Zzbegda"),
                    dd = loDay.getDate(),
                    mm = loDay.getMonth() + 1, //January is 0!
                    yyyy = loDay.getFullYear(),
                    lvDdText, lvMmText;

                if (dd >= 1 && dd < 10) {
                    lvDdText = '0'.concat(dd);
                } else {
                    lvDdText = dd;
                }

                if (mm >= 1 && mm < 10) {
                    lvMmText = '0'.concat(mm);
                } else {
                    lvMmText = mm;
                }

                var lvDate = (lvDdText + '.' + lvMmText + '.' + yyyy),

                    loSecno = this.byId("id_Secno");

                loPernr.setValue(loModel.getProperty(lvPath + "/Zzpernr"));
                loWsrD.setValue(lvDate);
                loWsr.setValue(loModel.getProperty(lvPath + "/Zzschkz"));
                loRmrks.setValue(loModel.getProperty(lvPath + "/Zzrmrks"));
                loSecno.setValue(loModel.getProperty(lvPath + "/Zzsecno"));
                loAdd.setText("Update");
                loAdd.setIcon("sap-icon://edit");
                loRes.setText("Cancel");
                loRes.setIcon("sap-icon://cancel");
                try {
                    loPernr.setEditable(false);
                } catch (err) {
                    loPernr.setEnabled(false);
                };
            },

            onItemDeleted: function (oEvent) {
                var loCtx = oEvent.getParameter("listItem").getBindingContext("chgList"),
                    loModel = loCtx.getModel("chgList"),
                    loData = loModel.getProperty("/data"),
                    lvPath = loCtx.getPath(),
                    i = parseInt(lvPath.substring(lvPath.lastIndexOf('/') + 1), 10);
                oCheckArr.splice(i, 1);
                loData.splice(i, 1);
                loModel.setData({ data: loData });
                this._reset();
            },

            isValidDate: function (date) {
                var temp = date.split('/');
                var d = new Date(temp[2] + '/' + temp[0] + '/' + temp[1]);
                var isValid = (d && (d.getMonth() + 1) == temp[0] && d.getDate() == Number(temp[1]) && d.getFullYear() == Number(temp[2]));
                return { d, isValid };
            },

            formatDateString: function (iDate) {
                var d = iDate.substring(0, 2),
                    m = iDate.substring(3, 5),
                    y = iDate.substring(6, 10);
                return m.concat("/", d, "/", y);
                // return d + "." + m + "." + y;
            },

            formatoDataString: function (iDate) {
                var d = iDate.substring(0, 2),
                    m = iDate.substring(3, 5),
                    y = iDate.substring(6, 10);
                return y + "-" + ("0" + (m + 1)).substr(-2) + "-" + ("0" + d).substr(-2) + "T00:00:00";
            },

            onAdd: function () {
                if (!this.chgValidation()) {
                    return false;
                } else {

                    var lvPernr = this.byId("id_Pernr").getValue(),
                        lvWsrD = this.formatDateUtc(this.byId("id_WsrD").getDateValue()),
                        lvWsrDx = this.byId("id_WsrD").getValue(),
                        lvWsr = this.byId("id_Wsr").getValue(),
                        lvRmrks = this.byId("id_Rmrks").getValue(),
                        lvOrgeh = this.byId("id_Orgeh").getText(),
                        lvPersa = this.byId("id_Persa").getText(),
                        lvBtrtl = this.byId("id_Btrtl").getText(),
                        lvSecno = this.byId("id_Secno").getValue(),
                        lwEntry = {},
                        that = this;

                    lwEntry.Zzpernr = lvPernr;
                    lwEntry.Zzbegda = lvWsrD;
                    lwEntry.Zzschkz = lvWsr;
                    lwEntry.Zzrmrks = lvRmrks;
                    lwEntry.Zzorgeh = lvOrgeh;
                    lwEntry.Zzpersa = lvPersa;
                    lwEntry.Zzbtrtl = lvBtrtl;
                    lwEntry.Zzsecno = lvSecno;

                    var loModel = this.byId("id_splRequestTable").getModel("chgList"),
                        loData = loModel.getProperty("/data");


                    if (this.byId("id_btnAdd").getText() === "Add") {

                        if (oCheckArr.includes(lvPernr + lvWsrDx) === true) {
                            MessageBox.error("Duplicate data Pernr and Work Schedule Rule Date");
                            return;
                        }

                        this._oBusy.open();
                        this.oModel.create("/zhr_ecgroup_itemSet", lwEntry,
                            {
                                async: false,
                                success: function (oData, oRes) {
                                    var lvErr = '',
                                        lvCekCurrent = '',
                                        lvLowCurrent = oData.TrfstPara1,
                                        lvHighCurrent = oData.TrfstPara2,
                                        lvTrfstCurrent = oData.TrfstPer;

                                    //X = Inside Range
                                    //Y = Outside Range

                                    if (lvTrfstCurrent >= lvLowCurrent && lvTrfstCurrent <= lvHighCurrent) {
                                        lvCekCurrent = 'X';
                                    } else {
                                        lvCekCurrent = 'Y';
                                    }

                                    if (oData.Status === "S") {
                                        if (typeof loData !== "undefined" && loData !== null && loData.length > 0) {
                                            if (lvLowCurrent != '' && lvHighCurrent != '') {
                                                //level validation
                                                for (var i = 0; i < loData.length; i++) {

                                                    var lvLow = loData[i].TrfstPara1,
                                                        lvHigh = loData[i].TrfstPara2,
                                                        lvTrfst = loData[i].TrfstPer,
                                                        lvCek = '';

                                                    if (lvTrfst >= lvLow && lvTrfst <= lvHigh) {
                                                        lvCek = 'X';
                                                    } else {
                                                        lvCek = 'Y';
                                                    }

                                                    if (lvCek != lvCekCurrent) {
                                                        lvErr = 'X';
                                                        break;
                                                    }
                                                }
                                            }

                                            if (lvErr != 'X') {
                                                loData.push(oData);
                                            }

                                        } else {
                                            loData = [];
                                            loData.push(oData);
                                        }

                                        that._oBusy.close();

                                        if (lvErr == 'X') {
                                            var lvMsg = "All other submitted employee must at least be from level " + lvLowCurrent + " to level " + lvHighCurrent;
                                            MessageBox.error(lvMsg);

                                        } else {
                                            loModel.setData({
                                                data: loData
                                            });
                                            oCheckArr.push(oData.Zzpernr + lvWsrDx);
                                            that._reset();
                                        }

                                    } else {
                                        that._oBusy.close();
                                        MessageBox.error(oData.Msg);
                                    }

                                },
                                error: function (e) {
                                    that._oBusy.close();
                                    console.log(e.responseText);
                                }
                            });

                        //edit
                    } else {
                        var lvPath = this._sPath,
                            i = parseInt(lvPath.substring(lvPath.lastIndexOf('/') + 1), 10);

                        if (oCheckArr[i] !== lvPernr + lvWsrDx) {
                            if (oCheckArr.includes(lvPernr + lvWsrDx) === true) {
                                MessageBox.error("Duplicate data Pernr and Work Schedule Rule Date");
                                return;
                            }
                        }

                        this._oBusy.open();
                        this.oModel.create("/zhr_ecgroup_itemSet", lwEntry,
                            {
                                async: false,
                                success: function (oData, oRes) {
                                    if (oData.Status === "S") {
                                        that._oBusy.close();
                                        //level validation
                                        var lvErr = '',
                                            lvCekCurrent = '',
                                            lvLowCurrent = oData.TrfstPara1,
                                            lvHighCurrent = oData.TrfstPara2,
                                            lvTrfstCurrent = oData.TrfstPer;

                                        //X = Inside Range
                                        //Y = Outside Range

                                        if (lvTrfstCurrent >= lvLowCurrent && lvTrfstCurrent <= lvHighCurrent) {
                                            lvCekCurrent = 'X';
                                        } else {
                                            lvCekCurrent = 'Y';
                                        }

                                        if (lvLowCurrent != '' && lvHighCurrent != '') {
                                            //level validation
                                            for (var i = 0; i < loData.length; i++) {

                                                var lvLow = loData[i].TrfstPara1,
                                                    lvHigh = loData[i].TrfstPara2,
                                                    lvTrfst = loData[i].TrfstPer,
                                                    lvCek = '';

                                                if (lvTrfst >= lvLow && lvTrfst <= lvHigh) {
                                                    lvCek = 'X';
                                                } else {
                                                    lvCek = 'Y';
                                                }

                                                if (lvCek != lvCekCurrent) {
                                                    lvErr = 'X';
                                                    break;
                                                }
                                            }
                                        }

                                        if (lvErr != 'X') {
                                            loModel.setProperty(lvPath, oData);
                                            oCheckArr[i] = oData.Zzpernr + lvWsrDx;
                                            loModel.refresh();
                                            that._reset();
                                        } else {
                                            var lvMsg = "All other submitted employee must at least be from level " + lvLowCurrent + " to level " + lvHighCurrent;
                                            MessageBox.error(lvMsg);
                                        }
                                    } else {
                                        that._oBusy.close();
                                        MessageBox.error(oData.Msg);
                                    }

                                },
                                error: function (e) {
                                    that._oBusy.close();
                                    console.log(e.responseText);
                                }
                            });
                    }
                }
            },

            chgValidation: function () {
                var isValid = true,
                    loPernr = this.byId("id_Pernr"),
                    loWsrD = this.byId("id_WsrD"),
                    loWsr = this.byId("id_Wsr");

                if (!loPernr.getValue()) {
                    isValid = false;
                    MessageBox.error("Please Fill Employee");
                    return isValid;
                }

                if (!loWsrD.getValue()) {
                    isValid = false;
                    MessageBox.error("Please enter Work Schedule Rule Date");
                    return isValid;
                }

                if (!loWsr.getValue()) {
                    isValid = false;
                    MessageBox.error("Please enter Work Schedule Rule");
                    return isValid;
                }

                var lvWsrDx = this.formatDateString(loWsrD.getValue()),
                    lwValidDate = this.isValidDate(lvWsrDx),
                    lvIsValidDate = lwValidDate.isValid;

                if (lvIsValidDate === false) {
                    isValid = false;
                    MessageBox.error("Please choose a future date");
                    return isValid;
                }

                // if (lvWsrDx.substring(3, 5) != '01' && lvWsrDx.substring(3, 5) != '16') {
                //     isValid = false;
                //     MessageBox.error("Please choose 1st or 16th in the future date");
                //     return isValid;
                // }

                return isValid;
            },

            onSubmit: function (oEvent) {
                var loListModel = this.byId("id_splRequestTable").getModel("chgList"),
                    loListData = loListModel.getProperty("/data"),
                    loBtn = oEvent.oSource.mProperties.text,
                    lvAction,
                    lvZzdstat = '0',
                    lvZzdstattxt = 'Draft',
                    lvZzdstattxt,
                    that = this;

                if (loBtn === 'Submit') {
                    lvAction = 'US';
                } else {
                    lvAction = 'UP';
                }

                var loModel = new JSONModel({
                    Zzdocid: this.getView().getModel("header").getData().Zzdocid,
                    Action: lvAction,
                    Zzdstat: lvZzdstat,
                    ZzdstatTxt: lvZzdstattxt,
                    Zzorgeh: this.byId("id_Orgeh").getText(),
                    Zzorget: this.byId("id_Orget").getText(),
                    Zzpersa: this.byId("id_Persa").getText(),
                    PersaTxt: this.byId("id_PersaTxt").getText(),
                    Zzbtrtl: this.byId("id_Btrtl").getText(),
                    BtrtlTxt: this.byId("id_BtrtlTxt").getText(),
                    Zzpernrnotif1: this.byId("id_Zzpernrnotif1").getText(),
                    Zzpernrnotif1Name: this.byId("id_Zzpernrnotif1Name").getText(),
                    Zzpernrnotif2: this.byId("id_Zzpernrnotif2").getText(),
                    Zzpernrnotif2Name: this.byId("id_Zzpernrnotif2Name").getText(),
                    Zzpernrnotif3: this.byId("id_Zzpernrnotif3").getText(),
                    Zzpernrnotif3Name: this.byId("id_Zzpernrnotif3Name").getText(),

                    ChgHeader_to_ChgItem: []
                }),
                    loData = loModel.getProperty("/ChgHeader_to_ChgItem");

                for (var i = 0; i < loListData.length; i++) {
                    if (loListData[i].Status == 'E') {
                        MessageBox.error("Please fix all errors before saving or submitting this document");
                        return false;

                    } else {
                        var lwChgItem = {
                            Zzdocid: this.getView().getModel("header").getData().Zzdocid,
                            Zzpernr: loListData[i].Zzpernr,
                            ZzpernrName: loListData[i].ZzpernrName,
                            Zzbegda: loListData[i].Zzbegda,
                            Zzschkz: loListData[i].Zzschkz,
                            ZzschkzTxt: loListData[i].ZzschkzTxt,
                            Zzrmrks: loListData[i].Zzrmrks,
                            Zzsecno: loListData[i].Zzsecno,

                            Zzbgjob: '0',
                            ZzbgjobTxt: 'Not Yet Processed',
                            Zzistat: lvZzdstat,
                            ZzistatTxt: lvZzdstattxt,
                            ZzistatTmp: 'X'

                        };
                        loData.push(lwChgItem);
                    }
                }
                if (typeof lwChgItem === "undefined") {
                    MessageBox.error('Please Fill Item');

                } else {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Do you want to " + loBtn + " this document?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Yes",
                            press: function () {
                                this._oBusy.open();
                                this.oModel.create("/zhr_ecgroup_headSet", loModel.getData(), {
                                    async: false,
                                    success: function (oData, a) {
                                        if (oData.Status === "S") {
                                            that._oBusy.close();
                                            var oMsg = "Document ID " + oData.Zzdocid + " has been created";

                                            MessageBox.success(oMsg, {
                                                onClose: function (oAction) {
                                                    var loEventBus = sap.ui.getCore().getEventBus();
                                                    loEventBus.publish("root", "update");

                                                    var oRouter = that.getOwnerComponent().getRouter();
                                                    oRouter.navTo("RouteMainECGroup");
                                                    that._resetAll();
                                                }
                                            });

                                        } else {
                                            that._oBusy.close();
                                            MessageBox.error(oData.Msg);

                                        }

                                    },
                                    error: function (e) {
                                        that._oBusy.close();
                                        MessageBox.error(e.responseText);
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

            onPaste: function (oEvent) {
                var laData = oEvent.getParameter("data"),
                    lvOrgeh = this.byId("id_Orgeh").getText(),
                    lvAction = 'PS',
                    lvDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd.MM.yyyy" }),
                    that = this,
                    lvError, lvMsg;

                var loModel = this.byId("id_splRequestTable").getModel("chgList"),
                    loData = loModel.getProperty("/data");

                var loModelPaste = new JSONModel({
                    Action: lvAction,
                    Zzdocid: this.getView().getModel("headerArray").getData().Zzdocid,
                    Zzorgeh: this.getView().getModel("headerArray").getData().Zzorgeh,
                    Zzpersa: this.getView().getModel("headerArray").getData().Zzpersa,
                    Zzbtrtl: this.getView().getModel("headerArray").getData().Zzbtrtl,

                    ChgHeader_to_ChgItem: []
                }),
                    loDataPaste = loModelPaste.getProperty("/ChgHeader_to_ChgItem");

                for (var i = 0; i < laData.length; i++) {

                    var lvPernr = laData[i][0],
                        lvDate = laData[i][1],
                        lvWsr = laData[i][2],
                        lvRmrks = laData[i][3],
                        lvWsrDx = this.formatDateString(lvDate),
                        lwEntry = {},
                        lvLine = i + 1;

                    var lwValidDate = this.isValidDate(lvWsrDx),
                        lvWsrD = this.formatDateUtc(lwValidDate.d),
                        lvIsValidDate = lwValidDate.isValid;

                    if (lvPernr === "") {
                        lwEntry.Status = "E";
                        lwEntry.FreeText = "Error";
                        lwEntry.Msg = "Please Fill Employee No.";
                    } else if (lvPernr.length > 8) {
                        lwEntry.Status = "E";
                        lwEntry.FreeText = "Error";
                        lwEntry.Msg = "Please add the correct Personel Number";
                    } else if (lvWsr === "") {
                        lwEntry.Status = "E";
                        lwEntry.FreeText = "Error";
                        lwEntry.Msg = "Please Fill Work Schedule Rule";
                    } else if (lvWsr.length > 8) {
                        lwEntry.Status = "E";
                        lwEntry.FreeText = "Error";
                        lwEntry.Msg = "Please add the correct Work Schedule Rule";
                    } else if (lvDate === "") {
                        lwEntry.Status = "E";
                        lwEntry.FreeText = "Error";
                        lwEntry.Msg = "Please Fill Work Schedule Rule Date";
                    } else if (lvIsValidDate === false) {
                        lwEntry.Status = "E";
                        lwEntry.FreeText = "Error";
                        lwEntry.Msg = "Invalid Work Schedule Rule Date";
                    } 
                    
                    // else if (lvDate.substring(0, 2) != '01' && lvDate.substring(0, 2) != '16') {
                    //     lwEntry.Status = "E";
                    //     lwEntry.FreeText = "Error";
                    //     lwEntry.Msg = "Invalid Work Schedule Rule Date, Please choose 1st or 16th in the future date";
                    // }

                    if (lwEntry.Status == 'E') {
                        lvError = 'X';
                        lvMsg = lwEntry.Msg + ' at line ' + lvLine;
                        break;
                    }

                    lwEntry.Zzorgeh = lvOrgeh;
                    lwEntry.Zzpernr = lvPernr;
                    lwEntry.Zzbegda = lvWsrD;
                    lwEntry.Zzschkz = lvWsr;
                    lwEntry.Zzrmrks = lvRmrks;

                    loDataPaste.push(lwEntry);
                }

                if (lvError != 'X') {
                    this._oBusy.open();
                    this.oModel.create("/zhr_ecgroup_headSet", loModelPaste.getData(),
                        {
                            async: false,
                            success: function (oData, oRes) {
                                if (oData.Status === "S") {

                                    if (typeof oData.ChgHeader_to_ChgItem !== "undefined" && oData.ChgHeader_to_ChgItem !== null && oData.ChgHeader_to_ChgItem.results.length > 0) {
                                        for (var i = 0; i < oData.ChgHeader_to_ChgItem.results.length; i++) {
                                            var lvDateFormatted = lvDateFormat.format(oData.ChgHeader_to_ChgItem.results[i].Zzbegda);

                                            if (oCheckArr.includes(oData.ChgHeader_to_ChgItem.results[i].Zzpernr + lvDateFormatted) === true) {
                                                oData.ChgHeader_to_ChgItem.results[i].FreeText = 'Error';
                                                oData.ChgHeader_to_ChgItem.results[i].Msg = 'Duplicate data Pernr and Work Schedule Rule Date';
                                                oData.ChgHeader_to_ChgItem.results[i].Status = 'E';
                                            }

                                            oCheckArr.push(oData.ChgHeader_to_ChgItem.results[i].Zzpernr + lvDateFormatted);

                                            if (typeof loData !== "undefined" && loData !== null && loData.length > 0) {
                                                //level validation
                                                var lvErr = '',
                                                    lvCekCurrent = '',
                                                    lvLowCurrent = oData.ChgHeader_to_ChgItem.results[i].TrfstPara1,
                                                    lvHighCurrent = oData.ChgHeader_to_ChgItem.results[i].TrfstPara2,
                                                    lvTrfstCurrent = oData.ChgHeader_to_ChgItem.results[i].TrfstPer;

                                                //X = Inside Range
                                                //Y = Outside Range
                                                if (lvLowCurrent != '' && lvHighCurrent != '' && oData.ChgHeader_to_ChgItem.results[i].Status != 'E') {

                                                    if (lvTrfstCurrent >= lvLowCurrent && lvTrfstCurrent <= lvHighCurrent) {
                                                        lvCekCurrent = 'X';
                                                    } else {
                                                        lvCekCurrent = 'Y';
                                                    }

                                                    for (var j = 0; j < loData.length; j++) {
                                                        if (lvErr == 'X') {
                                                            break;
                                                        }

                                                        var lvLow = loData[j].TrfstPara1,
                                                            lvHigh = loData[j].TrfstPara2,
                                                            lvTrfst = loData[j].TrfstPer,
                                                            lvCek = '';

                                                        if (lvTrfst >= lvLow && lvTrfst <= lvHigh) {
                                                            lvCek = 'X';
                                                        } else {
                                                            lvCek = 'Y';
                                                        }

                                                        if (lvCek != lvCekCurrent) {
                                                            lvErr = 'X';
                                                            oData.ChgHeader_to_ChgItem.results[i].FreeText = 'Error';
                                                            oData.ChgHeader_to_ChgItem.results[i].Msg = "All other submitted employee must at least be from level " + lvLowCurrent + " to level " + lvHighCurrent;
                                                            oData.ChgHeader_to_ChgItem.results[i].Status = 'E';
                                                        }
                                                    }
                                                }


                                                loData.push(oData.ChgHeader_to_ChgItem.results[i]);
                                            } else {
                                                loData = [];
                                                loData.push(oData.ChgHeader_to_ChgItem.results[i]);
                                            }
                                        }
                                    }

                                    loModel.setData({
                                        data: loData
                                    });

                                    that._oBusy.close();
                                    that._reset();

                                } else {
                                    that._oBusy.close();
                                    MessageBox.error(oData.Msg);
                                }

                            },
                            error: function (e) {
                                that._oBusy.close();
                                console.log(e.responseText);
                            }
                        });

                } else {
                    MessageBox.error(lvMsg);
                }

            }


        });
    });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Text",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    'sap/m/Token'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel, MessageBox, Dialog, Button, mobileLibrary, Text, Filter, FilterOperator, Fragment, Token) {
        "use strict";
        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("com.zhrxchangeshift.zhrxchangeshift.controller.MainECShift", {
            onInit: function () {

                this._oBusy = new sap.m.BusyDialog();

                this.oModel = this.getOwnerComponent().getModel();

                this._oCustomZzdocid = this.byId("idMultiDoc");
                this._oCustomZzorget = this.byId("Id_ComboZzorget");
                this._oCustomZzorgst = this.byId("Id_ComboZzorgst");
                this._oCustomZzdstatText = this.byId("Id_ComboZzdstatText");
 
                var that = this,
                    oInd,
                    oDataModel = this.oModel;
                this._oBusy.open();
                this.oModel.read("/zhr_ecshift_roleSet", {
                    async: false,
                    success: function (t) {
                        oInd = t.results[0].Indicator;
                        console.log(oInd);
                        var n = that.getView().byId("id_butCreate"),
                            e = that.getView().byId("id_butUpdate"),
                            d = that.getView().byId("id_butDelete"),
                            c = that.getView().byId("id_butCancel");
                        if (oInd === 'X' || oInd === 'Y') {
                            n.setVisible(true);
                            e.setVisible(true);
                            d.setVisible(true);
                            c.setVisible(true);
                        } else {
                            n.setVisible(false);
                            e.setVisible(false);
                            d.setVisible(false);
                            c.setVisible(false);
                        }

                        that.getView().setModel(oDataModel);
                        that.getView().getModel().updateBindings();
                        that._oBusy.close();
                    },
                    error: function (e) {
                        that._oBusy.close();
                        console.log(e);
                        MessageToast.show("Server Unreachable ")
                    }
                })


                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.subscribe("root", "update", this.onRoute, this);

            },

            onRoute: function (sChanel, sEvent, oData) {
                this.getView().getModel().updateBindings();
                this.oModel.refresh();
            },

            onClick: function (oEvent) {
                var oSel = this.getView().byId("id_butSegment").getSelectedKey();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if (oSel === "item") {
                    oRouter.navTo("MainChgItem");
                }
            },

            onCreateViewH: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CreateECShiftH");
            },

            onDetailView: function (oEvent) {
                this.oModel = this.getOwnerComponent().getModel();
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oTable = this.getView().byId("id_Table").getSelectedItem();
                var lvItem = oTable.getBindingContext().getObject().Zzdocid;
                oRouter.navTo("DetailECShift", {
                    DocumentID: window.encodeURIComponent(
                        lvItem
                    ),
                });
            },

            onUpdateView: function (oEvent) {
                this.oModel = this.getOwnerComponent().getModel();
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oTable = this.getView().byId("id_Table").getSelectedItem();
                var lvItem = oTable.getBindingContext().getObject().Zzdocid,
                    lvDstat = oTable.getBindingContext().getObject().ZzdstatText;
                if (lvDstat === "Draft") {
                    oRouter.navTo("UpdateECShift", {
                        DocumentID: window.encodeURIComponent(
                            lvItem
                        ),
                    });

                } else {
                    MessageBox.error("Cannot Update this Data, since the Data has been " + lvDstat);
                }

            },

            onCancelData: function (oEvent) {
                this.oModel = this.getOwnerComponent().getModel();
                var oTable2 = this.getView().byId("id_Table").getSelectedItem();
                var lvDocidOri = oTable2.getBindingContext().getObject().Zzdocid,
                    lvDstatOri = oTable2.getBindingContext().getObject().ZzdstatText;

                if (lvDocidOri !== '') {
                    // if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Do you want to Cancel this data?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Yes",
                            press: function () {
                                var oTable = this.getView().byId("id_Table").getSelectedItem();
                                var lvDocid = oTable.getBindingContext().getObject().Zzdocid,
                                    lvDstat = oTable.getBindingContext().getObject().ZzdstatText,
                                    that = this;
                                // if (lvDstat === "Posted to Approver 1") {
                                var oModel = new JSONModel({
                                    Action: 'CL',
                                    Zzdocid: lvDocid,
                                    ChgHeader_to_ChgItem: []
                                })

                                this._oBusy.open();
                                this.oModel.create("/zhr_ecshift_hSet", oModel.getData(), {
                                    async: false,
                                    success: function (eData, a) {
                                        if (eData.Status === "S") {
                                            that._oBusy.close();
                                            var oMsg = eData.Msg;
                                            MessageBox.success(oMsg, {
                                                onClose: function (oAction) {
                                                    var oEventBusi = sap.ui.getCore().getEventBus();
                                                    oEventBusi.publish("rooti", "update", "refresh");

                                                    that.getView().getModel().updateBindings();
                                                }
                                            });
                                        } else {
                                            that._oBusy.close();
                                            MessageBox.error(eData.Msg);
                                        }
                                    },
                                    error: function (e) {
                                        that._oBusy.close();
                                        MessageToast.show(e.message);
                                    }
                                });
                                // } else if (lvDstat === "Draft") {
                                //     MessageBox.error("Cannot Cancel this Data, since the Data has not been submitted ");
                                // } else {
                                //     MessageBox.error("Cannot Cancel this Data, since the Data has " + lvDstatOri);
                                // }
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

            onDeleteData: function (oEvent) {
                this.oModel = this.getOwnerComponent().getModel();
                var oTable2 = this.getView().byId("id_Table").getSelectedItem();
                var lvDocidOri = oTable2.getBindingContext().getObject().Zzdocid,
                    lvDstatOri = oTable2.getBindingContext().getObject().ZzdstatText;

                if (lvDocidOri !== '') {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Do you want to Delete this data?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Yes",
                            press: function () {
                                var oTable = this.getView().byId("id_Table").getSelectedItem();
                                var lvDocid = oTable.getBindingContext().getObject().Zzdocid,
                                    lvDstat = oTable.getBindingContext().getObject().ZzdstatText,
                                    that = this;
                                // if (lvDstat === "Draft") {
                                var oModel = new JSONModel({
                                    Action: 'DL',
                                    Zzdocid: lvDocid,
                                    ChgHeader_to_ChgItem: []
                                })

                                this._oBusy.open();
                                this.oModel.create("/zhr_ecshift_hSet", oModel.getData(), {
                                    async: false,
                                    success: function (eData, a) {
                                        if (eData.Status === "S") {
                                            that._oBusy.close();
                                            var oMsg = eData.Msg;
                                            MessageBox.success(oMsg, {
                                                onClose: function (oAction) {
                                                    var oEventBusi = sap.ui.getCore().getEventBus();
                                                    oEventBusi.publish("rooti", "update", "refresh");

                                                    that.getView().getModel().updateBindings();
                                                    that.oModel.refresh();
                                                }
                                            });

                                        } else {
                                            that._oBusy.close();
                                            MessageBox.error(eData.Msg);
                                        }
                                    },
                                    error: function (e) {
                                        that._oBusy.close();
                                        MessageToast.show(e.message);
                                    }
                                });
                                // } else {
                                //     MessageBox.error("Cannot Delete this Data, since the Data has been " + lvDstatOri);
                                // }
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
                    // }
                }

                this.oApproveDialog.open();
            },

            onBeforeRebindTable: function (oEvent) {
                var mBindingParams = oEvent.getParameter("bindingParams"),
                    aZzorget = this._oCustomZzorget.getSelectedItems(),
                    aZzorgst = this._oCustomZzorgst.getSelectedItems(),
                    aZzdstatText = this._oCustomZzdstatText.getSelectedItems(),
                    aZzdocid = this._oCustomZzdocid.getTokens(),
                    aZzdocidVal = this._oCustomZzdocid.getValue();

                if (aZzdocidVal !== '') {
                    mBindingParams.filters.push(
                        new Filter(
                            "Zzdocid",
                            FilterOperator.Contains,
                            aZzdocidVal
                        )
                    );
                }

                aZzorget.forEach(function (oSelectedItem) {
                    mBindingParams.filters.push(
                        new Filter(
                            "Zzorget",
                            FilterOperator.EQ,
                            oSelectedItem.getKey()
                        )
                    );
                });

                aZzorgst.forEach(function (oSelectedItem) {
                    mBindingParams.filters.push(
                        new Filter(
                            "Zzorgst",
                            FilterOperator.EQ,
                            oSelectedItem.getKey()
                        )
                    );
                });

                aZzdstatText.forEach(function (oSelectedItem) {
                    mBindingParams.filters.push(
                        new Filter(
                            "ZzdstatText",
                            FilterOperator.EQ,
                            oSelectedItem.getKey()
                        )
                    );
                });

                aZzdocid.forEach(function (oSelectedItem) {
                    mBindingParams.filters.push(
                        new Filter(
                            "Zzdocid",
                            FilterOperator.EQ,
                            oSelectedItem.getText()
                        )
                    );
                });

            },

            customFieldChange: function (oEvent) {
                var oControl = oEvent.getSource(),
                    bHasValue = false;

                if (oControl.getSelectedKeys().length > 0) {
                    bHasValue = true;
                }
                oControl.data("hasValue", bHasValue);
            },

            //Docid
            handleValueHelpDoc: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();

                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.zhrxchangeshift.zhrxchangeshift.view.fragment.ValueHelpDialogDoc",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    // create a filter for the binding
                    oValueHelpDialog.getBinding("items").filter([new Filter(
                        "Zzdocid",
                        FilterOperator.Contains,
                        sInputValue
                    )]);
                    // open value help dialog filtered by the input value
                    oValueHelpDialog.open(sInputValue);
                });
            },

            _handleValueHelpSearchDoc: function (evt) {
                var sValue = evt.getParameter("value");
                var oFilter = new Filter(
                    "Zzdocid",
                    FilterOperator.Contains,
                    sValue
                );
                evt.getSource().getBinding("items").filter([oFilter]);
            },

            _handleValueHelpCloseDoc: function (evt) {
                var aSelectedItems = evt.getParameter("selectedItems"),
                    oMultiInput = this.byId("idMultiDoc");

                if (aSelectedItems && aSelectedItems.length > 0) {
                    aSelectedItems.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getTitle()
                        }));
                    });
                }
            }

        });
    });

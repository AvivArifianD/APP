sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/ui/core/Core"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel, MessageBox, Dialog, Button, mobileLibrary, Text, TextArea, Core) {
        "use strict";
        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("com.zhrxchangegroup.zhrxchangegroup.controller.MainECGroup", {
            onInit: function () {

                this._oBusy = new sap.m.BusyDialog();
                this.oModel = this.getOwnerComponent().getModel();
                var that = this,
                    oInd,
                    oDataModel = this.oModel;
                this._oBusy.open();
                this.oModel.read("/zhr_ecgroup_roleSet", {
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
                        MessageToast.show("Server Unreachable")
                    }
                })


                var loEventBus = sap.ui.getCore().getEventBus();
                loEventBus.subscribe("root", "update", this.onRoute, this);

            },

            onRoute: function (sChanel, sEvent, oData) {
                if (typeof this.getView().getModel() !== "undefined") {
                    this.getView().getModel().updateBindings();
                }
                this.oModel.refresh();
            },

            onCreateViewH: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CreateECGroupH");
            },

            onDetailView: function (oEvent) {
                const loRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var loTable = this.getView().byId("id_Table").getSelectedItem();
                var lvItem = loTable.getBindingContext().getObject().Zzdocid;
                loRouter.navTo("DetailECGroup", {
                    DocumentID: window.encodeURIComponent(
                        lvItem
                    ),
                });
            },

            onUpdateView: function (oEvent) {
                const loRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var loTable = this.getView().byId("id_Table").getSelectedItem(),
                    lvItem = loTable.getBindingContext().getObject().Zzdocid;

                var loModel = new JSONModel({
                    Action: 'TU',
                    Zzdocid: lvItem,
                    ChgHeader_to_ChgItem: []
                })

                this.oModel.create("/zhr_ecgroup_headSet", loModel.getData(), {
                    async: false,
                    success: function (oData, a) {
                        if (oData.Status === "S") {
                            loRouter.navTo("UpdateECGroup", {
                                DocumentID: window.encodeURIComponent(
                                    lvItem
                                ),
                            });
                        } else {
                            MessageBox.error(oData.Msg);
                        }
                    },
                    error: function (oError) {
                        MessageToast.show(oError.message);
                    }
                });

            },

            onCancelData: function (oEvent) {
                var loTable2 = this.getView().byId("id_Table").getSelectedItem(),
                    lvDocidOri = loTable2.getBindingContext().getObject().Zzdocid,
                    that = this;

                that._DocidOri = lvDocidOri;
                if (that._DocidOri !== '') {
                    var lvQuestion = "Do you want to Cancel this Document ?";
                    if (!this.oApproveDialog2) {
                        this.oApproveDialog2 = new Dialog({
                            type: DialogType.Message,
                            title: lvQuestion,
                            content: [
                                new TextArea("confirmationNote", {
                                    width: "100%",
                                    placeholder: "Add Remarks (optional)",
                                })
                            ],
                            beginButton: new Button({
                                type: ButtonType.Emphasized,
                                text: "Yes",
                                press: function () {
                                    var sText = Core.byId("confirmationNote").getValue();
                                    var lvlength = sText.length;
                                    if (lvlength <= 255) {
                                        var oModel = new JSONModel({
                                            Action: 'CL',
                                            Zzdocid: that._DocidOri,
                                            Zzcnrmrk: sText,
                                            ChgHeader_to_ChgItem: []
                                        })

                                        this._oBusy.open();
                                        this.oModel.create("/zhr_ecgroup_headSet", oModel.getData(), {
                                            async: false,
                                            success: function (oData, a) {
                                                if (oData.Status === "S") {
                                                    that._oBusy.close();
                                                    that._DocidOri = '';
                                                    var loMsg = oData.Msg;
                                                    MessageBox.success(loMsg, {
                                                        onClose: function (oAction) {
                                                            var loEventBus = sap.ui.getCore().getEventBus();
                                                            loEventBus.publish("root", "update");

                                                            that.getView().getModel().updateBindings();
                                                        }
                                                    });
                                                } else {
                                                    that._DocidOri = '';
                                                    that._oBusy.close();
                                                    MessageBox.error(oData.Msg);
                                                }
                                            },
                                            error: function (e) {
                                                that._DocidOri = '';
                                                that._oBusy.close();
                                                MessageToast.show(e.message);
                                            }
                                        });

                                    } else {
                                        MessageBox.error('Note more than 255 character');
                                    }

                                    Core.byId("confirmationNote").setValue("");
                                    that._DocidOri = '';
                                    this.oApproveDialog2.close();
                                }.bind(this)
                            }),
                            endButton: new Button({
                                text: "Cancel",
                                press: function () {
                                    this.oApproveDialog2.close();
                                }.bind(this)
                            })
                        });
                    }
                }
                this.oApproveDialog2.open();
            },

            onDeleteData: function (oEvent) {
                var LoTable2 = this.getView().byId("id_Table").getSelectedItem(),
                    lvDocidOri = LoTable2.getBindingContext().getObject().Zzdocid,
                    that = this;

                    that._DocidOri = lvDocidOri;
                if (lvDocidOri !== '') {
                    if (!this.oApproveDialog) {
                        this.oApproveDialog = new Dialog({
                            type: DialogType.Message,
                            title: "Confirm",
                            content: new Text({ text: "Do you want to Delete this data?" }),
                            beginButton: new Button({
                                type: ButtonType.Emphasized,
                                text: "Yes",
                                press: function () {
                                    var loModel = new JSONModel({
                                        Action: 'DL',
                                        Zzdocid: that._DocidOri,
                                        ChgHeader_to_ChgItem: []
                                    })

                                    this._oBusy.open();
                                    this.oModel.create("/zhr_ecgroup_headSet", loModel.getData(), {
                                        async: false,
                                        success: function (oData, a) {
                                            if (oData.Status === "S") {
                                                that._oBusy.close();
                                                that._DocidOri = '';
                                                var loMsg = oData.Msg;
                                                MessageBox.success(loMsg, {
                                                    onClose: function (oAction) {
                                                        var loEventBus = sap.ui.getCore().getEventBus();
                                                        loEventBus.publish("root", "update");

                                                        that.getView().getModel().updateBindings();
                                                        that.oModel.refresh();
                                                    }
                                                });

                                            } else {
                                                that._oBusy.close();
                                                that._DocidOri = '';
                                                MessageBox.error(oData.Msg);
                                            }
                                        },
                                        error: function (oError) {
                                            that._oBusy.close();
                                            that._DocidOri = '';
                                            MessageToast.show(oError.message);
                                        }
                                    });
                                    that._DocidOri = '';
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
                }
                this.oApproveDialog.open();
            }

        });
    });

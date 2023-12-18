sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    'sap/m/Token'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Fragment, Token) {
        "use strict";

        return Controller.extend("com.zhrxovertime.zhrxovertime.controller.MainOvtItem", {
            onInit: function () {

                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oModel);

                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.subscribe("rooti", "update", this.onRoute, this);
                this._oCustomZzdocid = this.byId("idMultiDoc");
                this._oCustomZzpernr = this.byId("idMultiPer");
                this._oCustomZzestatText = this.byId("Id_ComboZzestatText");

            },

            onRoute: function (sChanel, sEvent, oData) {
                this.getView().getModel().updateBindings();
                this.oModel.refresh();
            },

            onClick: function(oEvent) {
                var oSel = this.getView().byId("id_butSegment").getSelectedKey();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if (oSel === "header") {
                    oRouter.navTo("RouteMainOvertime");
                }
            },

            onBeforeRebindTable: function (oEvent) {
                var mBindingParams = oEvent.getParameter("bindingParams"),
                    aZzestatText = this._oCustomZzestatText.getSelectedItems(),
                    aZzdocid = this._oCustomZzdocid.getTokens(),
                    aZzdocidVal = this._oCustomZzdocid.getValue(),
                    aZzpernr = this._oCustomZzpernr.getTokens(),
                    aZzpernrVal = this._oCustomZzpernr.getValue();

                if (aZzdocidVal !== '') {
                    mBindingParams.filters.push(
                        new Filter(
                            "Zzdocid",
                            FilterOperator.Contains,
                            aZzdocidVal
                        )
                    );
                }

                if (aZzpernrVal !== '') {
                    mBindingParams.filters.push(
                        new Filter(
                            "Zzpernr",
                            FilterOperator.Contains,
                            aZzpernrVal
                        )
                    );
                }

                aZzestatText.forEach(function (oSelectedItem) {
                    mBindingParams.filters.push(
                        new Filter(
                            "ZzestatTxt",
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

                aZzpernr.forEach(function (oSelectedItem) {
                    mBindingParams.filters.push(
                        new Filter(
                            "Zzpernr",
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
                if (!this._pValueHelpDialogDoc) {
                    this._pValueHelpDialogDoc = Fragment.load({
                        id: oView.getId(),
                        name: "com.zhrxovertime.zhrxovertime.view.fragment.ValueHelpDialogDoc",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                this._pValueHelpDialogDoc.then(function (oValueHelpDialog) {
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
            },


            //Pernr
            handleValueHelpPer2: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();

                // create value help dialog
                if (!this._pValueHelpDialogPer) {
                    this._pValueHelpDialogPer = Fragment.load({
                        id: oView.getId(),
                        name: "com.zhrxovertime.zhrxovertime.view.fragment.ValueHelpDialogPer2",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                this._pValueHelpDialogPer.then(function (oValueHelpDialog) {
                    // create a filter for the binding
                    oValueHelpDialog.getBinding("items").filter([new Filter(
                        "Pernr",
                        FilterOperator.Contains,
                        sInputValue
                    )]);
                    // open value help dialog filtered by the input value
                    oValueHelpDialog.open(sInputValue);
                });
            },

            _handleValueHelpSearchPer2: function (evt) {
                var sValue = evt.getParameter("value");
                var oFilter = new Filter(
                    "Pernr",
                    FilterOperator.Contains,
                    sValue
                );
                evt.getSource().getBinding("items").filter([oFilter]);
            },

            _handleValueHelpClosePer2: function (evt) {
                var aSelectedItems = evt.getParameter("selectedItems"),
                    oMultiInput = this.byId("idMultiPer");

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

sap.ui.define([
    "com/zsdlku/zsdxlku/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (B, Controller, JSONModel, formatter, MessageToast, MessageBox) {
        "use strict";

        return B.extend("com.zsdlku.zsdxlku.controller.EditLku", {
            onInit: function () {

                this._initiateModel();
                this.getRouter().getRoute("EditLku").attachPatternMatched(this._onDefaultMatched, this);
                this.oErrorHandler = this.getOwnerComponent().getErrorHandler();
                this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

            },

            _initiateModel: function () {
                var loViewModel = new JSONModel({
                    busy: false,
                    delay: 0,
                    CurDate: formatter.sapDateFormat(new Date()),
                    "edit-mode": false,
                    "EditDisplay-Txt": "Edit",
                    "EditDisplay-icon": "sap-icon://edit",
                    "display-enable": false,
                    "edit-enable": false
                });

                this.setModel(loViewModel, "EditLkuView");

                this._initFieldControl();

            },

            _initFieldControl: function () {
                this.oFieldControlModel = new JSONModel({
                    "head-Save-editable": false,
                    "head-Save-visible": true,
                    "info-AlamatPer-visible": false,
                    "info-AlamatPer-editable": false,
                    "info-AlamatPer-visible": false,
                    "info-AlamatPer-required": false,
                    "info-AlamatKun-editable": false,
                    "info-AlamatKun-visible": false,
                    "info-AlamatKun-required": false,
                    "info-TelNumber-editable": false,
                    "info-TelNumber-visible": false,
                    "info-TelNumber-required": false,
                    "info-TelExtens-editable": false,
                    "info-TelExtens-visible": false,
                    "info-TelExtens-required": false,
                    "info-MerkDagang-editable": false,
                    "info-MerkDagang-visible": false,
                    "info-MerkDagang-required": false,
                    "info-Website-editable": false,
                    "info-Website-visible": false,
                    "info-Website-required": false,
                    "info-ReqLimit-editable": false,
                    "info-ReqLimit-visible": false,
                    "info-ReqLimit-required": true,
                    "info-ReqLimit-valueState": "None",
                    "info-ReqLimit-valueStateMsg": '',
                    "info-ReqTop-editable": false,
                    "info-ReqTop-visible": false,
                    "info-ReqTop-required": true,
                    "info-ReqTop-valueState": "None",
                    "info-ReqTop-valueStateMsg": '',
                    "info-ReqTopTxt-editable": false,
                    "info-ReqTopTxt-visible": false,
                    "info-ReqTopTxt-required": false,
                    "info-MillProductType-editable": false,
                    "info-MillProductType-visible": false,
                    "info-MillProductType-required": false
                });

                this.setModel(this.oFieldControlModel, "fieldControl");
            },

            _onMetadataLoaded: function () {
                var loViewModel = this.getModel("EditLkuView");
                // Binding the view will set it to not busy - so the view is always busy if it is not bound
                loViewModel.setProperty("/busy", true);
            },

            _onDefaultMatched: function (oEvent) {
                var lvActivityId = oEvent.getParameter("arguments").ActivityId;

                var lvObjectPath = this.getModel().createKey("zsd_lku_headSet", {
                    ActivityId: lvActivityId
                });

                this.getModel().metadataLoaded().then(function () {
                    this._bindView("/" + lvObjectPath);
                }.bind(this));

            },

            /**
         * Binds the view to the object path. Makes sure that detail view displays
         * a busy indicator while data for the corresponding element binding is loaded.
         * @function
         * @param {string} sObjectPath path to the object to be bound to the view.
         * @private
         */
            _bindView: function (sObjectPath) {
                // Set busy indicator during view binding
                var loViewModel = this.getModel("EditLkuView");

                // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
                loViewModel.setProperty("/busy", false);

                this.getView().bindElement({
                    path: sObjectPath,
                    parameters: { expand: 'head_to_info' },
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function () {
                            loViewModel.setProperty("/busy", true);
                        },
                        dataReceived: function () {
                            loViewModel.setProperty("/busy", false);
                        }
                    }
                });
            },

            _onBindingChange: function () {
                var loView = this.getView(),
                    loElementBinding = loView.getElementBinding();

                // No data for the binding
                if (!loElementBinding.getBoundContext()) {
                    this.getRouter().getTargets().display("detailObjectNotFound");
                    return;
                }

                var lvPath = loElementBinding.getPath(),
                    laHead = loView.getModel().getObject(lvPath),
                    laInfo = loView.getModel().getObject((lvPath || "") + "/" + "head_to_info");

                // No data 
                if (!laHead) {
                    this.getRouter().getTargets().display("detailObjectNotFound");
                    return;
                }
            },

            onToggleEdit: function () {
                var loViewModel = this.getModel("EditLkuView");

                if (loViewModel.getProperty("/edit-mode") === false) {
                    loViewModel.setProperty("/EditDisplay-Txt", "Display");
                    loViewModel.setProperty("/EditDisplay-icon", "sap-icon://display");
                    loViewModel.setProperty("/edit-mode", true);
                    this._setFieldControl(this.getModel("EditLkuView").getProperty("/edit-enable"));
                    jQuery.sap.delayedCall(300, this, function () {
                        MessageToast.show("Edit Mode");
                    });
                } else {
                    loViewModel.setProperty("/EditDisplay-Txt", "Edit");
                    loViewModel.setProperty("/edit-mode", false);
                    loViewModel.setProperty("/EditDisplay-icon", "sap-icon://edit");
                    this._setFieldControl(this.getModel("EditLkuView").getProperty("/edit-enable"));
                    jQuery.sap.delayedCall(300, this, function () {
                        MessageToast.show("Display Mode");
                    });
                }
            },

            _setFieldControl: function (bEditEnable) {
                var bEditMode = this.getModel("EditLkuView").getProperty("/edit-mode");

                this.oFieldControlModel.setProperty("/info-AlamatPer-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-AlamatKun-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-TelNumber-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-TelExtens-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-MerkDagang-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-Website-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-ReqLimit-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-ReqTop-visible", bEditMode);
                this.oFieldControlModel.setProperty("/info-ReqTop-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-ReqTopTxt-visible", bEditMode);
                this.oFieldControlModel.setProperty("/info-MillProductType-visible", bEditMode);
                this.oFieldControlModel.setProperty("/info-MillProductType-editable", bEditMode);
                this.oFieldControlModel.setProperty("/info-MillProductType-editable", bEditMode);
                this.oFieldControlModel.setProperty("/head-Save-editable", bEditMode);



                // this.oFieldControlModel.setProperty("/info-AlamatPer-editable", bEditMode);
                // this.oFieldControlModel.setProperty("/info-AlamatPer-editable", bEditMode);
                // this.oFieldControlModel.setProperty("/info-AlamatPer-editable", bEditMode);


                // aEditableFields.forEach(element => {

                //     var oEditable = oView.getModel().getObject("/" + element),
                //         sPathEditable = "/" + oEditable.EntityName + "-" + oEditable.Name + "-" + "editable",
                //         sPathRequired = "/" + oEditable.EntityName + "-" + oEditable.Name + "-" + "required";

                //     if (bEditMode === true) {
                //         if (oEditable.Editable) this.oFieldControlModel.setProperty(sPathEditable, bEditEnable);
                //         if (bEditEnable === true) this.oFieldControlModel.setProperty(sPathRequired, oEditable.Required);
                //     } else {
                //         this.oFieldControlModel.setProperty(sPathEditable, false);
                //         this.oFieldControlModel.setProperty(sPathRequired, false);
                //     }

                // });

            },

            onSaveLku: function (oEvent) {
                if (!this._valBeforeSave()) {
                    return false;
                } else {
                }
            },

            _valBeforeSave: function () {
                var isValid = true,
                    lvValid = true,
                    loView = this.getView(),
                    loElementBinding = loView.getElementBinding();

                // No data for the binding
                if (!loElementBinding.getBoundContext()) {
                    this.getRouter().getTargets().display("detailObjectNotFound");
                    return;
                }

                var lvPath = loElementBinding.getPath(),
                    laHead = loView.getModel().getObject(lvPath),
                    laInfo = loView.getModel().getObject((lvPath || "") + "/" + "head_to_info");

                lvValid = this._checkRequired({
                    required: this.oFieldControlModel.getProperty("/info-ReqLimit-required"),
                    type: 'CURR',
                    value: laInfo.ReqLimit,
                    pathValueState: "/info-ReqLimit-valueState",
                    pathValueStateMsg: "/info-ReqLimit-valueStateMsg"
                });

                if (lvValid == false) {
                    isValid = lvValid;
                }

                lvValid = '';

                lvValid = this._checkRequired({
                    required: this.oFieldControlModel.getProperty("/info-ReqTop-required"),
                    type: 'CHAR',
                    value: laInfo.ReqTop,
                    pathValueState: "/info-ReqTop-valueState",
                    pathValueStateMsg: "/info-ReqTop-valueStateMsg"
                });

                if (lvValid == false) {
                    isValid = lvValid;
                }

                lvValid = '';

                if (isValid == false) {
                    MessageBox.error("Please Fill Required Fields");
                }



            },

            _checkRequired: function (oParams) {
                var bValid = true,
                    sValueStateMsg = '';

                this.oFieldControlModel.setProperty(oParams.pathValueState, "None");
                this.oFieldControlModel.setProperty(oParams.pathValueStateMsg, "");

                if (oParams.required === true && oParams.type === 'CHAR' &&
                    (oParams.value === null || oParams.value === "")) {
                    this.oFieldControlModel.setProperty(oParams.pathValueState, sap.ui.core.ValueState.Error);
                    sValueStateMsg = "Field required";
                    this.oFieldControlModel.setProperty(oParams.pathValueStateMsg, sValueStateMsg);
                    bValid = false;
                } else if(oParams.required === true && oParams.type === 'CURR' &&
                    (oParams.value === null || oParams.value === "" || oParams.value == 0)) {
                    this.oFieldControlModel.setProperty(oParams.pathValueState, sap.ui.core.ValueState.Error);
                    sValueStateMsg = "Field required";
                    this.oFieldControlModel.setProperty(oParams.pathValueStateMsg, sValueStateMsg);
                    bValid = false;
                }

                return bValid;
            },



        });
    });

/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/zsdlku/zsdxlku/model/models",
    "./controller/ErrorHandler"
],
    function (UIComponent, Device, models, ErrorHandler) {
        "use strict";

        return UIComponent.extend("com.zsdlku.zsdxlku.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // // call the base component's init function
                // UIComponent.prototype.init.apply(this, arguments);

                // // enable routing
                // this.getRouter().initialize();

                // // set the device model
                // this.setModel(models.createDeviceModel(), "device");

                // this.oListSelector = new ListSelector();
                this.oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
                this.oMessageManager = sap.ui.getCore().getMessageManager();
                this.oMessageManager.registerMessageProcessor(this.oMessageProcessor);
                this._oErrorHandler = new ErrorHandler(this, this.oMessageProcessor, this.oMessageManager);

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                // call the base component's init function and create the App view
                UIComponent.prototype.init.apply(this, arguments);

                // create the views based on the url/hash
                this.getRouter().initialize();

                //global Custom Configuration Currency Format
                sap.ui.getCore().getConfiguration().getFormatSettings().addCustomCurrencies({

                    "IDR": { // overwrite of an existing CLDR currency
                        "digits": 0
                    }
                });
            },

            getErrorHandler: function () {
                return this._oErrorHandler;
            },

            /**
             * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
             * design mode class should be set, which influences the size appearance of some controls.
             * @public
             * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
             */
            getContentDensityClass: function () {
                if (this._sContentDensityClass === undefined) {
                    // check whether FLP has already set the content density class; do nothing in this case
                    // eslint-disable-next-line fiori-custom/sap-no-proprietary-browser-api
                    if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                        this._sContentDensityClass = "";
                    } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else {
                        // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
            }
        });
    }
);
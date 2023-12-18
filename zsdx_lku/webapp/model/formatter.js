sap.ui.define([], function () {
    "use strict";

    return {
        /**
         * Rounds the currency value to 2 digits
         *
         * @public
         * @param {string} sValue value to be formatted
         * @returns {string} formatted currency value with 2 digits
         */
        currencyValue : function (sValue) {
            if (!sValue) {
                return "";
            }

            return parseFloat(sValue).toFixed(2);
        },

        sapDateFormat : function (oDate){
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy"
            });
            return dateFormat.format(oDate); 
        },

        changeDateToUTC: function(oDate){ //for sending dates to backend
            if(Object.prototype.toString.call(oDate) === '[object Date]'){
                var oTempDate = new Date(oDate.setHours("00","00","00","00"));
                oDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (-60000));
                return oDate;
            }
            
        }
    };
});
let enums = require('./stock_enum');
let db = require('./database');

function htmlCodeInfo(productId, callback) {
    let conn = db.connectToStock();
    conn.execute(`select code from products where id = '${productId}'`,
    function(error, results, fields){
        if (error) throw error;
        if (db.checkResults(results) && checkField(results, "code")) {
            callback(`<p>${results[0]["code"]}</p>`);
        } else {
            callback(null);
        }
    });
}

function htmlNameInfo(productId, callback) {
    /** implement */
}

function htmlDescriptionInfo(productId, callback) {
    /** implement */
}

function htmlQuantityField(productId, callback) {
    /** implement */
}

function htmlIncrementButton(productId, callback) {
    /** implement */
}

function htmlDecrementButton(productId, callback) {
    /** implement */
}

function htmlActionButton(productId, callback) {
    /** implement */
}

function htmlActionInfo(productId, callback) {
    /** implement */
}

function htmlPriceInfo(productId, callback) {
    /** implement */
}

function checkField(results, field) {
    return (results[0][field] != null && results[0][field] != undefined &&
            results[0][field] !== "");
}

class StockFields {
    constructor(stockType, classicalType) {
        this.stockType = stockType;
        this.classicalType = classicalType;

        this.mandatoryRefs = [];
        this.optionalRefs = [];
        this.addMandatoryField();
        this.addOptionalFields();
    }

    addMandatoryField() {
        this.addCodeInfo();
        this.addNameInfo();
    }

    addCodeInfo() {
        this.mandatoryRefs.push(htmlCodeInfo);
    }

    addNameInfo() {
        this.mandatoryRefs.push(htmlNameInfo);
    }

    addOptionalFields() {
        this.addQuantityField();
        this.addIncrementButton();
        this.addDecrementButton();
        this.addActionButton();
    }

    addQuantityField() {
        if (this.stockType == enums.StockEnum.CLASSICAL) {
            this.optionalRefs.push(htmlQuantityField);
        }
    }

    addIncrementButton() {
        if (this.stockType == enums.StockEnum.CLASSICAL) {
            this.optionalRefs.push(htmlIncrementButton);
        }
    }

    addDecrementButton() {
        if (this.stockType == enums.StockEnum.CLASSICAL) {
            this.optionalRefs.push(htmlDecrementButton);
        }
    }

    addActionButton() {
        if (this.stockType == enums.StockEnum.ACTION) {
            this.optionalRefs.push(htmlActionButton);
        }
    }
}

class StockReportFields {
    constructor(stockType, classicalType) {
        this.stockType = stockType;
        this.classicalType = classicalType;

        this.mandatoryRefs = [];
        this.optionalRefs = [];
        this.addMandatoryField();
        this.addOptionalFields();
    }

    addMandatoryField() {
        this.addCodeInfo();
        this.addNameInfo();
        this.addDescriptionInfo();
    }

    addCodeInfo() {
        this.mandatoryRefs.push(htmlCodeInfo);
    }

    addNameInfo() {
        this.mandatoryRefs.push(htmlNameInfo);
    }

    addDescriptionInfo() {
        this.mandatoryRefs.push(htmlDescriptionInfo);
    }

    addOptionalFields() {
        this.addActionInfo();
        this.addQuantityInfo();
        this.addPriceInfo();
    }

    addActionInfo() {
        if (this.stockType == enums.StockEnum.ACTION) {
            this.optionalRefs.push(htmlActionInfo);
        }
    }

    addQuantityInfo() {
        if (this.stockType == enums.StockEnum.CLASSICAL) {
            this.optionalRefs.push(htmlQuantityField);
        }
    }

    addPriceInfo() {
        if (this.stockType == enums.StockEnum.CLASSICAL &&
            this.classicalType != enums.ClassicalEnum.QUANTITY) {
            this.optionalRefs.push(htmlPriceInfo);
        }
    }
}

class Stock {
    constructor(stockType, classicalType) {
        this.stockType = stockType;
        this.classicalType = classicalType;

        this.fields = new StockFields(this.stockType, this.classicalType);
        this.reportFields = new StockReportFields(this.stockType, this.classicalType);

        this.setReportFields();
    }

    getMandatoryFields() {
        return this.fields.mandatoryRefs;
    }

    getOptionalFields() {
        return this.fields.optionalRefs;
    }

    getReportMandatoryFields(){
        return this.reportFields.mandatoryRefs;
    }

    getReportOptionalFields() {
        return this.reportFields.optionalRefs;
    }
}

function addStock(map, code, stockType, classicalType = null) {
    map[code] = new Stock(stockType, classicalType);
    return map;
}

function removeStock(map, code) {
    if (map.hasOwnProperty(code)) {
        delete map[code];
    }
    return map;
}

module.exports = { addStock, removeStock };
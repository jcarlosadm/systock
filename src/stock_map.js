let enums = require('./stock_enum');
let db = require('./database');

function htmlCodeInfo(productId, callback) {
    let conn = db.connectToStock();
    conn.execute(buildQuery("code", "products", "id", productId),
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
    let conn = db.connectToStock();
    conn.execute(buildQuery("name", "products", "id", productId),
    function(error, results, fields){
        if (error) throw error;
        if (db.checkResults(results) && checkField(results, "name")) {
            callback(`<p>${results[0]['name']}</p>`);
        } else {
            callback(null);
        }
    });
}

function htmlDescriptionInfo(productId, callback) {
    let conn = db.connectToStock();
    conn.execute(buildQuery("description", "products", "id", productId),
    function(error, results, fields){
        if (error) throw error;
        if (db.checkResults(results) && checkField(results, "description")) {
            callback(`<p>${results[0]['description']}</p>`);
        } else {
            callback(null);
        }
    });
}

function htmlQuantityField(productId, callback) {
    let conn = db.connectToStock();
    conn.execute(buildQuery("quantity", "quantities", "product_id", productId), 
    function(error, results, fields){
        if (error) throw error;
        if (results != null && result != undefined) {
            let total = 0;
            for(let i = 0; i < results.length; ++i){
                total += results[i]["quantity"];
            }
            callback(`<p>${total}</p>`);
        } else {
            callback(null);
        }
    });
}

function htmlIncrementButton(productId, callback) {
    // TODO: implement
}

function htmlDecrementButton(productId, callback) {
    // TODO: implement
}

function htmlActionButton(productId, callback) {
    // TODO: implement
}

function htmlActionInfo(productId, callback) {
    let conn = db.connectToStock();
    conn.execute(buildQuery("action", "actions", "product_id", productId),
    function(error, results, fields){
        if (error) throw error;
        if (results != null && results != undefined) {
            let actions = "";
            for (let i = 0; i < results.length; ++i) {
                actions += `<p>${results[0]["action"]}</p>`;
                if ((i+1) < results.length) {
                    actions += "<br>";
                }
            }
            callback(actions);
        } else {
            callback(null);
        }
    });
}

function htmlPriceInfo(productId, callback) {
    // TODO: implement
}

function buildQuery(field, table, field_compare, productId) {
    return `select ${field} from ${table} where ${field_compare} = '${productId}'`;
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
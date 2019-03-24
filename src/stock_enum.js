const StockEnum = Object.freeze({
    "ACTION":1,
    "CLASSICAL":2
});

const ClassicalEnum = Object.freeze({
    "FIFO": 1,
    "LIFO": 2,
    "WEIGHTED_AVERAGE":3,
    "QUANTITY": 4
});

module.exports = { StockEnum, ClassicalEnum };
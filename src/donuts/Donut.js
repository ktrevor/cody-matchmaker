"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFormat = void 0;
exports.formatDate = formatDate;
var dayjs_1 = require("dayjs");
function formatDate(date) {
    return (0, dayjs_1.default)(date).format("ddd, MMM D, YYYY");
}
exports.dateFormat = ["ddd, MMM D, YYYY"];

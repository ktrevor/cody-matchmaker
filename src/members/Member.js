"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextGrade = void 0;
var getNextGrade = function (currentGrade) {
    var grades = ["Freshman", "Sophmore", "Junior", "Senior"];
    var currentIndex = grades.indexOf(currentGrade);
    if (currentIndex === grades.length - 1) {
        return null;
    }
    return grades[currentIndex + 1];
};
exports.getNextGrade = getNextGrade;

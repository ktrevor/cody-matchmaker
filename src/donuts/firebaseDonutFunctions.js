"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.getDonutById = exports.getDonuts = exports.deleteDonut = exports.editDonut = exports.addDonut = void 0;
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("../firebase/firebase");
var matchmaker_1 = require("../matchmaker/matchmaker");
var firebaseGroupFunctions_1 = require("../groups/firebaseGroupFunctions");
var addDonut = function (donut) { return __awaiter(void 0, void 0, void 0, function () {
    var newDonut, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = [__assign({}, donut)];
                _b = { date: firestore_1.Timestamp.fromDate(donut.date.toDate()) };
                return [4 /*yield*/, (0, matchmaker_1.makeGroups)()];
            case 1:
                newDonut = __assign.apply(void 0, _a.concat([(_b.groupIds = _c.sent(), _b.sent = false, _b)]));
                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "donuts"), newDonut)];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.addDonut = addDonut;
var editDonut = function (oldData, newData) { return __awaiter(void 0, void 0, void 0, function () {
    var donutRef, updatedFields, updateDonut;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                donutRef = (0, firestore_1.doc)(firebase_1.db, "donuts", oldData.id);
                updatedFields = {};
                if (oldData.name !== newData.name)
                    updatedFields.name = newData.name;
                if (oldData.date !== newData.date.toDate())
                    updatedFields.date = newData.date;
                if (!(Object.keys(updatedFields).length > 0)) return [3 /*break*/, 2];
                updateDonut = __assign(__assign({}, updatedFields), { date: firestore_1.Timestamp.fromDate(newData.date.toDate()) });
                return [4 /*yield*/, (0, firestore_1.updateDoc)(donutRef, updateDonut)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.editDonut = editDonut;
var deleteDonut = function (donut) { return __awaiter(void 0, void 0, void 0, function () {
    var deleteGroups, donutRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deleteGroups = donut.groups.map(function (group) { return __awaiter(void 0, void 0, void 0, function () {
                    var groupRef;
                    return __generator(this, function (_a) {
                        groupRef = (0, firestore_1.doc)(firebase_1.db, "groups", group.id);
                        return [2 /*return*/, (0, firestore_1.deleteDoc)(groupRef)];
                    });
                }); });
                return [4 /*yield*/, Promise.all(deleteGroups)];
            case 1:
                _a.sent();
                donutRef = (0, firestore_1.doc)(firebase_1.db, "donuts", donut.id);
                return [4 /*yield*/, (0, firestore_1.deleteDoc)(donutRef)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteDonut = deleteDonut;
var getDonuts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var donutsCollection, querySnapshot, donuts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                donutsCollection = (0, firestore_1.collection)(firebase_1.db, "donuts");
                return [4 /*yield*/, (0, firestore_1.getDocs)(donutsCollection)];
            case 1:
                querySnapshot = _a.sent();
                if (querySnapshot.empty)
                    return [2 /*return*/, []];
                return [4 /*yield*/, Promise.all(querySnapshot.docs.map(function (doc) { return __awaiter(void 0, void 0, void 0, function () {
                        var donutData, groups, date;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    donutData = doc.data();
                                    return [4 /*yield*/, Promise.all(donutData.groupIds.map(function (groupId) { return (0, firebaseGroupFunctions_1.getGroupById)(groupId); }))];
                                case 1:
                                    groups = _a.sent();
                                    date = donutData.date instanceof firestore_1.Timestamp
                                        ? donutData.date.toDate()
                                        : new Date();
                                    return [2 /*return*/, {
                                            id: doc.id,
                                            name: donutData.name,
                                            date: date,
                                            groups: groups,
                                            sent: donutData.sent,
                                        }];
                            }
                        });
                    }); }))];
            case 2:
                donuts = _a.sent();
                return [2 /*return*/, donuts];
        }
    });
}); };
exports.getDonuts = getDonuts;
var getDonutById = function (donutId) { return __awaiter(void 0, void 0, void 0, function () {
    var donutDocRef, donutDoc, donutData, groups, date;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                donutDocRef = (0, firestore_1.doc)(firebase_1.db, "donuts", donutId);
                return [4 /*yield*/, (0, firestore_1.getDoc)(donutDocRef)];
            case 1:
                donutDoc = _a.sent();
                if (!donutDoc.exists()) {
                    throw new Error("Donut with ID ".concat(donutId, " not found"));
                }
                donutData = donutDoc.data();
                return [4 /*yield*/, Promise.all(donutData.groupIds.map(function (groupId) { return (0, firebaseGroupFunctions_1.getGroupById)(groupId); }))];
            case 2:
                groups = _a.sent();
                date = donutData.date instanceof firestore_1.Timestamp ? donutData.date.toDate() : new Date();
                return [2 /*return*/, {
                        id: donutDoc.id,
                        name: donutData.name,
                        date: date,
                        groups: groups,
                        sent: donutData.sent,
                    }];
        }
    });
}); };
exports.getDonutById = getDonutById;
var BATCH_SIZE = 500;
var deleteCollection = function (collectionName) { return __awaiter(void 0, void 0, void 0, function () {
    var collectionRef, _loop_1, state_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                collectionRef = (0, firestore_1.collection)(firebase_1.db, collectionName);
                _loop_1 = function () {
                    var q, snapshot, batch;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                q = (0, firestore_1.query)(collectionRef, (0, firestore_1.limit)(BATCH_SIZE));
                                return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                            case 1:
                                snapshot = _b.sent();
                                if (snapshot.empty)
                                    return [2 /*return*/, "break"];
                                batch = (0, firestore_1.writeBatch)(firebase_1.db);
                                snapshot.docs.forEach(function (docSnap) { return batch.delete(docSnap.ref); });
                                return [4 /*yield*/, batch.commit()];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_1()];
            case 2:
                state_1 = _a.sent();
                if (state_1 === "break")
                    return [3 /*break*/, 3];
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCollection = deleteCollection;

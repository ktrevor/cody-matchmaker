"use strict";
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
exports.promoteMembersGrades = exports.getMemberById = exports.getMembers = exports.deleteMember = exports.editMember = exports.addMember = void 0;
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("../firebase/firebase");
var Member_1 = require("./Member");
var addMember = function (memberData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "members"), memberData)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.addMember = addMember;
var editMember = function (oldData, newData) { return __awaiter(void 0, void 0, void 0, function () {
    var memberRef, updatedFields;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                memberRef = (0, firestore_1.doc)(firebase_1.db, "members", oldData.id);
                updatedFields = {};
                if (oldData.name !== newData.name)
                    updatedFields.name = newData.name;
                if (oldData.slackId !== newData.slackId)
                    updatedFields.slackId = newData.slackId;
                if (oldData.grade !== newData.grade)
                    updatedFields.grade = newData.grade;
                if (oldData.gender !== newData.gender)
                    updatedFields.gender = newData.gender;
                if (oldData.joined !== newData.joined)
                    updatedFields.joined = newData.joined;
                if (oldData.forest !== newData.forest)
                    updatedFields.forest = newData.forest;
                if (oldData.treeId !== newData.treeId) {
                    updatedFields.treeId = newData.treeId;
                }
                if (!(Object.keys(updatedFields).length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, firestore_1.updateDoc)(memberRef, updatedFields)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.editMember = editMember;
var deleteMember = function (member) { return __awaiter(void 0, void 0, void 0, function () {
    var groupsCollection, groupSnapshot, updateGroups, membersCollection, treeQuery, treeSnapshot, updateTress, memberRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                groupsCollection = (0, firestore_1.collection)(firebase_1.db, "groups");
                return [4 /*yield*/, (0, firestore_1.getDocs)(groupsCollection)];
            case 1:
                groupSnapshot = _a.sent();
                updateGroups = groupSnapshot.docs
                    .filter(function (groupDoc) { return groupDoc.data().memberIds.includes(member.id); })
                    .map(function (groupDoc) { return __awaiter(void 0, void 0, void 0, function () {
                    var groupRef, updatedMemberIds;
                    return __generator(this, function (_a) {
                        groupRef = (0, firestore_1.doc)(firebase_1.db, "groups", groupDoc.id);
                        updatedMemberIds = groupDoc
                            .data()
                            .memberIds.filter(function (id) { return id !== member.id; });
                        return [2 /*return*/, (0, firestore_1.updateDoc)(groupRef, { memberIds: updatedMemberIds })];
                    });
                }); });
                return [4 /*yield*/, Promise.all(updateGroups)];
            case 2:
                _a.sent();
                membersCollection = (0, firestore_1.collection)(firebase_1.db, "members");
                treeQuery = (0, firestore_1.query)(membersCollection, (0, firestore_1.where)("treeId", "==", member.id));
                return [4 /*yield*/, (0, firestore_1.getDocs)(treeQuery)];
            case 3:
                treeSnapshot = _a.sent();
                updateTress = treeSnapshot.docs.map(function (docSnap) { return __awaiter(void 0, void 0, void 0, function () {
                    var memberRef;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                memberRef = (0, firestore_1.doc)(firebase_1.db, "members", docSnap.id);
                                return [4 /*yield*/, (0, firestore_1.updateDoc)(memberRef, { treeId: null })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(updateTress)];
            case 4:
                _a.sent();
                memberRef = (0, firestore_1.doc)(firebase_1.db, "members", member.id);
                return [4 /*yield*/, (0, firestore_1.deleteDoc)(memberRef)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteMember = deleteMember;
//returns list of all current members in db
var getMembers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var membersCollection, querySnapshot, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                membersCollection = (0, firestore_1.collection)(firebase_1.db, "members");
                return [4 /*yield*/, (0, firestore_1.getDocs)(membersCollection)];
            case 1:
                querySnapshot = _a.sent();
                return [4 /*yield*/, Promise.all(querySnapshot.docs.map(function (doc) { return __awaiter(void 0, void 0, void 0, function () {
                        var memberData;
                        return __generator(this, function (_a) {
                            memberData = doc.data();
                            return [2 /*return*/, {
                                    id: doc.id,
                                    name: memberData.name,
                                    slackId: memberData.slackId,
                                    joined: memberData.joined,
                                    gender: memberData.gender,
                                    grade: memberData.grade,
                                    forest: memberData.forest,
                                    treeId: memberData.treeId,
                                }];
                        });
                    }); }))];
            case 2:
                members = _a.sent();
                //list of member objects
                return [2 /*return*/, members];
        }
    });
}); };
exports.getMembers = getMembers;
var getMemberById = function (memberId) { return __awaiter(void 0, void 0, void 0, function () {
    var memberRef, memberSnap, memberData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                memberRef = (0, firestore_1.doc)(firebase_1.db, "members", memberId);
                return [4 /*yield*/, (0, firestore_1.getDoc)(memberRef)];
            case 1:
                memberSnap = _a.sent();
                if (!memberSnap.exists()) {
                    throw new Error("Member with ID ".concat(memberId, " not found"));
                }
                memberData = memberSnap.data();
                return [2 /*return*/, {
                        id: memberId,
                        name: memberData.name,
                        slackId: memberData.slackId,
                        joined: memberData.joined,
                        gender: memberData.gender,
                        grade: memberData.grade,
                        forest: memberData.forest,
                        treeId: memberData.treeId,
                    }];
        }
    });
}); };
exports.getMemberById = getMemberById;
var promoteMembersGrades = function (members) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, members_1, member, memberRef, memberSnap, currentGrade, nextGrade;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, members_1 = members;
                _a.label = 1;
            case 1:
                if (!(_i < members_1.length)) return [3 /*break*/, 7];
                member = members_1[_i];
                memberRef = (0, firestore_1.doc)(firebase_1.db, "members", member.id);
                return [4 /*yield*/, (0, firestore_1.getDoc)(memberRef)];
            case 2:
                memberSnap = _a.sent();
                if (!memberSnap.exists()) {
                    throw new Error("Member with ID ".concat(member.id, " not found"));
                }
                currentGrade = memberSnap.data().grade;
                nextGrade = (0, Member_1.getNextGrade)(currentGrade);
                if (!!nextGrade) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, exports.deleteMember)(member)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, (0, firestore_1.updateDoc)(memberRef, { grade: nextGrade })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.promoteMembersGrades = promoteMembersGrades;

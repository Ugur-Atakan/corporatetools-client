"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTHER_ENTITY_TYPES = exports.PARTNERSHIP_ENTITY_TYPES = exports.NON_PROFIT_ENTITY_TYPES = exports.LLC_ENTITY_TYPES = exports.CORP_ENTITY_TYPES = exports.CTEntityTypeClass = void 0;
exports.classifyEntityType = classifyEntityType;
var CTEntityTypeClass;
(function (CTEntityTypeClass) {
    CTEntityTypeClass["CORP"] = "Corp";
    CTEntityTypeClass["LLC"] = "LLC";
    CTEntityTypeClass["NON_PROFIT"] = "Non-Profit";
    CTEntityTypeClass["PARTNERSHIP"] = "Partnership";
    CTEntityTypeClass["OTHER"] = "Other";
})(CTEntityTypeClass || (exports.CTEntityTypeClass = CTEntityTypeClass = {}));
exports.CORP_ENTITY_TYPES = [
    'Benefit Corporation',
    'Benefit Professional Corporation',
    'Close Corporation',
    'Close Professional Corporation',
    'Corporation',
    'Corporation Sole',
    'Exempt Nonstock Corporation',
    'Professional Corporation',
    'Sustainable Business Corporation',
];
exports.LLC_ENTITY_TYPES = [
    'Benefit LLC',
    'Close Limited Liability Company',
    'DOA LLC',
    'Limited Liability Company',
    'Low-Profit Limited Liability Company',
    'Nonprofit Limited Liability Company',
    'Professional Limited Liability Company',
    'Series Limited Liability Company',
    'Series Professional Limited Liability Company',
];
exports.NON_PROFIT_ENTITY_TYPES = [
    'Mutual Benefit Nonprofit Corporation',
    'Nonprofit Corporation',
    'Public Benefit Nonprofit Corporation',
    'Religious Nonprofit Corporation',
];
exports.PARTNERSHIP_ENTITY_TYPES = [
    'General Partnership',
    'Limited Liability Limited Partnership',
    'Limited Liability Partnership',
    'Limited Partnership',
    'Professional Limited Liability Limited Partnership',
    'Professional Limited Liability Partnership',
    'Professional Limited Partnership',
];
exports.OTHER_ENTITY_TYPES = [
    'Association',
    'Attorney for Bar',
    'Cooperative',
    'Cooperative Association',
    'Cooperative Association (For-Profit)',
    'Cooperative Association (Nonprofit)',
    'Individual',
    'Massachusetts Trust',
    'Mutual Benefit Enterprise',
    'Other',
    'Personal Attorney',
    'Sole Proprietorship',
    'Telehealthcare',
    'Trust',
    'Doing Business as Name',
];
const toSet = (arr) => new Set(arr);
const CORP_SET = toSet(exports.CORP_ENTITY_TYPES);
const LLC_SET = toSet(exports.LLC_ENTITY_TYPES);
const NON_PROFIT_SET = toSet(exports.NON_PROFIT_ENTITY_TYPES);
const PARTNERSHIP_SET = toSet(exports.PARTNERSHIP_ENTITY_TYPES);
function classifyEntityType(type) {
    if (CORP_SET.has(type))
        return CTEntityTypeClass.CORP;
    if (LLC_SET.has(type))
        return CTEntityTypeClass.LLC;
    if (NON_PROFIT_SET.has(type))
        return CTEntityTypeClass.NON_PROFIT;
    if (PARTNERSHIP_SET.has(type))
        return CTEntityTypeClass.PARTNERSHIP;
    return CTEntityTypeClass.OTHER;
}

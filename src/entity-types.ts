export type CTEntityType =
  | 'Association'
  | 'Attorney for Bar'
  | 'Benefit Corporation'
  | 'Benefit LLC'
  | 'Benefit Professional Corporation'
  | 'Close Corporation'
  | 'Close Limited Liability Company'
  | 'Close Professional Corporation'
  | 'Cooperative'
  | 'Corporation Sole'
  | 'Corporation'
  | 'Doing Business as Name'
  | 'Exempt Nonstock Corporation'
  | 'General Partnership'
  | 'Individual'
  | 'Limited Liability Company'
  | 'Limited Liability Limited Partnership'
  | 'Limited Liability Partnership'
  | 'Limited Partnership'
  | 'Low-Profit Limited Liability Company'
  | 'Massachusetts Trust'
  | 'Mutual Benefit Enterprise'
  | 'Mutual Benefit Nonprofit Corporation'
  | 'Nonprofit Corporation'
  | 'Nonprofit Limited Liability Company'
  | 'Personal Attorney'
  | 'Professional Corporation'
  | 'Professional Limited Liability Company'
  | 'Professional Limited Liability Limited Partnership'
  | 'Professional Limited Liability Partnership'
  | 'Professional Limited Partnership'
  | 'Public Benefit Nonprofit Corporation'
  | 'Religious Nonprofit Corporation'
  | 'Series Limited Liability Company'
  | 'Series Professional Limited Liability Company'
  | 'Sole Proprietorship'
  | 'Sustainable Business Corporation'
  | 'Trust'
  | 'Cooperative Association'
  | 'Cooperative Association (For-Profit)'
  | 'Cooperative Association (Nonprofit)'
  | 'DOA LLC'
  | 'Telehealthcare'
  | 'Other';

export enum CTEntityTypeClass {
  CORP = 'Corp',
  LLC = 'LLC',
  NON_PROFIT = 'Non-Profit',
  PARTNERSHIP = 'Partnership',
  OTHER = 'Other',
}

export const CORP_ENTITY_TYPES = [
  'Benefit Corporation',
  'Benefit Professional Corporation',
  'Close Corporation',
  'Close Professional Corporation',
  'Corporation',
  'Corporation Sole',
  'Exempt Nonstock Corporation',
  'Professional Corporation',
  'Sustainable Business Corporation',
] as const;

export const LLC_ENTITY_TYPES = [
  'Benefit LLC',
  'Close Limited Liability Company',
  'DOA LLC',
  'Limited Liability Company',
  'Low-Profit Limited Liability Company',
  'Nonprofit Limited Liability Company',
  'Professional Limited Liability Company',
  'Series Limited Liability Company',
  'Series Professional Limited Liability Company',
] as const;

export const NON_PROFIT_ENTITY_TYPES = [
  'Mutual Benefit Nonprofit Corporation',
  'Nonprofit Corporation',
  'Public Benefit Nonprofit Corporation',
  'Religious Nonprofit Corporation',
] as const;

export const PARTNERSHIP_ENTITY_TYPES = [
  'General Partnership',
  'Limited Liability Limited Partnership',
  'Limited Liability Partnership',
  'Limited Partnership',
  'Professional Limited Liability Limited Partnership',
  'Professional Limited Liability Partnership',
  'Professional Limited Partnership',
] as const;

export const OTHER_ENTITY_TYPES = [
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
] as const;

const toSet = <T extends readonly string[]>(arr: T) =>
  new Set<string>(arr as readonly string[]);

const CORP_SET = toSet(CORP_ENTITY_TYPES);
const LLC_SET = toSet(LLC_ENTITY_TYPES);
const NON_PROFIT_SET = toSet(NON_PROFIT_ENTITY_TYPES);
const PARTNERSHIP_SET = toSet(PARTNERSHIP_ENTITY_TYPES);

export function classifyEntityType(type: CTEntityType): CTEntityTypeClass {
  if (CORP_SET.has(type)) return CTEntityTypeClass.CORP;
  if (LLC_SET.has(type)) return CTEntityTypeClass.LLC;
  if (NON_PROFIT_SET.has(type)) return CTEntityTypeClass.NON_PROFIT;
  if (PARTNERSHIP_SET.has(type)) return CTEntityTypeClass.PARTNERSHIP;
  return CTEntityTypeClass.OTHER;
}


// Boolean Fields (including null)
type BooleanField = true | false | null;

// Concept Fields
type ConceptBalanceType = 'credit' | 'debit' | '';
type ConceptPeriodType = 'duration' | 'instant';
type ConceptId = number;
type ConceptIsBase = boolean;
type ConceptIsMonetary = boolean;
type ConceptLocalName = string;
type ConceptNamespace = string;
type ConceptDatatype = 
  | 'monetaryItemType' | 'sharesItemType' | 'percentItemType' | 'stringItemType'
  | 'powerItemType' | 'perShareItemType' | 'textBlockItemType' | 'decimalItemType'
  | 'durationItemType' | 'integerItemType' | 'energyItemType' | 'dateItemType'
  | 'perUnitItemType' | 'booleanItemType' | 'normalizedStringItemType' | 'pureItemType'
  | 'gYearItemType' | 'voltageItemType' | 'yesNoItemType' | 'centralIndexKeyItemType'
  | 'submissionTypeItemType' | 'lengthItemType' | 'filerCategoryItemType'
  | 'gMonthDayItemType' | 'fiscalPeriodItemType' | 'gYearMonthItemType'
  | 'areaItemType' | 'durationStringItemType' | 'edgarStateCountryItemType'
  | 'fileNumberItemType' | 'edgarExchangeCodeItemType' | 'tradingSymbolItemType'
  | 'employerIdItemType' | 'stateOrProvinceItemType' | 'volumeItemType'
  | 'extensibleListItemType' | 'dateStringItemType' | 'securityTitleItemType'
  | 'Security12bTitle@anonymousType' | 'countryCodeItemType' | 'zoneStatusItemType'
  | 'submissionItemType' | 'reportPeriodItemType' | 'formTypeItemType'
  | 'massItemType' | 'gYearListItemType' | 'SECReportItemType'
  | 'positiveIntegerItemType' | 'fundingImprovementAndRehabilitationPlanItemType'
  | 'surchargeItemType' | 'internationalNameItemType' | 'statesOfUnitedStatesItemType'
  | 'nonemptySequenceNumberItemType' | 'enumerationSetItemType' | 'sicNumberItemType'
  | 'fileItemType' | 'ShareholdersReportSubmittedItemType'
  | (string & {}); 

// Dimension Fields
type DimensionPair = string | null;
type DimensionIsBase = BooleanField;
type DimensionLocalName = string;
type DimensionNamespace = string;
type DimensionsArray = FactDimension[] | string;
type DimensionsCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type DimensionsId = string | null;

// DTS Fields
type DTSEntryPoint = string;
type DTSId = number;
type DTSTargetNamespace = string;

// Entity Fields
type EntityCik = string;
type EntityCode = string;
type EntityId = number;
type EntityName = string;
type EntityScheme = 
  | 'http://www.sec.gov/CIK' 
  | 'http://xbrl.org/entity/identification/scheme'
  | 'http://standards.iso.org/iso/17442'
  | 'http://www.ferc.gov/CID'
  | (string & {}); 

// Fact Fields
type FactAccuracyIndex = number;
type FactDecimals = 
  | -12 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 
  | '';
type FactHasDimensions = boolean;
type FactHash = string;
type FactId = number;
type FactInlineDisplayValue = string;
type FactInlineIsHidden = BooleanField;
type FactInlineNegated = BooleanField;
type FactInlineScale = -4 | -2 | 0 | 3 | 6 | 9;
type FactIsExtended = boolean;
type FactNumericalValue = number;
type FactUltimus = boolean;
type FactUltimusIndex = number;
type FactValue = string | number;
type FactValueLink = string;
type FactXmlId = string;

// Member Fields
type MemberIsBase = BooleanField;
type MemberLocalName = string;
type MemberMemberValue = string;
type MemberNamespace = string;
type MemberTypedValue = string;

// Period Fields
type PeriodCalendarPeriod = string;
type PeriodEnd = string | null;
type PeriodFiscalId = string;
type PeriodFiscalPeriod = string;
type PeriodFiscalYear = number;
type PeriodId = string;
type PeriodInstant = string;
type PeriodStart = string | null;
type PeriodYear = number;

// Report Fields
type ReportAccession = string;
type ReportCreationSoftware = string;
type ReportDocumentIndex = number;
type ReportDocumentType = 
  | '10-Q' | '10-K' | '20-F' | '1' | '1/3-Q' 
  | '714' | '2' | '2/3-Q' | 'S-1/A' | 'S-1' 
  | 'S-4' | '6-K' | '40-F' | '8-K' | '10-Q/A' 
  | 'E-AR' | '6-K/A' | 'S-4/A' | 'F-1' | '60' 
  | '10-K/A' | 'E-Q' | '2-A' | '20-F/A' | 'POS AM' 
  | 'E-HYR' | 'DEF 14A' | '8-K/A' | 'PRE 14A' | '40-F/A' 
  | '424B4'
  | (string & {}); 
type ReportDocumentSetNum = 0 | 1 | 2;
type ReportEntryUrl = string;
type ReportEventItems = string;
type ReportFilingDate = string;
type ReportFormType = ReportDocumentType; // Same values as document type
type ReportHash = string;
type ReportHtmlUrl = string;
type ReportId = number;
type ReportIsMostCurrent = boolean;
type ReportPeriodEnd = string;
type ReportPeriodFocus = '' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY';
type ReportRestated = boolean;
type ReportRestatedIndex = 1 | 2 | 3 | 4 | 5;
type ReportSecUrl = string;
type ReportSicCode = number;
type ReportSourceId = 1 | 2 | 3;
type ReportSourceName = 'SEC' | 'FERC' | 'ESEF';
type ReportSubmissionType = '' | 'O' | 'R';
type ReportType = 'instance' | 'inline' | 'inlineDocumentSet';
type ReportYearFocus = number;

// Unit Fields
type Unit = string;
type UnitDenominator = string;
type UnitNumerator = string;
type UnitQname = string;


// Fact Dimension interface
export interface FactDimension {
  dimension_namespace: string;
  dimension_local_name: string;
  member_namespace: string;
  member_local_name: string;
}


// Main Fact Data interface with all fields using the new type names
interface ConceptFields {
  'concept.balance-type'?: ConceptBalanceType;
  'concept.datatype'?: ConceptDatatype;
  'concept.id'?: ConceptId;
  'concept.is-base'?: ConceptIsBase;
  'concept.is-monetary'?: ConceptIsMonetary;
  'concept.local-name'?: ConceptLocalName;
  'concept.namespace'?: ConceptNamespace;
  'concept.period-type'?: ConceptPeriodType;
}

interface DimensionFields {
  'dimension-pair'?: DimensionPair;
  'dimension.is-base'?: DimensionIsBase;
  'dimension.local-name'?: DimensionLocalName;
  'dimension.namespace'?: DimensionNamespace;
  'dimensions'?: DimensionsArray;
  'dimensions.count'?: DimensionsCount;
  'dimensions.id'?: DimensionsId;
}

interface DTSFields {
  'dts.entry-point'?: DTSEntryPoint;
  'dts.id'?: DTSId;
  'dts.target-namespace'?: DTSTargetNamespace;
}

interface EntityFields {
  'entity.cik'?: EntityCik;
  'entity.code'?: EntityCode;
  'entity.id'?: EntityId;
  'entity.name'?: EntityName;
  'entity.scheme'?: EntityScheme;
}

interface FactFields {
  'fact.accuracy-index'?: FactAccuracyIndex;
  'fact.decimals'?: FactDecimals;
  'fact.has-dimensions'?: FactHasDimensions;
  'fact.hash'?: FactHash;
  'fact.id'?: FactId;
  'fact.inline-display-value'?: FactInlineDisplayValue;
  'fact.inline-is-hidden'?: FactInlineIsHidden;
  'fact.inline-negated'?: FactInlineNegated;
  'fact.inline-scale'?: FactInlineScale;
  'fact.is-extended'?: FactIsExtended;
  'fact.numerical-value'?: FactNumericalValue;
  'fact.ultimus'?: FactUltimus;
  'fact.ultimus-index'?: FactUltimusIndex;
  'fact.value'?: FactValue;
  'fact.value-link'?: FactValueLink;
  'fact.xml-id'?: FactXmlId;
}

interface MemberFields {
  'member.is-base'?: MemberIsBase;
  'member.local-name'?: MemberLocalName;
  'member.member-value'?: MemberMemberValue;
  'member.namespace'?: MemberNamespace;
  'member.typed-value'?: MemberTypedValue;
}

interface PeriodFields {
  'period.calendar-period'?: PeriodCalendarPeriod;
  'period.end'?: PeriodEnd;
  'period.fiscal-id'?: PeriodFiscalId;
  'period.fiscal-period'?: PeriodFiscalPeriod;
  'period.fiscal-year'?: PeriodFiscalYear;
  'period.id'?: PeriodId;
  'period.instant'?: PeriodInstant;
  'period.start'?: PeriodStart;
  'period.year'?: PeriodYear;
}

interface ReportFields {
  'report.accession'?: ReportAccession;
  'report.creation-software'?: ReportCreationSoftware;
  'report.document-index'?: ReportDocumentIndex;
  'report.document-type'?: ReportDocumentType;
  'report.documentset-num'?: ReportDocumentSetNum;
  'report.entry-url'?: ReportEntryUrl;
  'report.event-items'?: ReportEventItems;
  'report.filing-date'?: ReportFilingDate;
  'report.form-type'?: ReportFormType;
  'report.hash'?: ReportHash;
  'report.html-url'?: ReportHtmlUrl;
  'report.id'?: ReportId;
  'report.is-most-current'?: ReportIsMostCurrent;
  'report.period-end'?: ReportPeriodEnd;
  'report.period-focus'?: ReportPeriodFocus;
  'report.restated'?: ReportRestated;
  'report.restated-index'?: ReportRestatedIndex;
  'report.sec-url'?: ReportSecUrl;
  'report.sic-code'?: ReportSicCode;
  'report.source-id'?: ReportSourceId;
  'report.source-name'?: ReportSourceName;
  'report.submission-type'?: ReportSubmissionType;
  'report.type'?: ReportType;
  'report.year-focus'?: ReportYearFocus;
}

interface UnitFields {
  'unit'?: Unit;
  'unit.denominator'?: UnitDenominator;
  'unit.numerator'?: UnitNumerator;
  'unit.qname'?: UnitQname;
}

export type FactData = FactFields &
Pick<ConceptFields, 'concept.balance-type' | 'concept.datatype' | 'concept.id' | 'concept.is-base' | 'concept.is-monetary' | 'concept.local-name' | 'concept.namespace' | 'concept.period-type'> &
Pick<DimensionFields, 'dimension-pair' | 'dimension.is-base' | 'dimension.local-name' | 'dimension.namespace' | 'dimensions' | 'dimensions.count' | 'dimensions.id'> &
Pick<DTSFields, 'dts.entry-point' | 'dts.id' | 'dts.target-namespace'> &
Pick<EntityFields, 'entity.cik' | 'entity.code' | 'entity.id' | 'entity.name' | 'entity.scheme'> &
Pick<MemberFields, 'member.is-base' | 'member.local-name' | 'member.member-value' | 'member.namespace' | 'member.typed-value'> &
Pick<PeriodFields, 'period.calendar-period' | 'period.end' | 'period.fiscal-id' | 'period.fiscal-period' | 'period.fiscal-year' | 'period.id' | 'period.instant' | 'period.start' | 'period.year'> &
Pick<ReportFields, 'report.accession' | 'report.creation-software' | 'report.document-index' | 'report.document-type' | 'report.documentset-num' | 'report.entry-url' | 'report.event-items' | 'report.filing-date' | 'report.form-type' | 'report.hash' | 'report.html-url' | 'report.id' | 'report.is-most-current' | 'report.period-end' | 'report.period-focus' | 'report.restated' | 'report.restated-index' | 'report.sec-url' | 'report.sic-code' | 'report.source-id' | 'report.source-name' | 'report.submission-type' | 'report.type' | 'report.year-focus'> &
Pick<UnitFields, 'unit' | 'unit.denominator' | 'unit.numerator' | 'unit.qname'>;

// Search Parameters interface
interface FactSearchParams {
  endpoint: 'fact/search' | 'fact/oim/search' | 'fact/{fact.id}';
  fields?: Array<keyof FactData>;
  filters: {
    [K in keyof FactData]?: string | number | boolean | Array<string | number>;
  };
  limit?: number;
  offset?: number;
  wait?: number;
}
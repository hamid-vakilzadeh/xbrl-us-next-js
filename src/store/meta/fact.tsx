export const FACT = {
    "endpoints": {
      "1": "/fact/search",
      "2": "/fact/{fact.id}",
      "3": "/fact/oim/search"
    },
    "examples": {
      "1": "https://api.xbrl.us/api/v1/fact/search?entity.cik=0001138723&concept.local-name=Assets&period.fiscal-period=Y&period.fiscal-year=2016,2015,2014&fields=fact.*",
      "2": "https://api.xbrl.us/api/v1/fact/search?report.id=177604&fact.is-extended=true&fact.has-dimensions=f&period.fiscal-period=Y&period.fiscal-year=2016,2015,2014&fields=fact.*",
      "3": "https://api.xbrl.us/api/v1/fact/search?entity.cik=0001138723&aspect.CashAndCashEquivalentsAxis=MoneyMarketFundsMember&aspect.FairValueByFairValueHierarchyLevelAxis=FairValueInputsLevel1Member&concept.local-name=CashAndCashEquivalentsAtCarryingValue,%20Assets&fields=report.id,entity.id,fact.decimals,fact.value,unit,entity.cik,report.filing-date,concept.local-name,entity.cik,entity.name,concept.local-name,fact.ultimus-index,fact.id,dimensions,dimensions.count,period.fiscal-year.sort(DESC),period.fiscal-period.sort(DESC)",
      "4": "https://api.xbrl.us/api/v1/fact/search?entity.cik=0001138723&concept.local-name=Assets&period.fiscal-period=Y&period.fiscal-year=2016,2015,2014&fields=report.id,entity.id,fact.decimals,fact.value,unit,entity.cik,report.filing-date,concept.local-name,entity.cik,entity.name,concept.local-name,fact.ultimus-index,fact.id,dimensions,dimensions.count,period.fiscal-year.sort(DESC),period.fiscal-period.sort(DESC)",
      "5": "https://api.xbrl.us/api/v1/fact/search?fact.hash=\\x809b4eca538e780e9579069b8e02a1b13e0238de3ba159eeb1f23c1b&fields=fact.*",
      "6": "https://api.xbrl.us/api/v1/fact/oim/search?report.id=177604&fact.has-dimensions=t",
      "7": "https://api.xbrl.us/api/v1/fact/133942370?fields=fact.*"
    },
    "fields": {
      "fact.accuracy-index": {
        "searchable": true,
        "type": "int",
        "database_field": "accuracy_index",
        "format": "integer"
      },
      "fact.decimals": {
        "searchable": false,
        "type": "text",
        "database_field": "decimals_value",
        "definition": "The decimal value associated with a fact. This can be either a number representing decimal places or be infinite. There are two values returned for this field the first is a decimal and the second is a boolean. The first indicates the decimal places if applicable and the second identifies if the value is infinite(t) or not (f)."
      },
      "fact.has-dimensions": {
        "searchable": true,
        "type": "boolean",
        "database_field": "specifies_dimensions",
        "definition": "This boolean field indicates if the fact has any dimensions associated with it.",
        "format": "boolean"
      },
      "fact.hash": {
        "searchable": true,
        "type": "text",
        "database_field": "fact_hash",
        "definition": "The fact hash is derived from the aspect properties of the fact. Each fact will have a different hash in a given report. Over time however different facts may have the same hash if they are identical. The hash does not take into account the value reported for the fact. the fact hash is used to determine the ultimus index. By searching on the hash you can identify all identical facts that were reported.",
        "format": "hex_hash"
      },
      "fact.id": {
        "searchable": true,
        "type": "int",
        "database_field": "fact_id",
        "definition": "The unique identifier used to identify a fact.",
        "format": "integer"
      },
      "fact.inline-display-value": {
        "searchable": false,
        "type": "varchar",
        "database_field": "inline_display_value",
        "definition": "The original value that was shown in the inline filing prior to be transformed to an XBRL value."
      },
      "fact.inline-is-hidden": {
        "searchable": false,
        "type": "boolean",
        "database_field": "inline_is_hidden",
        "definition": "Boolean that indicates if the fact was hidden in the inline document.",
        "format": "boolean"
      },
      "fact.inline-negated": {
        "searchable": false,
        "type": "boolean",
        "database_field": "inline_negated",
        "definition": "Boolean that indicates if the fact was negated in the inline document.",
        "format": "boolean"
      },
      "fact.inline-scale": {
        "searchable": false,
        "type": "int",
        "database_field": "inline_scale",
        "definition": "Integer that indicates the scale used on the fact in the inline document.",
        "format": "integer"
      },
      "fact.is-extended": {
        "searchable": true,
        "type": "boolean",
        "database_field": "is_extended",
        "definition": "This indicates if the fact is comprised of either an extension concept, extension axis or extension member.",
        "format": "boolean"
      },
      "fact.numerical-value": {
        "searchable": false,
        "type": "numeric",
        "database_field": "effective_value",
        "definition": "The numerical value of the fact that was reported. "
      },
      "fact.text-search": {
        "searchable": true,
        "type": "text",
        "definition": "Used to define text in a text search. Cannot be output as a field."
      },
      "fact.ultimus": {
        "searchable": true,
        "type": "boolean",
        "database_field": "ultimus_index",
        "definition": "A boolean that indicates if the fact is the latest value reported.  A value of true represents that it's the latest value reported.  A value of false represents that the value has been superseded with a more recent fact.",
        "format": "boolean"
      },
      "fact.ultimus-index": {
        "searchable": true,
        "type": "int",
        "database_field": "ultimus_index",
        "definition": "An integer that records the incarnation of the fact. The same fact is reported many times and the ultimus field captures the incarnation that was reported. A value of 1 indicates that this is the latest value of the fact. A value of 6 for example would indicate that the value has been reported 6 times subsequently to this fact being reported. If requesting values from a specific report the ultimus filed would not be used as a search parameter as you will not get all the fact values if there has been a subsequent report filed, as the ultimus value on these facts in a specific report will be updated as additional reports come in.",
        "format": "integer"
      },
      "fact.value": {
        "searchable": true,
        "type": "text",
        "database_field": "fact_value",
        "definition": "The value of the fact as a text value. This included numerical as well as non numerical values reported."
      },
      "fact.value-link": {
        "searchable": false,
        "type": "varchar",
        "database_field": "'${DISPATCH}?Task=htmlExportFact&FactID=' || fact_id",
        "definition": "Used to define text in a text search. Will return the actual text."
      },
      "fact.xml-id": {
        "searchable": false,
        "type": "varchar",
        "database_field": "xml_id",
        "definition": "The xml-id included in the filing. Many facts may not have this identifier as it is dependent ofn the filer adding it. In inline filings it can be used to go directly to the fact value in the filing."
      },
    }
  }
/**
 * Models attributes
 * 
 */
const modelsAttributes = {
  'role': {
      "id": "Int",
      "name": "String",
      "description": "String",
  },
  'role_to_user': {
      "id": "Int",
      "userId": "Int",
      "roleId": "Int",
  },
  'user': {
      "id": "Int",
      "email": "String",
      "password": "String",
  },
  'breedingMethod': {
      "abbreviation": "String",
      "breedingMethodDbId": "String",
      "breedingMethodName": "String",
      "description": "String",
  },
  'contact': {
      "contactDbId": "String",
      "email": "String",
      "instituteName": "String",
      "name": "String",
      "orcid": "String",
      "type": "String",
      "studyDbIds": "[String]",
      "trialDbIds": "[String]",
  },
  'environmentParameter': {
      "description": "String",
      "parameterName": "String",
      "parameterPUI": "String",
      "unit": "String",
      "unitPUI": "String",
      "value": "String",
      "valuePUI": "String",
      "studyDbId": "String",
      "environmentParameterDbId": "String",
  },
  'event': {
      "eventDbId": "String",
      "eventDescription": "String",
      "eventType": "String",
      "date": "DateTime",
      "observationUnitDbIds": "[String]",
      "studyDbId": "String",
  },
  'eventParameter': {
      "key": "String",
      "rdfValue": "String",
      "value": "String",
      "eventDbId": "String",
      "eventParameterDbId": "String",
  },
  'germplasm': {
      "accessionNumber": "String",
      "acquisitionDate": "Date",
      "breedingMethodDbId": "String",
      "commonCropName": "String",
      "countryOfOriginCode": "String",
      "defaultDisplayName": "String",
      "documentationURL": "String",
      "germplasmGenus": "String",
      "germplasmName": "String",
      "germplasmPUI": "String",
      "germplasmPreprocessing": "String",
      "germplasmSpecies": "String",
      "germplasmSubtaxa": "String",
      "instituteCode": "String",
      "instituteName": "String",
      "pedigree": "String",
      "seedSource": "String",
      "seedSourceDescription": "String",
      "speciesAuthority": "String",
      "subtaxaAuthority": "String",
      "xref": "String",
      "germplasmDbId": "String",
      "biologicalStatusOfAccessionCode": "String",
  },
  'image': {
      "copyright": "String",
      "description": "String",
      "imageFileName": "String",
      "imageFileSize": "Int",
      "imageHeight": "Int",
      "imageName": "String",
      "imageTimeStamp": "DateTime",
      "imageURL": "String",
      "imageWidth": "Int",
      "mimeType": "String",
      "observationUnitDbId": "String",
      "imageDbId": "String",
  },
  'location': {
      "abbreviation": "String",
      "coordinateDescription": "String",
      "countryCode": "String",
      "countryName": "String",
      "documentationURL": "String",
      "environmentType": "String",
      "exposure": "String",
      "instituteAddress": "String",
      "instituteName": "String",
      "locationName": "String",
      "locationType": "String",
      "siteStatus": "String",
      "slope": "String",
      "topography": "String",
      "locationDbId": "String",
  },
  'method': {
      "description": "String",
      "formula": "String",
      "methodClass": "String",
      "methodName": "String",
      "reference": "String",
      "methodDbId": "String",
      "ontologyDbId": "String",
  },
  'observation': {
      "collector": "String",
      "germplasmDbId": "String",
      "observationTimeStamp": "DateTime",
      "observationUnitDbId": "String",
      "observationVariableDbId": "String",
      "studyDbId": "String",
      "uploadedBy": "String",
      "value": "String",
      "observationDbId": "String",
      "seasonDbId": "String",
      "imageDbId": "String",
  },
  'observationTreatment': {
      "factor": "String",
      "modality": "String",
      "observationUnitDbId": "String",
      "observationTreatmentDbId": "String",
  },
  'observationUnit': {
      "observationLevel": "String",
      "observationUnitName": "String",
      "observationUnitPUI": "String",
      "plantNumber": "String",
      "plotNumber": "String",
      "programDbId": "String",
      "studyDbId": "String",
      "trialDbId": "String",
      "observationUnitDbId": "String",
      "germplasmDbId": "String",
      "locationDbId": "String",
      "eventDbIds": "[String]",
  },
  'observationUnitPosition': {
      "blockNumber": "String",
      "entryNumber": "String",
      "positionCoordinateX": "String",
      "positionCoordinateY": "String",
      "replicate": "String",
      "observationUnitDbId": "String",
      "observationUnitPositionDbId": "String",
  },
  'observationVariable': {
      "commonCropName": "String",
      "defaultValue": "String",
      "documentationURL": "String",
      "growthStage": "String",
      "institution": "String",
      "language": "String",
      "scientist": "String",
      "status": "String",
      "submissionTimestamp": "DateTime",
      "xref": "String",
      "observationVariableDbId": "String",
      "observationVariableName": "String",
      "methodDbId": "String",
      "scaleDbId": "String",
      "traitDbId": "String",
      "ontologyDbId": "String",
  },
  'ontologyReference': {
      "documentationURL": "String",
      "ontologyDbId": "String",
      "ontologyName": "String",
      "version": "String",
  },
  'program': {
      "abbreviation": "String",
      "commonCropName": "String",
      "documentationURL": "String",
      "leadPersonDbId": "String",
      "objective": "String",
      "programName": "String",
      "programDbId": "String",
  },
  'scale': {
      "decimalPlaces": "Int",
      "scaleName": "String",
      "xref": "String",
      "scaleDbId": "String",
      "ontologyDbId": "String",
  },
  'season': {
      "season": "String",
      "seasonDbId": "String",
      "year": "Int",
      "studyDbIds": "[String]",
  },
  'study': {
      "studyDbId": "String",
      "active": "Boolean",
      "commonCropName": "String",
      "culturalPractices": "String",
      "documentationURL": "String",
      "endDate": "DateTime",
      "license": "String",
      "observationUnitsDescription": "String",
      "startDate": "DateTime",
      "studyDescription": "String",
      "studyName": "String",
      "studyType": "String",
      "trialDbId": "String",
      "locationDbId": "String",
      "contactDbIds": "[String]",
      "seasonDbIds": "[String]",
  },
  'trait': {
      "attribute": "String",
      "entity": "String",
      "mainAbbreviation": "String",
      "status": "String",
      "traitClass": "String",
      "traitDescription": "String",
      "traitName": "String",
      "xref": "String",
      "traitDbId": "String",
      "ontologyDbId": "String",
  },
  'trial': {
      "trialDbId": "String",
      "active": "Boolean",
      "commonCropName": "String",
      "documentationURL": "String",
      "endDate": "DateTime",
      "startDate": "DateTime",
      "trialDescription": "String",
      "trialName": "String",
      "trialPUI": "String",
      "programDbId": "String",
      "contactDbIds": "[String]",
  },
}

export default function getAttributes(filterName) {
  return {...modelsAttributes[filterName]};
}
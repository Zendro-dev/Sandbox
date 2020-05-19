export default function getAttributes(filterName) {
  switch(filterName) {
    case 'breedingMethod':
      return {
        "abbreviation": "String",
        "breedingMethodDbId": "String",
        "breedingMethodName": "String",
        "description": "String",
      };
    case 'contact':
      return {
        "contactDbId": "String",
        "email": "String",
        "instituteName": "String",
        "name": "String",
        "orcid": "String",
        "type": "String",
      };
    case 'environmentParameter':
      return {
        "description": "String",
        "parameterName": "String",
        "parameterPUI": "String",
        "unit": "String",
        "unitPUI": "String",
        "value": "String",
        "valuePUI": "String",
        "studyDbId": "String",
        "environmentParameterDbId": "String",
      };
    case 'event':
      return {
        "eventDbId": "String",
        "eventDescription": "String",
        "eventType": "String",
        "studyDbId": "String",
        "date": "DateTime",
      };
    case 'eventParameter':
      return {
        "key": "String",
        "rdfValue": "String",
        "value": "String",
        "eventDbId": "String",
        "eventParameterDbId": "String",
      };
    case 'germplasm':
      return {
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
      };
    case 'image':
      return {
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
      };
    case 'location':
      return {
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
      };
    case 'method':
      return {
        "description": "String",
        "formula": "String",
        "methodClass": "String",
        "methodName": "String",
        "reference": "String",
        "methodDbId": "String",
        "ontologyDbId": "String",
      };
    case 'observation':
      return {
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
      };
    case 'observationTreatment':
      return {
        "factor": "String",
        "modality": "String",
        "observationUnitDbId": "String",
        "observationTreatmentDbId": "String",
      };
    case 'observationUnit':
      return {
        "germplasmDbId": "String",
        "locationDbId": "String",
        "observationLevel": "String",
        "observationUnitName": "String",
        "observationUnitPUI": "String",
        "plantNumber": "String",
        "plotNumber": "String",
        "programDbId": "String",
        "studyDbId": "String",
        "trialDbId": "String",
        "observationUnitDbId": "String",
      };
    case 'observationUnitPosition':
      return {
        "blockNumber": "String",
        "entryNumber": "String",
        "positionCoordinateX": "String",
        "positionCoordinateY": "String",
        "replicate": "String",
        "observationUnitDbId": "String",
        "observationUnitPositionDbId": "String",
      };
    case 'observationUnit_to_event':
      return {
        "id": "Int",
        "observationUnitDbId": "String",
        "eventDbId": "String",
      };
    case 'observationVariable':
      return {
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
      };
    case 'ontologyReference':
      return {
        "documentationURL": "String",
        "ontologyDbId": "String",
        "ontologyName": "String",
        "version": "String",
      };
    case 'program':
      return {
        "abbreviation": "String",
        "commonCropName": "String",
        "documentationURL": "String",
        "leadPersonDbId": "String",
        "leadPersonName": "String",
        "objective": "String",
        "programName": "String",
        "programDbId": "String",
      };
    case 'role_to_user':
      return {
        "id": "Int",
        "userId": "Int",
        "roleId": "Int",
      };
    case 'scale':
      return {
        "decimalPlaces": "Int",
        "scaleName": "String",
        "xref": "String",
        "scaleDbId": "String",
        "ontologyDbId": "String",
      };
    case 'season':
      return {
        "season": "String",
        "seasonDbId": "String",
        "year": "Int",
      };
    case 'study':
      return {
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
        "studyDbId": "String",
        "locationDbId": "String",
      };
    case 'study_to_contact':
      return {
        "id": "Int",
        "studyDbId": "String",
        "contactDbId": "String",
      };
    case 'study_to_season':
      return {
        "id": "Int",
        "studyDbId": "String",
        "seasonDbId": "String",
      };
    case 'trait':
      return {
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
      };
    case 'trial':
      return {
        "active": "Boolean",
        "commonCropName": "String",
        "documentationURL": "String",
        "endDate": "DateTime",
        "programDbId": "String",
        "startDate": "DateTime",
        "trialDescription": "String",
        "trialName": "String",
        "trialPUI": "String",
        "trialDbId": "String",
      };
    case 'trial_to_contact':
      return {
        "id": "Int",
        "trialDbId": "String",
        "contactDbId": "String",
      };
    case 'role':
      return {
        "id": "Int",
        "name": "String",
        "description": "String",
    };
    case 'user':
      return {
        "id": "Int",
        "email": "String",
        "password": "String",
    };

    default:
      return {};
  }
}
import { gql } from 'graphql-request';

export const name = 'updateFileAttachment';

export const query = gql`
  mutation updateFileAttachment(
    $file: Upload
    $id: ID!
    $identifierName: String
    $addInvestigation: ID
    $removeInvestigation: ID
    $addStudy: ID
    $removeStudy: ID
    $addAssay: ID
    $removeAssay: ID
    $addFactor: ID
    $removeFactor: ID
    $addMaterial: ID
    $removeMaterial: ID
    $addProtocol: ID
    $removeProtocol: ID
  ) {
    updateFileAttachment(
      file: $file
      id: $id
      identifierName: $identifierName
      addInvestigation: $addInvestigation
      removeInvestigation: $removeInvestigation
      addStudy: $addStudy
      removeStudy: $removeStudy
      addAssay: $addAssay
      removeAssay: $removeAssay
      addFactor: $addFactor
      removeFactor: $removeFactor
      addMaterial: $addMaterial
      removeMaterial: $removeMaterial
      addProtocol: $addProtocol
      removeProtocol: $removeProtocol
    ) {
      id
      fileName
      fileURL
      mimeType
      fileSize
      identifierName
    }
  }
`;

export const resolver = 'updateFileAttachment';

export const transform = undefined;

export default {
  name,
  query,
  resolver,
  transform,
};

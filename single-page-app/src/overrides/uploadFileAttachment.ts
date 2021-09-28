import { gql } from 'graphql-request';

export const name = 'uploadFileAttachment';

export const query = gql`
  mutation uploadFileAttachment($file: Upload, $identifierName: String) {
    addFileAttachment(file: $file, identifierName: $identifierName) {
      id
      fileName
      fileURL
      mimeType
      fileSize
      identifierName
    }
  }
`;

export const resolver = 'addFileAttachment';

export const transform = undefined;

export default {
  name,
  query,
  resolver,
  transform,
};

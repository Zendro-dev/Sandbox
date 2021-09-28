import { gql } from 'graphql-request';

export const name = 'readOneFileAttachment';

export const query = gql`
  query readOneFileAttachment($id: ID!) {
    readOneFileAttachment(id: $id) {
      id
      fileName
      fileURL
      mimeType
      fileSize
      identifierName
      urlThumbnail(width: 180, height: 180, format: "png")
    }
  }
`;

export const resolver = 'readOneFileAttachment';

export const transform = undefined;

export default {
  name,
  query,
  resolver,
  transform,
};

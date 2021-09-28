import { gql } from 'graphql-request';

export const name = 'readFileAttachments';

export const query = gql`
  query readFileAttachments(
    $order: [orderFileAttachmentInput]
    $search: searchFileAttachmentInput
    $pagination: paginationCursorInput!
  ) {
    fileAttachmentsConnection(
      order: $order
      search: $search
      pagination: $pagination
    ) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node {
          id
          fileName
          fileURL
          mimeType
          fileSize
          identifierName
          urlThumbnail(width: 50, height: 50, format: "png")
        }
      }
    }
  }
`;

export const resolver = 'fileAttachmentsConnection';

export const transform =
  '.fileAttachmentsConnection.pageInfo as $pageInfo | .fileAttachmentsConnection.edges | map(.node) as $records | {  $pageInfo, $records  }';

export default {
  name,
  query,
  resolver,
  transform,
};

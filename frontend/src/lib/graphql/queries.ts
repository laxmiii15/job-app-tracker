import { gql } from '@apollo/client';

export const APPLICATION_FIELDS = gql`
  fragment ApplicationFields on Application {
    id
    companyName
    jobTitle
    jobType
    status
    appliedDate
    notes
    createdAt
    updatedAt
    stageLogs {
      id
      fromStatus
      toStatus
      changedAt
    }
  }
`;

export const GET_APPLICATIONS = gql`
  query Applications($filter: ApplicationFilterInput) {
    applications(filter: $filter) {
      data {
        ...ApplicationFields
      }
      meta {
        total
        page
        limit
        totalPages
      }
    }
  }
  ${APPLICATION_FIELDS}
`;

export const GET_APPLICATION = gql`
  query Application($id: String!) {
    application(id: $id) {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

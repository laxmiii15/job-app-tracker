import { gql } from '@apollo/client';
import { APPLICATION_FIELDS } from './queries';

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($id: String!, $input: UpdateApplicationInput!) {
    updateApplication(id: $id, input: $input) {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

export const DELETE_APPLICATION = gql`
  mutation DeleteApplication($id: String!) {
    deleteApplication(id: $id)
  }
`;

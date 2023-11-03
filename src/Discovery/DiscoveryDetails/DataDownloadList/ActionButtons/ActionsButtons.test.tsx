import React from 'react';
import { render, rerender } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButtons from './ActionButtons';

describe('ActionButtons', () => {
  const mockDiscoveryConfig = {
    features: {
      exportToWorkspace: {
        studyMetadataFieldName: true,
        enableDownloadStudyMetadata: true,
        enableDownloadManifest: true,
        enableDownloadZip: true,
      },
    },
  };

  const mockResourceInfo = {
    study_id: 'mockStudyId',
    study_metadata: { /* mock study metadata */ },
  };

  const mockData = { /* mock data */ };
  const checkResourceInfoConditional = (buttonText: string) => {
    const { queryByText } = render(
      <ActionButtons
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={null}
        data={mockData}
      />
    );
    // Check that the button is no longer rendered
    expect(queryByText(buttonText)).toBeNull();
  }

  const checkExportToWorkspaceConditional = (buttonText:string,condition: string )=>{
    const { getByText, queryByText, rerender } = render(
      <ActionButtons
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        data={mockData} />
    );
    const targetButton = getByText(buttonText);
    expect(targetButton).toBeInTheDocument();
    // Disable the condition for rendering the button
    const changedConfig = structuredClone(mockDiscoveryConfig);
    changedConfig.features.exportToWorkspace[condition] = false;
    rerender(
      <ActionButtons
        discoveryConfig={changedConfig}
        resourceInfo={mockResourceInfo}
        data={mockData}
      />
    );
    // Check that the button is no longer rendered
    expect(queryByText(buttonText)).toBeNull();
  }

  /* TESTS */
  test('renders Download Study-Level Metadata button based on conditionals', () => {
   const buttonText = 'Study-Level Metadata';
   checkExportToWorkspaceConditional(buttonText, 'enableDownloadStudyMetadata');
   checkExportToWorkspaceConditional(buttonText,'studyMetadataFieldName');
   checkResourceInfoConditional(buttonText);

  });

  test('renders Download File Manifest button based on conditionals', () => {
    checkExportToWorkspaceConditional('Download File Manifest','enableDownloadManifest' );
  });
  test('renders Download All Files button based on conditionals', () => {
    checkExportToWorkspaceConditional('Download All Files','enableDownloadZip' );
  });




});

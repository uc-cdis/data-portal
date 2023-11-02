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

  const checkConditionalButton = (buttonText:string,condition: string )=>{
    const { getByText, queryByText, rerender } = render(
      <ActionButtons
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        data={mockData}        />
    );
    const targetButton = getByText(buttonText);
    expect(targetButton).toBeInTheDocument();
    // Disable the condition for rendering the button
    mockDiscoveryConfig.features.exportToWorkspace[condition] = false;
    rerender(
      <ActionButtons
        discoveryConfig={mockDiscoveryConfig}
        resourceInfo={mockResourceInfo}
        data={mockData}
      />
    );
    // Check that the button is no longer rendered
    expect(queryByText(buttonText)).toBeNull();
  }
  test('renders Download Study-Level Metadata button based on conditionals', () => {
   checkConditionalButton('Study-Level Metadata', 'enableDownloadStudyMetadata');
  });
  test('renders Download File Manifest button based on conditionals', () => {
    checkConditionalButton('Download File Manifest','enableDownloadManifest' );
  });
  test('renders Download All Files button based on conditionals', () => {
    checkConditionalButton('Download All Files','enableDownloadZip' );
  });




});

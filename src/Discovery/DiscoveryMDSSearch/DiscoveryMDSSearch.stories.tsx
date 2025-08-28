import React, { useState } from 'react';
import DiscoveryMDSSearch from '.';

export default {
  title: 'HEAL/Discovery/DiscoveryMDSSearch',
  component: DiscoveryMDSSearch,
};
const searchableAndSelectableTextFields = {
  'Study Name': 'study_metadata.minimal_info.study_name',
  'Project Number': 'project_number',
  DOI: 'doi_identifier',
  'Research Program': 'research_program',
  'CDE Drupal ID': 'cde.standardMappings.instrument.id',
  'CDE Field Name': 'cde.fields.name',
  'CDE Field Source': 'cde.fields.standardMappings.source',
};

const MockTemplate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFieldsForSearchIndexing, setSelectedFieldsForSearchIndexing] = useState([] as string[]);

  const handleSearchChange = (ev) => {
    const { value } = ev.currentTarget;
    setSearchTerm(value);
  };
  return (
    <div style={{ margin: '40px auto', width: '800px' }}>
      <DiscoveryMDSSearch
        searchableAndSelectableTextFields={searchableAndSelectableTextFields}
        selectedFieldsForSearchIndexing={selectedFieldsForSearchIndexing}
        setSelectedFieldsForSearchIndexing={setSelectedFieldsForSearchIndexing}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        inputSubtitle='subtitle'
      />
    </div>
  );
};

export const Default = MockTemplate.bind({});

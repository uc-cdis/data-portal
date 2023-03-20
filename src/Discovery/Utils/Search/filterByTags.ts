import { DiscoveryConfig } from '../../DiscoveryConfig';

const filterByTags = (studies: any[], selectedTags: any, config: DiscoveryConfig): any[] => {
  // if no tags selected, show all studies
  if (Object.values(selectedTags).every((selected) => !selected)) {
    return studies;
  }
  const tagField = config.minimalFieldMapping.tagsListFieldName;
  return studies.filter((study) => study[tagField]?.some((tag) => selectedTags[tag.name]));
};

export default filterByTags;

import React from 'react';
import uniq from 'lodash/uniq';
import sum from 'lodash/sum';

import { DiscoveryConfig } from './DiscoveryConfig';
import { AccessLevel } from './consts';

export const getTagColor = (tagCategory: string, config: DiscoveryConfig): string => {
  const categoryConfig = config.tag_categories.find(category => category.name === tagCategory);
  if (categoryConfig === undefined) {
    // eslint-disable-next-line no-console
    console.error(`Misconfiguration error: tag category ${tagCategory} not found in config. Check the 'tag_categories' section of the Discovery page config.`);
    return 'gray';
  }
  return categoryConfig.color;
};

interface AggregationConfig {
  name: string
  field: string
  type: 'sum' | 'count'
}

export const formatValue = (value: any, contentType: 'string' | 'number' | 'paragraphs'): React.ReactNode => {
  switch (contentType) {
  case 'string':
    return value;
  case 'number':
    return value.toLocaleString();
  case 'paragraphs':
    return value.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>);
  default:
    throw new Error(`Unrecognized content type ${contentType}. Check the 'study_page_fields' section of the Discovery config.`);
  }
};

export const renderAggregation =
  (aggregation: AggregationConfig, resources: any[] | null): string => {
    if (!resources) {
      return '';
    }
    const { field, type } = aggregation;
    const fields = resources.map(r => r[field]);
    switch (type) {
    case 'sum':
      return sum(fields).toLocaleString();
    case 'count':
      return uniq(fields).length.toLocaleString();
    default:
      throw new Error(`Misconfiguration error: Unrecognized aggregation type ${type}. Check the 'aggregations' block of the Discovery page config.`);
    }
  };

// getTagsInCategory returns a list of the unique tags in resources which belong
// to the specified category.
export const getTagsInCategory =
  (category: string, resources: any[] | null, config: DiscoveryConfig): string[] => {
    if (!resources) {
      return [];
    }
    const tagMap = {};
    resources.forEach((resource) => {
      const tagField = config.minimal_field_mapping.tags_list_field_name;
      resource[tagField].forEach((tag) => {
        if (tag.category === category) {
          tagMap[tag.name] = true;
        }
      });
    });
    return Object.keys(tagMap);
  };

// FIXME single-purpose, consider refactoring out
export const highlightSearchTerm = (value: string, searchTerm: string, highlighClassName = 'matched'): {highlighted: React.ReactNode, matchIndex: number} => {
  const matchIndex = value.toLowerCase().indexOf(searchTerm.toLowerCase());
  const noMatchFound = matchIndex === -1;
  if (noMatchFound) {
    return { highlighted: value, matchIndex: -1 };
  }
  const prev = value.slice(0, matchIndex);
  const matched = value.slice(matchIndex, matchIndex + searchTerm.length);
  const after = value.slice(matchIndex + searchTerm.length);
  return {
    highlighted: (
      <React.Fragment>
        {prev}
        <span className={highlighClassName}>{matched}</span>
        {after}
      </React.Fragment>
    ),
    matchIndex,
  };
};

export const filterByAccessLevel =
  (resources: any[], accessLevel: AccessLevel, accessibleProperty: string): any[] => {
    switch (accessLevel) {
    case AccessLevel.ACCESSIBLE:
      return resources.filter(r => r[accessibleProperty]);
    case AccessLevel.UNACCESSIBLE:
      return resources.filter(r => !r[accessibleProperty]);
    case AccessLevel.BOTH:
      return resources;
    default:
      throw new Error(`Unrecognized access level ${accessLevel}.`);
    }
  };

export const filterByTags = (resources: any[], selectedTags: any): any[] => {
  // if no tags selected, show all resources
  if (Object.values(selectedTags).every(selected => !selected)) {
    return resources;
  }
  return resources.filter(resource => resource.tags.some(tag => selectedTags[tag.name]));
};

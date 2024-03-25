import React from 'react';
import jsonpath from 'jsonpath';
import AccessDescriptor from '../../AccessDescriptor/AccessDescriptor';
import DataDownloadList from './DataDownloadList/DataDownloadList';
import {
  renderFieldContent,
  DiscoveryResource,
  AccessLevel,
  accessibleFieldName,
} from '../../../../Discovery';
import { User } from '../../../DiscoveryDetailsInterfaces';
import { DiscoveryConfig } from '../../../../DiscoveryConfig';
import LabeledSingleTextField from './LabeledFields/LabeledSingleTextField';
import LabeledSingleLinkField from './LabeledFields/LabeledSingleLinkField';
import LabeledMultipleTextField from './LabeledFields/LabeledMultipleTextField';
import LabeledMultipleLinkField from './LabeledFields/LabeledMultipleLinkField';
import GetMissingRequiredIdentityProviders from './Utils/GetMissingRequiredIdentityProviders';
import FormatResourceValuesWhenNestedArray from './Utils/FormatResourceValuesWhenNestedArray';

type TabFieldConfig = TabFieldGroup['fields'][0];
type TabFieldGroup = DiscoveryConfig['detailView']['tabs'][0]['groups'][0];

const TabField = (
  user: User,
  fieldConfig: TabFieldConfig,
  discoveryConfig: DiscoveryConfig,
  resource: DiscoveryResource,
): JSX.Element | null => {
  // Setup special fields first
  if (fieldConfig.type === 'accessDescriptor') {
    // return accessDescriptor(resource);
    // return AccessDescriptor(resource);
    return (
      <AccessDescriptor
        userHasAccess={resource[accessibleFieldName] === AccessLevel.ACCESSIBLE}
        userDoesNotHaveAccess={resource[accessibleFieldName] === AccessLevel.UNACCESSIBLE}
      />
    );
  }
  if (fieldConfig.type === 'tags') {
    const tags = fieldConfig.categories
      ? (resource.tags || []).filter((tag) => fieldConfig.categories?.includes(tag.category),
      )
      : resource.tags;
    return (
      <div className='discovery-modal__tagsfield'>
        {renderFieldContent(tags, 'tags', discoveryConfig)}
      </div>
    );
  }

  let resourceFieldValue = fieldConfig.sourceField
      && jsonpath.query(resource, `$.${fieldConfig.sourceField}`);

  const resourceFieldValueIsValid: boolean = resourceFieldValue
      && resourceFieldValue.length > 0
      && resourceFieldValue[0]
      && resourceFieldValue[0].length !== 0;

  if (fieldConfig.type === 'dataDownloadList') {
    return (
      <DataDownloadList
        resourceFieldValueIsValid={resourceFieldValueIsValid}
        isUserLoggedIn={Boolean(user.username)}
        discoveryConfig={discoveryConfig}
        resourceInfo={resource}
        sourceFieldData={resourceFieldValue}
        missingRequiredIdentityProviders={GetMissingRequiredIdentityProviders([resource], user.fence_idp)}
      />
    );
  }

  // Here begins some normal fields (texts, links, etc...)
  if (resourceFieldValueIsValid) {
    // Format resourceFieldValue for all other field types
    let isTargetAListField = false;
    if (fieldConfig.type === 'textList' || fieldConfig.type === 'linkList') {
      isTargetAListField = true;
    }
    resourceFieldValue = FormatResourceValuesWhenNestedArray(isTargetAListField, resourceFieldValue);

    if (fieldConfig.type === 'text') {
      // return labeledSingleTextField(fieldConfig.label, resourceFieldValue);
      return LabeledSingleTextField(fieldConfig.label, resourceFieldValue);
    }
    if (fieldConfig.type === 'link') {
      return LabeledSingleLinkField(fieldConfig.label, resourceFieldValue);
    }
    if (fieldConfig.type === 'textList') {
      return LabeledMultipleTextField(fieldConfig.label, resourceFieldValue);
    }
    if (fieldConfig.type === 'linkList') {
      return LabeledMultipleLinkField(fieldConfig.label, resourceFieldValue);
    }
    if (fieldConfig.type === 'block') {
      // return blockTextField(resourceFieldValue);
      return <div className='discovery-modal__field discovery-modal__field--block'>{resourceFieldValue}</div>;
    }
  }
  return null;
};
export default TabField;

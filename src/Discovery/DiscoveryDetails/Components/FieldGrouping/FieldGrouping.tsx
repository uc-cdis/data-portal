import React from 'react';
import jsonpath from 'jsonpath';
import { DiscoveryResource } from '../../../Discovery';
import { User } from '../../DiscoveryDetailsInterfaces';
import { DiscoveryConfig } from '../../../DiscoveryConfig';
import TabField from './TabField/TabField';

type TabFieldGroup = DiscoveryConfig['detailView']['tabs'][0]['groups'][0];
interface FieldGroupingProps {
  user: User;
  group: TabFieldGroup;
  discoveryConfig: DiscoveryConfig;
  resource: DiscoveryResource;
}
const FieldGrouping = ({
  user,
  group,
  discoveryConfig,
  resource,
}: FieldGroupingProps) => {
  // at least one field from this group is either populated in the resource, or isn't configured to pull from a field (e.g. tags)
  const groupHasContent = group.fields.some((field) => {
    // For special fields (tags, access descriptors, etc...)
    if (!field.sourceField) {
      return true;
    }
    const resourceFieldValue = jsonpath.query(
      resource,
      `$.${field.sourceField}`,
    );
    return (
      resourceFieldValue
      && resourceFieldValue.length > 0
      && resourceFieldValue[0]
      && resourceFieldValue[0].length !== 0
    );
  });
  if (groupHasContent) {
    return (
      <div className='discovery-modal__fieldgroup'>
        {group.header && (
          <h3 className='discovery-modal__subheading'>{group.header}</h3>
        )}
        {group.fields.map((field, i) => (
          <div key={i}>{TabField(user, field, discoveryConfig, resource)}</div>
        ))}
      </div>
    );
  }
  return <React.Fragment />;
};
export default FieldGrouping;

// import React, { useCallback } from 'react';
import { bundle } from '../../../localconf';

// props.discovery.selectedResources
//  props.user.fence_idp

const ProcessHealRequiredIdentityProviderInfo = (
  selectedResources,
  fence_idp,
): {} => {
  /* const healRequiredIdentityProviderLogic = useCallback(() => { */
  if (bundle === 'heal') {
    // HP-1233 Generalize IdP-based access control2
    // Find which resources Required IDP
    console.log(
      'selectedResources in HealRequiredIdentityProviderInfo',
      selectedResources,
    );
    const requiredIdentityProvider: string[] = [];
    selectedResources.forEach((resource) => resource?.tags.forEach((tag: { name: string; category: string }) => {
      if (tag?.category === 'RequiredIDP' && tag?.name) {
        // If any resources RequiredIDP check if logged in
        switch (tag.name) {
        case 'InCommon':
          if (fence_idp === 'shibboleth') {
            return; // do not add tag to list
          }
          break;
        default:
          // eslint-disable-next-line no-console
          console.log(
            `Required Identity Provider does not expect: ${tag?.name}`,
          );
          return; // do not add tag to list
        }
        requiredIdentityProvider.push(tag.name);
      }
    }),
    );
    // return requiredIdentityProvider;
    return {
      healLoginNeeded: Boolean(requiredIdentityProvider.length),
      healCredentialsNeeded: requiredIdentityProvider,
    };
  }
  return {
    healLoginNeeded: false,
    healCredentialsNeeded: [],
  };
  // }, [selectedResources, fence_idp]);
  // return healRequiredIdentityProviderLogic;
};
export default ProcessHealRequiredIdentityProviderInfo;

// hdp99999 ICPSR TEST
// hdp88888 ICPSR TEST

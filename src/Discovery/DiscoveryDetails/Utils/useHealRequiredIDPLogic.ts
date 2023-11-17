import React, { useCallback } from 'react';
import { bundle } from '../../../localconf';

// props.discovery.selectedResources
//  props.user.fence_idp

const useHealRequiredIDPLogic = (selectedResources, fence_idp): any => {
  const healRequiredIDPLogic = useCallback(() => {
    if (bundle === 'heal') {
      // HP-1233 Generalize IdP-based access control
      // Find which resources Required IDP
      const requiredIDP: string[] = [];
      selectedResources.forEach((resource) =>
        resource?.tags.forEach((tag: { name: string; category: string }) => {
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
                console.log(`RequiredIDP does not expect: ${tag?.name}`);
                return; // do not add tag to list
            }
            requiredIDP.push(tag.name);
          }
        })
      );
      return requiredIDP;
    }
    return [];
  }, [selectedResources, fence_idp]);
  return healRequiredIDPLogic;
};
export default useHealRequiredIDPLogic;

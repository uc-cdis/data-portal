import { bundle } from '../../../localconf';

const GetMissingRequiredIdentityProviders = (
  selectedResources: any[],
  fenceIdentityProvider: string | undefined,
): string[] => {
  const missingRequiredIdentityProvider: string[] = [];
  if (bundle === 'heal' && Array.isArray(selectedResources) && Object.keys(selectedResources[0]).length > 0) {
    selectedResources.forEach((resource) => resource?.tags.forEach((tag: { name: string; category: string }) => {
      if (tag?.category === 'RequiredIDP' && tag?.name) {
        // If any resources RequiredIDP check if logged in
        switch (tag.name) {
        case 'InCommon':
          if (fenceIdentityProvider === 'shibboleth') {
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
        missingRequiredIdentityProvider.push(tag.name);
      }
    }),
    );
  }
  return missingRequiredIdentityProvider;
};
export default GetMissingRequiredIdentityProviders;

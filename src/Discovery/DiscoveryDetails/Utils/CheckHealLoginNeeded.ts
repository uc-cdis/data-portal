import { bundle } from '../../../localconf';

const CheckHealLoginNeeded = (
  selectedResources: any[],
  fenceIdentityProvider: string | undefined,
): boolean => {
  if (bundle === 'heal') {
    const requiredIdentityProvider: string[] = [];
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
        requiredIdentityProvider.push(tag.name);
      }
    }),
    );
    // return requiredIdentityProvider;
    return Boolean(requiredIdentityProvider.length);
  }
  return false;
};
export default CheckHealLoginNeeded;

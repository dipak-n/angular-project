import { CanDeactivateFn } from '@angular/router';
import { UnsavedChanges } from './unsaved-changes';

export const unsavedChangesGuard: CanDeactivateFn<UnsavedChanges> = (
  component
) => {

  if (component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Do you want to leave?');
  }

  return true;
};

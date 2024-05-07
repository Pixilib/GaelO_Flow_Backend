import { RolesService } from '../roles/roles.service';
import OrthancClient from './orthanc-client';

export const checkLabelRoleStudy = async (
  studyID: string,
  role: string,
  rolesService: RolesService,
  orthancClient: OrthancClient,
) => {
  const labelsOfRole = (await rolesService.getRoleLabels(role)).map(
    (label) => label.Name,
  );
  const labelsOfStudy = await orthancClient
    .listLabels('studies', studyID)
    .catch(() => {
      return [];
    });

  return (
    labelsOfRole.filter((value: string) => labelsOfStudy.includes(value))
      .length > 0
  );
};

import { RolesService } from '../roles/roles.service';
import OrthancClient from './orthanc-client';
/**
 * Utils fonction checking a Orthanc Study has at least one label of a role.
 * @param studyID
 * @param role
 * @param rolesService
 * @param orthancClient
 * @returns
 */
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

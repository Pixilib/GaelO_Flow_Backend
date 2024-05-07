import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { checkLabelRoleStudy } from '../utils/check-label-role-study';
import OrthancClient from '../utils/orthanc-client';

@Injectable()
export class DicomWebGuard implements CanActivate {
  private level: string;
  private pathname: string;
  private query: Record<string, any> = {};

  constructor(
    private readonly orthancClient: OrthancClient,
    private readonly rolesService: RolesService,
  ) {}

  private setLevel(): void {
    if (Object.keys(this.query).length > 0) {
      if (this.query['00100020']) {
        this.level = 'patients';
        return;
      }

      if (this.query['0020000D'] || this.query['StudyInstanceUID']) {
        this.level = 'studies';
        return;
      }
    }

    if (this.pathname.endsWith('/studies')) this.level = 'patients';
    else if (this.pathname.endsWith('/series')) this.level = 'studies';
    else this.level = 'series';
  }

  private getPatientID(): string {
    if (this.query['00100020']) return this.query['00100020'].replace('*', '');
    else {
      throw new Error('No Patient ID Found');
    }
  }

  private getStudyInstanceUID(): string {
    if (Object.keys(this.query).length > 0) {
      if (this.query?.['0020000D']) return this.query?.['0020000D'];
      if (this.query?.['StudyInstanceUID'])
        return this.query?.['StudyInstanceUID'];
    }
    return this.getUID(this.pathname, 'studies');
  }

  private getSeriesInstanceUID(): string {
    return this.getUID(this.pathname, 'series');
  }

  /**
   * Isolate the called Study or Series Instance UID
   * @return string
   */
  private getUID($requestedURI: string, level: string): string {
    let studySubString = this.strstr($requestedURI, '/' + level + '/', false);
    studySubString = studySubString.replace('/' + level + '/', '');

    const endStudyUIDPosition = studySubString.indexOf('/');

    let studyUID: string;
    if (endStudyUIDPosition) {
      studyUID = studySubString.substr(0, endStudyUIDPosition);
    } else {
      studyUID = studySubString;
    }

    return studyUID;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = new URL('http://localhost:3000' + request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const userRole = request.user.role.Name;

    this.pathname = url.pathname;
    this.query = params;
    this.setLevel();

    let orthancStudyId = null;
    if (this.level === 'patients') {
      //Patient Level cannot be associated to a label, so we check that the client asked for a specific patient for the qido request
      //Metadata and image retrieve will use anyway the studies/series which are protected
      if (this.getPatientID()) return true;
    } else if (this.level === 'series') {
      const getSeriesInstanceUID = this.getSeriesInstanceUID();
      const series = await this.orthancClient.lookup(getSeriesInstanceUID);
      if (series.length == 1) {
        const orthancSeriesId = series[0].ID;
        const parentStudy = await this.orthancClient
          .getParentStudy('series', orthancSeriesId)
          .catch(() => null);

        if (parentStudy?.ID) {
          orthancStudyId = parentStudy.ID;
        }
      }
    } else if (this.level === 'studies') {
      const getStudyInstanceUID = this.getStudyInstanceUID();
      const parentStudies =
        await this.orthancClient.lookup(getStudyInstanceUID);
      if (parentStudies.length == 1) {
        orthancStudyId = parentStudies[0].ID;
      }
    }

    if (orthancStudyId)
      return await checkLabelRoleStudy(
        orthancStudyId,
        userRole,
        this.rolesService,
        this.orthancClient,
      );
    return false;
  }

  private strstr(haystack, needle, bool) {
    // Finds first occurrence of a string within another
    //
    // version: 1103.1210
    // discuss at: http://phpjs.org/functions/strstr
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strstr(‘Kevin van Zonneveld’, ‘van’);
    // *     returns 1: ‘van Zonneveld’
    // *     example 2: strstr(‘Kevin van Zonneveld’, ‘van’, true);
    // *     returns 2: ‘Kevin ‘
    // *     example 3: strstr(‘name@example.com’, ‘@’);
    // *     returns 3: ‘@example.com’
    // *     example 4: strstr(‘name@example.com’, ‘@’, true);
    // *     returns 4: ‘name’
    let pos = 0;

    haystack += '';
    pos = haystack.indexOf(needle);
    if (pos == -1) {
      return false;
    } else {
      if (bool) {
        return haystack.substr(0, pos);
      } else {
        return haystack.slice(pos);
      }
    }
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class DicomWebGuard implements CanActivate {
  const private level: string;
  const private pathname: string;
  const private query : Record<string, any> = {};

  constructor() {}

  private setLevel(): void {

    if (Object.keys(this.query).length > 0) {
      const params = [];
      //parse_str($url['query'], $params);

      if (params['00100020']) {
        this.level = 'patients';
        return;
      }

      if (params['0020000D'] || params['StudyInstanceUID']) {
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

  private getStudyInstanceUID(url): string {
    if (Object.keys(this.query).length > 0) {
      if (this.query?.['0020000D']) return this.query?.['0020000D'];
      if (this.query?.params['StudyInstanceUID']) return this.query?.params['StudyInstanceUID'];
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

    let studyUID;
    if (endStudyUIDPosition) {
      studyUID = studySubString.substr(0, endStudyUIDPosition);
    } else {
      studyUID = studySubString;
    }

    return studyUID;
  }

  canActivate(context: ExecutionContext): boolean {
    const url = new URL(context.)
    const params = Object.fromEntries(url.searchParams.entries())

    this.pathname = url.pathname;
    this.query = params;
    this.setLevel()

    const orthancStudyId;
    if(this.level === 'series') {
      const getSeriesInstanceUID = this.getUID(this.pathname, 'series');
      //Apeller lookup pour avoir la series ID orthanc et appeler la study parente


    }else if(this.level === 'studies') {
      const getStudyInstanceUID = this.getUID(this.pathname, 'studies');
      //Apeller lookup pour avoir la study ID orthanc
    }

    //Check que la ressource Orthanc ID study a bien un des label du role de l'utilisateur

    return false;
  }

  private strstr(haystack, needle, bool) {
    // Finds first occurrence of a string within another
    //
    // version: 1103.1210
    // discuss at: http://phpjs.org/functions/strstr    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strstr(‘Kevin van Zonneveld’, ‘van’);
    // *     returns 1: ‘van Zonneveld’    // *     example 2: strstr(‘Kevin van Zonneveld’, ‘van’, true);
    // *     returns 2: ‘Kevin ‘
    // *     example 3: strstr(‘name@example.com’, ‘@’);
    // *     returns 3: ‘@example.com’
    // *     example 4: strstr(‘name@example.com’, ‘@’, true);    // *     returns 4: ‘name’
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

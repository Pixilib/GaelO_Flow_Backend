import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class DicomWebGuard implements CanActivate {
  private level: string;
  constructor() {}

  private setLevel(url: any): void {
    const path: string = url['path'];
    const query = url['query'];

    if (query) {
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

    if (path.endsWith('/studies')) this.level = 'patients';
    else if (path.endsWith('/series')) this.level = 'studies';
    else this.level = 'series';
  }

  private getPatientID(url): string {
    const params = [];
    //parse_str($url['query'], $params);
    // Filter wild card beacause OHIF add wildcard
    if (params['00100020']) return params['00100020'].replace('*', '');
    else {
      throw new Error('No Patient ID Found');
    }
  }

  private getStudyInstanceUID(url): string {
    const query = url['query'];
    if (query) {
      const params = [];
      //parse_str($url['query'], $params);
      if (params['0020000D']) return params['0020000D'];
      if (params['StudyInstanceUID']) return params['StudyInstanceUID'];
    }
    return this.getUID(url['path'], 'studies');
  }

  private getSeriesInstanceUID(url): string {
    return this.getUID(url['path'], 'series');
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
    //$url = parse_url($requestedURI);
    //$this->setLevel($url);

    // si series => recup study
    // Get label de la study
    // Verif que user à acces au label de la study parent ou a acces à toute les data

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

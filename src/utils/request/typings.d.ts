declare namespace AxiosTypes {
  type VersionType = 'stable' | 'beta';

  type ApiResult<T> = {
    code: 200 | 400 | 403 | 404 | 500;
    msg: string;
    data: T;
  };

  interface CheckUpdateProps {
    versionSymbol: number;
    versionType: VersionType;
  }

  interface UpdateInfo {
    id: number;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
    versionType: VersionType;
    versionSymbol: number;
    releaseDate: string;
    resVersion: string;
    isForce: boolean;
    url: string;
    content: string[];
  }

  interface CheckUpdateResult {
    hasUpdate: boolean;
    update: UpdateInfo;
  }

  interface GetAnnouncementResult {
    id: string;
    content: string[];
  }
}

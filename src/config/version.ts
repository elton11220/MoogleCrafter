type VersionInfo = {
  versionSymbol: number;
  compositedVersionSymbol: string;
  versionType: AxiosTypes.VersionType;
  resVersion: string;
};

const versionInfo: VersionInfo = {
  versionSymbol: 0,
  compositedVersionSymbol: '0.1.0-stable-230407',
  versionType: 'stable',
  resVersion: '2023.02.16.0000.0000-6.25-chs',
};

Object.freeze(versionInfo);

export default versionInfo;

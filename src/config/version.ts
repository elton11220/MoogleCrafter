type VersionInfo = {
  appName: string;
  versionSymbol: number;
  compositedVersionSymbol: string;
  versionType: AxiosTypes.VersionType;
  resVersion: string;
};

const versionInfo: VersionInfo = {
  appName: '莫古锤子',
  versionSymbol: 4,
  compositedVersionSymbol: '0.2.0-stable-230501',
  versionType: 'stable',
  resVersion: '2023.02.16.0000.0000-6.25-chs',
};

Object.freeze(versionInfo);

export default versionInfo;

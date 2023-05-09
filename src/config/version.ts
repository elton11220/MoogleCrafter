type VersionInfo = {
  appName: string;
  versionSymbol: number;
  compositedVersionSymbol: string;
  versionType: AxiosTypes.VersionType;
  resVersion: string;
};

const versionInfo: VersionInfo = {
  appName: '莫古锤子',
  versionSymbol: 6,
  compositedVersionSymbol: '0.2.2-stable-230509',
  versionType: 'stable',
  resVersion: '2023.04.21.0000.0000-6.3-chs',
};

Object.freeze(versionInfo);

export default versionInfo;

type VersionInfo = {
  appName: string;
  versionSymbol: number;
  compositedVersionSymbol: string;
  versionType: AxiosTypes.VersionType;
  resVersion: string;
};

const versionInfo: VersionInfo = {
  appName: '莫古锤子',
  versionSymbol: 1,
  compositedVersionSymbol: '0.1.1-stable-230423',
  versionType: 'stable',
  resVersion: '2023.02.16.0000.0000-6.25-chs',
};

Object.freeze(versionInfo);

export default versionInfo;

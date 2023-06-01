import {useCallback, useEffect, useMemo, useState} from 'react';
import {Linking, ToastAndroid} from 'react-native';
import {checkUpdate} from '../../utils/request';
import versionInfo from '../../config/version';

type Params = {
  onDismiss?: () => void;
  onConfirm?: () => void;
  showCheckTip?: boolean;
  checkWhenMount?: boolean;
};

export function useUpdateDialog(
  params: Params = {checkWhenMount: false, showCheckTip: false},
) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentUpdateInfo, setCurrentUpdateInfo] =
    useState<AxiosTypes.UpdateInfo>({
      id: 0,
      majorVersion: 0,
      minorVersion: 0,
      patchVersion: 0,
      versionType: 'stable',
      versionSymbol: 0,
      minVersionSymbol: 0,
      releaseDate: '',
      resVersion: '',
      isForce: false,
      url: '',
      content: [],
    });
  const computedUpdateInfo = useMemo(
    () => ({
      version: `V${currentUpdateInfo.majorVersion}.${currentUpdateInfo.minorVersion}.${currentUpdateInfo.patchVersion}-${currentUpdateInfo.versionType}-${currentUpdateInfo.releaseDate}`,
      isForce:
        currentUpdateInfo.isForce ||
        versionInfo.versionSymbol < currentUpdateInfo.minVersionSymbol,
      content: currentUpdateInfo.content,
    }),
    [
      currentUpdateInfo.content,
      currentUpdateInfo.isForce,
      currentUpdateInfo.majorVersion,
      currentUpdateInfo.minVersionSymbol,
      currentUpdateInfo.minorVersion,
      currentUpdateInfo.patchVersion,
      currentUpdateInfo.releaseDate,
      currentUpdateInfo.versionType,
    ],
  );
  const onDismissDialog = useCallback(() => {
    setDialogVisible(false);
    if (params?.onDismiss) {
      params.onDismiss();
    }
  }, [params]);
  const onConfirmDialog = useCallback(() => {
    if (currentUpdateInfo.url) {
      Linking.openURL(currentUpdateInfo.url);
    }
    if (params?.onConfirm) {
      params.onConfirm();
    }
  }, [currentUpdateInfo.url, params]);
  const check = useCallback(() => {
    if (params?.showCheckTip) {
      ToastAndroid.show('正在检查更新，请稍候...', ToastAndroid.SHORT);
    }
    return new Promise<boolean>(resolve => {
      checkUpdate({
        versionType: versionInfo.versionType,
        versionSymbol: versionInfo.versionSymbol,
      })
        .then(data => {
          if (data.hasUpdate) {
            setCurrentUpdateInfo(data.update);
            setDialogVisible(true);
            resolve(true);
          } else {
            if (params.showCheckTip) {
              ToastAndroid.show(
                '已经是最新版本，无需更新库啵~',
                ToastAndroid.SHORT,
              );
            }
            resolve(false);
          }
        })
        .catch(() => {
          ToastAndroid.show(
            '检查更新失败，服务器可能炸了库啵。去看看b站：緑胡子大叔 发了什么公告吧',
            ToastAndroid.LONG,
          );
          resolve(false);
        });
    });
  }, [params.showCheckTip]);
  useEffect(() => {
    if (params.checkWhenMount) {
      check();
    }
  }, [check, params.checkWhenMount]);
  return {
    visible: dialogVisible,
    onDismiss: onDismissDialog,
    onConfirm: onConfirmDialog,
    check,
    currentUpdateInfo: computedUpdateInfo,
  };
}

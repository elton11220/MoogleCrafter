import {memo, useCallback, useEffect, useState} from 'react';
import type {FC} from 'react';
import {StyleSheet} from 'react-native';
import {Dialog, Portal, Button, Text, useTheme} from 'react-native-paper';
import {useStore} from '../../store';
import {px2DpY} from '../../utils/dimensionConverter';
import {getAnnouncement} from '../../utils/request';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';

const AnnouncementDialog: FC<AnnouncementDialog.Props> = () => {
  const {readAnnouncementId, updateReadAnnouncementId} = useStore(s => ({
    readAnnouncementId: s.readAnnouncementId,
    updateReadAnnouncementId: s.updateReadAnnouncementId,
  }));
  const [announcement, setAnnouncement] =
    useState<AxiosTypes.GetAnnouncementResult>({
      id: readAnnouncementId,
      content: [],
    });
  const [visible, setVisible] = useState(false);
  const theme = useTheme<typeof DefaultLightTheme>();
  useEffect(() => {
    getAnnouncement()
      .then(data => {
        if (data.id !== readAnnouncementId) {
          setAnnouncement(data);
          setVisible(true);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const closeModal = useCallback(() => setVisible(false), []);
  const onDisableCurrent = useCallback(() => {
    setVisible(false);
    updateReadAnnouncementId(announcement.id);
  }, [announcement.id, updateReadAnnouncementId]);
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={closeModal}>
        <Dialog.Title>公告</Dialog.Title>
        <Dialog.Content>
          {announcement.content.map((item, index) => (
            <Text
              key={index}
              allowFontScaling={false}
              style={[
                styles.contentText,
                {
                  color: theme.colors.secondaryContentText,
                },
              ]}
              textBreakStrategy="simple">
              {`${index + 1}. ${item}`}
            </Text>
          ))}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDisableCurrent}>不再提示</Button>
          <Button onPress={closeModal}>确定</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: px2DpY(13),
    lineHeight: px2DpY(20),
  },
});

export default memo(AnnouncementDialog);

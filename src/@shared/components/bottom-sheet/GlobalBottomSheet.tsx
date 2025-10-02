import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useBottomSheet } from '@core/hooks/useBottomSheet';
import { BackHandler, StyleSheet, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetModalProvider, BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const createStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    outerContainer: {
      zIndex: 1000,
    },
    container: {
      backgroundColor: colors.surface,
      flex: 1,
    },
    contentContainer: {
      flexGrow: 0,
    },
    scrollViewContainer: {
      flex: 1,
    },
    scrollViewContentContainer: {
      flexGrow: 1,
    },
    backdropContainer: {
      backgroundColor: colors.surface,
    },
  });

const BottomSheetBackground: React.FC<BottomSheetBackgroundProps> = ({
                                                                       style,
                                                                     }) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return <View style={[style, styles.container]} />;
};

const GlobalBottomSheet = () => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const styles = createStyles(colors);
  const { isOpen, content, close } = useBottomSheet();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    console.log('BottomSheet isOpen:', isOpen);
    if (bottomSheetRef) {
      if (isOpen) {
        bottomSheetRef.current?.present();
      } else {
        bottomSheetRef.current?.dismiss();
      }
    }
  }, [bottomSheetRef, isOpen]);

  useEffect(() => {
    const handleBackButton = () => {
      const state = useBottomSheet.getState();

      if (state.isOpen) {
        state.close();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton
    );

    return () => backHandler.remove();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      close();
    }
  }, [close]);

  const backdropRender = useCallback(
    (backdropProps: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={true}
        opacity={0.7}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      enableDynamicSizing={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      animateOnMount={true}
      index={0}
      backgroundComponent={BottomSheetBackground}
      backdropComponent={backdropRender}
      onChange={handleSheetChanges}
      ref={bottomSheetRef}>
      <BottomSheetScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
        {content}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

export default GlobalBottomSheet;

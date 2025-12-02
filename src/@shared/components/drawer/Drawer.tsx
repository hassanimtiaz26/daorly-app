import { Drawer } from 'react-native-paper';
import { useDrawer } from '@core/hooks/useDrawer';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/@core/hooks/useAuth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  // This is the semi-transparent background behind the drawer
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'flex-end',
  },
  // This is the actual drawer view
  drawerContainer: {
    height: '100%',
    width: '80%', // Adjust width as needed
    maxWidth: 300,
    paddingTop: 50,
    // The background color is set from the theme in the component
  },
});

const ThemedDrawer = () => {
  const { isOpen, close } = useDrawer();
  const { colors } = useAppTheme();
  const { logout } = useAuth();
  const { navigate, push } = useRouter();
  const { user } = useAuth();

  const iconSize = 32;

  return (
    <Modal
      animationType="fade" // 'slide', 'fade', or 'none'
      transparent={true}
      visible={isOpen}
      navigationBarTranslucent={false}
      statusBarTranslucent={true}
      onRequestClose={close} // For Android back button
    >
      <Pressable style={styles.modalBackdrop} onPress={close}>
        <Pressable style={[styles.drawerContainer, { backgroundColor: colors.background }]} onPress={(e) => e.stopPropagation()}>

          <Image
            style={styles.logo}
            contentFit={'contain'}
            source={require('@/assets/images/daorly-logo.png')} />

          <Drawer.Section>
            <Drawer.Item
              icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'list-alt'} />}
              label="Orders"
              onPress={() => {
                navigate('/(app)/(tabs)/orders')
                close();
              }}
            />
            <Drawer.Item
              icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'groups'} />}
              label="Profile"
              onPress={() => {
                navigate('/(app)/(tabs)/profile')
                close();
              }}
            />

            <Drawer.Item
              icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'security'} />}
              label="Security"
              onPress={() => {
                navigate('/(app)/security')
                close();
              }}
            />

            {user && user.role === 'provider' && (
              <>
                <Drawer.Item
                  icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'wallet'} />}
                  label="Wallet"
                  onPress={() => {
                    navigate('/(app)/wallet')
                    close();
                  }}
                />
                <Drawer.Item
                  icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'view-list'} />}
                  label="Plans"
                  onPress={() => {
                    navigate('/(app)/plans')
                    close();
                  }}
                />
              </>
            )}

            <Drawer.Item
              icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'info'} />}
              label="About Us"
              onPress={() => {
                push({
                  pathname: '/(app)/page',
                  params: { name: 'aboutUs' }
                });
                close();
              }}
            />
            <Drawer.Item
              icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'contact-phone'} />}
              label="Contact Us"
              onPress={() => {
                navigate('/(app)/contact')
                close();
              }}
            />
            <Drawer.Item
              icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'privacy-tip'} />}
              label="Privacy Policy"
              onPress={() => {
                push({
                  pathname: '/(app)/page',
                  params: { name: 'privacyPolicy' }
                });
                close();
              }}
            />
          </Drawer.Section>

          <Drawer.Item
            style={{ marginTop: 'auto' }}
            icon={({ color }) => <MaterialIcon color={color} size={iconSize} name={'logout'} />}
            label="Logout"
            onPress={() => {
              logout();
              close();
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default ThemedDrawer;

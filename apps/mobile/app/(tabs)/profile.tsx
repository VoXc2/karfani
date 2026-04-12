import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { clearTokens } from '../../lib/api';
import { colors, spacing, fontSizes } from '../../lib/theme';

const MENU_ITEMS = [
  { label: 'حجوزاتي', icon: '📋', route: '/(tabs)/bookings' },
  { label: 'المفضلة', icon: '❤️', route: null },
  { label: 'الإشعارات', icon: '🔔', route: null },
  { label: 'الدعم الفني', icon: '💬', route: null },
  { label: 'اللغة', icon: '🌐', route: null },
  { label: 'عن كرفاني', icon: 'ℹ️', route: null },
];

export default function ProfileScreen() {
  const handleLogout = async () => {
    await clearTokens();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>م</Text>
        </View>
        <Text style={styles.name}>مستخدم جديد</Text>
        <Text style={styles.phone}>+966 5X XXX XXXX</Text>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => item.route && router.push(item.route as any)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: spacing.xl },
  header: { alignItems: 'center', padding: spacing.xl, paddingTop: 60, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.creamDark },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.olive, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarText: { fontSize: fontSizes.title, color: colors.white, fontWeight: '700' },
  name: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.charcoal },
  phone: { fontSize: fontSizes.md, color: colors.charcoalLight, marginTop: 4 },
  menu: { margin: spacing.md, backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.creamDark, overflow: 'hidden' },
  menuItem: { flexDirection: 'row-reverse', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.creamDark, gap: spacing.sm },
  menuIcon: { fontSize: 20 },
  menuLabel: { fontSize: fontSizes.md, color: colors.charcoal, fontWeight: '500' },
  logoutButton: { margin: spacing.md, backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.error },
  logoutText: { color: colors.error, fontSize: fontSizes.md, fontWeight: '600' },
});

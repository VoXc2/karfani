import { Tabs } from 'expo-router';
import { colors } from '../../lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.olive,
        tabBarInactiveTintColor: colors.charcoalLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.creamDark,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'الرئيسية' }} />
      <Tabs.Screen name="explore" options={{ title: 'استكشف' }} />
      <Tabs.Screen name="bookings" options={{ title: 'حجوزاتي' }} />
      <Tabs.Screen name="profile" options={{ title: 'حسابي' }} />
    </Tabs>
  );
}

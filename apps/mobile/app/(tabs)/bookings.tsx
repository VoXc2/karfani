import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../../lib/theme';

const BOOKINGS = [
  { id: '1', bookingNumber: 'KRF-ABC123', caravan: 'كرفان عائلي فاخر', startDate: '2026-05-10', endDate: '2026-05-13', status: 'CONFIRMED', total: 3600 },
  { id: '2', bookingNumber: 'KRF-DEF456', caravan: 'فان مغامرات الصحراء', startDate: '2026-04-20', endDate: '2026-04-22', status: 'COMPLETED', total: 1400 },
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: 'بانتظار الدفع', color: colors.copper },
  CONFIRMED: { label: 'مؤكد', color: colors.olive },
  ACTIVE: { label: 'نشط', color: colors.olive },
  COMPLETED: { label: 'مكتمل', color: colors.charcoalLight },
  CANCELLED: { label: 'ملغي', color: colors.error },
};

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>حجوزاتي</Text>
      </View>

      <FlatList
        data={BOOKINGS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const status = STATUS_MAP[item.status] || STATUS_MAP.CONFIRMED;
          return (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.bookingNumber}>{item.bookingNumber}</Text>
                <View style={[styles.badge, { backgroundColor: status.color + '20' }]}>
                  <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
              <Text style={styles.caravanName}>{item.caravan}</Text>
              <Text style={styles.dates}>{item.startDate} → {item.endDate}</Text>
              <Text style={styles.total}>{item.total} ر.س</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد حجوزات بعد</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { padding: spacing.md, paddingTop: 60, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.creamDark },
  title: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.charcoal, textAlign: 'right' },
  list: { padding: spacing.md, gap: spacing.sm },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.creamDark },
  cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  bookingNumber: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.charcoalLight, fontFamily: 'monospace' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: fontSizes.xs, fontWeight: '600' },
  caravanName: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.charcoal, textAlign: 'right' },
  dates: { fontSize: fontSizes.sm, color: colors.charcoalLight, textAlign: 'right', marginTop: 4 },
  total: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.olive, textAlign: 'right', marginTop: spacing.xs },
  empty: { textAlign: 'center', color: colors.charcoalLight, fontSize: fontSizes.md, marginTop: spacing.xl },
});

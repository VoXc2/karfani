import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, spacing, fontSizes } from '../../lib/theme';

export default function CaravanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageSection}>
        <Text style={styles.imageEmoji}>🏕️</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>كرفان عائلي فاخر</Text>
        <Text style={styles.meta}>كرفان متنقل • 📍 الرياض</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>أشخاص</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>التقييم</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>124</Text>
            <Text style={styles.statLabel}>تقييم</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>الوصف</Text>
        <Text style={styles.description}>
          كرفان عائلي فاخر مجهز بالكامل يتسع لـ 6 أشخاص. يحتوي على مطبخ كامل، حمام، غرفة نوم رئيسية، وسريرين إضافيين.
          مزود بتكييف وتدفئة ونظام طاقة شمسية. مثالي للرحلات العائلية والمغامرات في الطبيعة.
        </Text>

        <Text style={styles.sectionTitle}>المميزات</Text>
        <View style={styles.features}>
          {['تكييف', 'مطبخ', 'حمام', 'واي فاي', 'طاقة شمسية', 'شاشة تلفزيون'].map((f) => (
            <View key={f} style={styles.featureBadge}>
              <Text style={styles.featureText}>✓ {f}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>يبدأ من</Text>
          <Text style={styles.price}>1,200 ر.س / يوم</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>احجز الآن</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: 100 },
  imageSection: { height: 250, backgroundColor: colors.sandLight, alignItems: 'center', justifyContent: 'center' },
  imageEmoji: { fontSize: 80 },
  backButton: { position: 'absolute', top: 50, right: 16, backgroundColor: colors.white, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 20, color: colors.charcoal },
  info: { padding: spacing.md },
  title: { fontSize: fontSizes.xxl, fontWeight: '700', color: colors.charcoal, textAlign: 'right' },
  meta: { fontSize: fontSizes.md, color: colors.charcoalLight, textAlign: 'right', marginTop: 4 },
  stats: { flexDirection: 'row-reverse', justifyContent: 'space-around', backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginVertical: spacing.md, borderWidth: 1, borderColor: colors.creamDark },
  stat: { alignItems: 'center' },
  statValue: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.olive },
  statLabel: { fontSize: fontSizes.xs, color: colors.charcoalLight },
  sectionTitle: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.charcoal, textAlign: 'right', marginTop: spacing.md, marginBottom: spacing.xs },
  description: { fontSize: fontSizes.md, color: colors.charcoalLight, textAlign: 'right', lineHeight: 24 },
  features: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: spacing.xs },
  featureBadge: { backgroundColor: colors.olive + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  featureText: { fontSize: fontSizes.sm, color: colors.olive, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.creamDark },
  priceLabel: { fontSize: fontSizes.xs, color: colors.charcoalLight, textAlign: 'right' },
  price: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.olive },
  bookButton: { backgroundColor: colors.olive, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: 12 },
  bookButtonText: { color: colors.white, fontSize: fontSizes.md, fontWeight: '600' },
});

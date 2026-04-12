import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, fontSizes } from '../../lib/theme';

const FEATURED = [
  { id: '1', title: 'كرفان عائلي فاخر', location: 'الرياض', price: 1200, rating: 4.8, image: null },
  { id: '2', title: 'فان مغامرات الصحراء', location: 'العلا', price: 700, rating: 4.9, image: null },
  { id: '3', title: 'كرفان فاخر VIP', location: 'حائل', price: 2200, rating: 5.0, image: null },
  { id: '4', title: 'كرفان رحلات طويلة', location: 'عسير', price: 950, rating: 4.7, image: null },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>مرحباً بك في</Text>
        <Text style={styles.logo}>كرفاني</Text>
        <Text style={styles.tagline}>اكتشف أجمل الكرفانات في المملكة</Text>
      </View>

      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(tabs)/explore')}>
          <Text style={styles.searchText}>ابحث عن كرفان...</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>الأكثر طلباً</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent}>
        {FEATURED.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => router.push(`/caravan/${item.id}`)}>
            <View style={styles.cardImage}>
              <Text style={styles.cardEmoji}>🏕️</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardLocation}>📍 {item.location}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>{item.price} ر.س/يوم</Text>
                <Text style={styles.cardRating}>⭐ {item.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>فئات الكرفانات</Text>
      <View style={styles.categories}>
        {[
          { label: 'كرفان متنقل', icon: '🚐' },
          { label: 'كرفان فاخر', icon: '✨' },
          { label: 'فان مجهز', icon: '🏔️' },
          { label: 'مقطورة', icon: '🏕️' },
        ].map((cat) => (
          <TouchableOpacity key={cat.label} style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: spacing.xl },
  header: { padding: spacing.xl, paddingTop: 60, backgroundColor: colors.olive, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  greeting: { fontSize: fontSizes.md, color: colors.sandLight },
  logo: { fontSize: fontSizes.title, fontWeight: '700', color: colors.white, marginVertical: spacing.xs },
  tagline: { fontSize: fontSizes.sm, color: colors.sandLight },
  searchBar: { padding: spacing.md, marginTop: -20 },
  searchButton: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.creamDark },
  searchText: { color: colors.charcoalLight, fontSize: fontSizes.md, textAlign: 'right' },
  sectionTitle: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.charcoal, paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm, textAlign: 'right' },
  carouselContent: { paddingHorizontal: spacing.md, gap: spacing.sm },
  card: { width: 200, backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.creamDark },
  cardImage: { height: 120, backgroundColor: colors.sandLight, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 48 },
  cardBody: { padding: spacing.sm },
  cardTitle: { fontSize: fontSizes.md, fontWeight: '600', color: colors.charcoal, textAlign: 'right' },
  cardLocation: { fontSize: fontSizes.xs, color: colors.charcoalLight, marginTop: 2, textAlign: 'right' },
  cardFooter: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: spacing.xs },
  cardPrice: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.olive },
  cardRating: { fontSize: fontSizes.sm, color: colors.copper },
  categories: { flexDirection: 'row-reverse', flexWrap: 'wrap', padding: spacing.md, gap: spacing.sm },
  categoryCard: { width: '47%', backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.creamDark },
  categoryIcon: { fontSize: 32, marginBottom: spacing.xs },
  categoryLabel: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.charcoal },
});

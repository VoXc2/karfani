import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, fontSizes } from '../../lib/theme';

const CARAVANS = [
  { id: '1', title: 'كرفان عائلي فاخر', type: 'كرفان متنقل', location: 'الرياض', sleeps: 6, price: 1200, rating: 4.8 },
  { id: '2', title: 'كرفان فاخر VIP', type: 'كرفان فاخر', location: 'حائل', sleeps: 8, price: 2200, rating: 5.0 },
  { id: '3', title: 'كرفان رحلات طويلة', type: 'مقطورة', location: 'عسير', sleeps: 4, price: 950, rating: 4.7 },
  { id: '4', title: 'فان مغامرات الصحراء', type: 'فان مجهز', location: 'العلا', sleeps: 2, price: 700, rating: 4.9 },
  { id: '5', title: 'فان تخييم جبلي', type: 'فان مجهز', location: 'الباحة', sleeps: 3, price: 600, rating: 4.8 },
  { id: '6', title: 'كرفان الأحلام', type: 'كرفان فاخر', location: 'أملج', sleeps: 6, price: 1800, rating: 4.9 },
];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');

  const filtered = CARAVANS.filter((c) => !search || c.title.includes(search) || c.location.includes(search));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>استكشف الكرفانات</Text>
        <TextInput
          style={styles.search}
          placeholder="ابحث بالاسم أو المدينة..."
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/caravan/${item.id}`)}>
            <View style={styles.cardImage}>
              <Text style={{ fontSize: 36 }}>🏕️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.type} • 📍 {item.location}</Text>
              <Text style={styles.cardMeta}>👥 {item.sleeps} أشخاص • ⭐ {item.rating}</Text>
              <Text style={styles.cardPrice}>{item.price} ر.س / يوم</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد نتائج</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { padding: spacing.md, paddingTop: 60, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.creamDark },
  title: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.charcoal, textAlign: 'right', marginBottom: spacing.sm },
  search: { backgroundColor: colors.cream, borderRadius: 12, padding: spacing.sm, fontSize: fontSizes.md, borderWidth: 1, borderColor: colors.creamDark },
  list: { padding: spacing.md, gap: spacing.sm },
  card: { flexDirection: 'row-reverse', backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.creamDark },
  cardImage: { width: 100, backgroundColor: colors.sandLight, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, padding: spacing.sm },
  cardTitle: { fontSize: fontSizes.md, fontWeight: '600', color: colors.charcoal, textAlign: 'right' },
  cardMeta: { fontSize: fontSizes.xs, color: colors.charcoalLight, textAlign: 'right', marginTop: 2 },
  cardPrice: { fontSize: fontSizes.md, fontWeight: '700', color: colors.olive, textAlign: 'right', marginTop: spacing.xs },
  empty: { textAlign: 'center', color: colors.charcoalLight, fontSize: fontSizes.md, marginTop: spacing.xl },
});

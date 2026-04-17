import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Modal, 
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import FragranceCard from '../components/FragranceCard';
import { 
  getStoredFragrances, 
  getStoredBrands, 
  getStoredAccords, 
  getStoredNotes 
} from '../services/fragranceService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - SPACING.lg * 3) / 2;

type RootStackParamList = {
  ShopTab: { category?: string } | undefined;
  ProductDetails: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ShopTab'>;

const ShopScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  
  const [fragrances, setFragrances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(route.params?.category || '');
  const [brand, setBrand] = useState('');
  const [accord, setAccord] = useState('');
  const [note, setNote] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Filter Data
  const [brands, setBrands] = useState<string[]>([]);
  const [accords, setAccords] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    fetchFragrances();
  }, [page, keyword, category, brand, accord, note, minPrice, maxPrice]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  useEffect(() => {
    if (route.params?.category) {
      setCategory(route.params.category);
      setPage(1);
    }
  }, [route.params?.category]);

  const fetchFragrances = async () => {
    setLoading(true);
    try {
      const { data } = await getStoredFragrances({
        page,
        limit: 10,
        keyword,
        category,
        brand,
        accord,
        note,
        minPrice,
        maxPrice,
      });
      setFragrances(data.fragrances);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Failed to fetch fragrances', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      const [brandsRes, accordsRes, notesRes] = await Promise.all([
        getStoredBrands(),
        getStoredAccords(),
        getStoredNotes()
      ]);
      setBrands(brandsRes.data);
      setAccords(accordsRes.data);
      setNotes(notesRes.data);
    } catch (err) {
      console.error('Failed to fetch filter data', err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchFragrances();
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setBrand('');
    setAccord('');
    setNote('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setIsFilterVisible(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>The <Text style={styles.italic}>Collection</Text></Text>
      
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={18} color="rgba(255,255,255,0.4)" />
          <TextInput
            placeholder="Search masteries..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.searchInput}
            value={keyword}
            onChangeText={(text) => {
              setKeyword(text);
              setPage(1);
            }}
          />
          {keyword !== '' && (
            <TouchableOpacity onPress={() => setKeyword('')}>
              <X size={16} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.filterBtn, isFilterVisible && styles.filterBtnActive]}
          onPress={() => setIsFilterVisible(true)}
        >
          <SlidersHorizontal size={20} color={isFilterVisible ? COLORS.black : COLORS.white} />
        </TouchableOpacity>
      </View>

      {category !== '' && (
        <View style={styles.activeFilterRow}>
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>{category}</Text>
            <TouchableOpacity onPress={() => setCategory('')}>
              <X size={12} color={COLORS.accentGold} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Sparkles size={48} color="rgba(255,255,255,0.1)" />
      <Text style={styles.emptyTitle}>Uncharted Scent</Text>
      <Text style={styles.emptySubtitle}>We couldn't find a fragrance matching your specific Discovery Profile.</Text>
      <TouchableOpacity style={styles.resetBtn} onPress={clearFilters}>
        <Text style={styles.resetBtnText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={fragrances}
        keyExtractor={(item) => item._id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <FragranceCard 
              fragrance={item} 
              onPress={() => navigation.navigate('ProductDetails', { id: item._id })} 
            />
          </View>
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />

      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingTop: insets.top }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Discovery Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <X size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Category */}
              <Text style={styles.filterLabel}>Olfactory Category</Text>
              <View style={styles.filterGrid}>
                {['Men', 'Women', 'Unisex'].map((cat) => (
                  <TouchableOpacity 
                    key={cat}
                    style={[styles.optionBtn, category === cat && styles.optionBtnActive]}
                    onPress={() => setCategory(category === cat ? '' : cat)}
                  >
                    <Text style={[styles.optionText, category === cat && styles.optionTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Brands */}
              <Text style={styles.filterLabel}>The Houses (Brands)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {brands.map((b) => (
                  <TouchableOpacity 
                    key={b}
                    style={[styles.optionBtn, brand === b && styles.optionBtnActive, { marginRight: 10 }]}
                    onPress={() => setBrand(brand === b ? '' : b)}
                  >
                    <Text style={[styles.optionText, brand === b && styles.optionTextActive]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Accords */}
              <Text style={styles.filterLabel}>Main Character (Accords)</Text>
              <View style={styles.filterGrid}>
                {accords.slice(0, 12).map((a) => (
                  <TouchableOpacity 
                    key={a}
                    style={[styles.optionBtn, accord === a && styles.optionBtnActive]}
                    onPress={() => setAccord(accord === a ? '' : a)}
                  >
                    <Text style={[styles.optionText, accord === a && styles.optionTextActive]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text style={styles.filterLabel}>Key Notes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {notes.slice(0, 20).map((n) => (
                  <TouchableOpacity 
                    key={n}
                    style={[styles.optionBtn, note === n && styles.optionBtnActive, { marginRight: 10 }]}
                    onPress={() => setNote(note === n ? '' : n)}
                  >
                    <Text style={[styles.optionText, note === n && styles.optionTextActive]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Price Range */}
              <Text style={styles.filterLabel}>Price Range ($)</Text>
              <View style={styles.priceRow}>
                <TextInput 
                  placeholder="Min"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={styles.priceInput}
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
                <View style={styles.priceDash} />
                <TextInput 
                  placeholder="Max"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={styles.priceInput}
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>

              <View style={{ height: 100 }} />
            </ScrollView>

            <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 20 }]}>
              <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                <Text style={styles.clearBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setIsFilterVisible(false)}>
                <Text style={styles.applyBtnText}>Apply Discovery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingVertical: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 42,
    marginBottom: SPACING.xl,
  },
  italic: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.5)',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    height: 56,
    paddingHorizontal: SPACING.md,
    gap: 10,
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  filterBtn: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  filterBtnActive: {
    backgroundColor: COLORS.white,
  },
  activeFilterRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  activeFilterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  activeFilterText: {
    color: COLORS.accentGold,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: COLUMN_WIDTH,
    marginBottom: SPACING.xl,
  },
  emptyContainer: {
    padding: SPACING.xxl,
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  emptyTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 24,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  resetBtn: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentGold,
    paddingBottom: 4,
  },
  resetBtnText: {
    color: COLORS.accentGold,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 24,
  },
  modalScroll: {
    flex: 1,
    padding: SPACING.xl,
  },
  filterLabel: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  optionBtnActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  optionText: {
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 12,
  },
  optionTextActive: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    color: COLORS.white,
    fontFamily: FONTS.body,
  },
  priceDash: {
    width: 10,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SPACING.xl,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  clearBtn: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  clearBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  applyBtn: {
    flex: 2,
    height: 56,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
});

export default ShopScreen;

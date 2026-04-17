import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Search, Compass, Sparkles, ChevronRight } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { getStoredFragrances } from '../services/fragranceService';
import { getImageUrl } from '../services/api';

const { width } = Dimensions.get('window');

const ExplorerScreen = ({ navigation }: any) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setKeyword(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        const { data } = await getStoredFragrances({ keyword: text, limit: 10 });
        setResults(data.fragrances);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
    >
      <Image source={{ uri: getImageUrl(item.image) }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category} • ${item.price}</Text>
      </View>
      <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discovery <Text style={styles.italic}>Terminal</Text></Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.accentGold} />
          <TextInput 
            placeholder="Search by note, brand, or essence..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            style={styles.searchInput}
            value={keyword}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>

      {results?.length > 0 ? (
        <FlatList 
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Compass size={60} color="rgba(255,255,255,0.02)" />
          <Text style={styles.emptyTitle}>Enter Your Scent Query</Text>
          <Text style={styles.emptySubtitle}>Our neural database will find your perfect match.</Text>
          
          <View style={styles.suggestions}>
            {['Oud', 'Citrus', 'Tom Ford', 'Vanilla'].map(s => (
              <TouchableOpacity key={s} onPress={() => handleSearch(s)} style={styles.suggestionBtn}>
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: { padding: SPACING.lg, paddingTop: SPACING.xl },
  title: { color: COLORS.white, fontFamily: FONTS.display, fontSize: 32, marginBottom: 25 },
  italic: { fontStyle: 'italic', color: 'rgba(255,255,255,0.3)' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 60,
    paddingHorizontal: 20,
    gap: 15,
  },
  searchInput: { flex: 1, color: COLORS.white, fontFamily: FONTS.body, fontSize: 16 },
  list: { padding: SPACING.lg },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 15,
    marginBottom: 10,
    gap: 15,
  },
  itemImage: { width: 50, height: 50, resizeMode: 'contain' },
  itemInfo: { flex: 1 },
  itemBrand: { color: COLORS.accentGold, fontFamily: FONTS.luxury, fontSize: 8, textTransform: 'uppercase', letterSpacing: 2 },
  itemName: { color: COLORS.white, fontFamily: FONTS.display, fontSize: 16 },
  itemCategory: { color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: 10, marginTop: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { color: COLORS.white, fontFamily: FONTS.display, fontSize: 22, marginTop: 20 },
  emptySubtitle: { color: COLORS.textMuted, textAlign: 'center', fontSize: 14, marginTop: 8 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 30 },
  suggestionBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  suggestionText: { color: COLORS.accentGold, fontSize: 10, textTransform: 'uppercase', fontFamily: FONTS.bodyBold }
});

export default ExplorerScreen;

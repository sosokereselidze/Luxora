import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ImageBackground, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  FlatList,
  Animated,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { MoveRight, Star } from 'lucide-react-native';
import FragranceCard from '../components/FragranceCard';
import CategoryBanner from '../components/CategoryBanner';
import { getStoredFragrances } from '../services/fragranceService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  HomeTab: undefined;
  ShopTab: { category?: string } | undefined;
  ProductDetails: { id: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeTab'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchFeatured();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const fetchFeatured = async () => {
    try {
      const response = await getStoredFragrances({ sort: 'bestsellers', limit: 8 });
      if (response.data && response.data.fragrances) {
        setFeaturedProducts(response.data.fragrances);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.bgDark }]}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[]}>
        {/* Hero Section */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80' }}
            style={[styles.hero, { height: height * 0.75 }]}
          >
            <LinearGradient
              colors={['rgba(5,5,8,0.3)', 'rgba(5,5,8,0.1)', 'rgba(5,5,8,0.9)', COLORS.bgDark]}
              style={styles.gradient}
            >
              <View style={[styles.heroContent, { paddingBottom: insets.bottom + SPACING.xl }]}>
                <Text style={styles.heroSubtitle}>Luxora Fragrances</Text>
                <Text style={styles.heroTitle}>THE ART OF{'\n'}<Text style={styles.italic}>MEMORY</Text></Text>
                <Text style={styles.heroDescription}>
                  Step into a world of rare botanicals and masterfully crafted signatures.
                </Text>
                
                <TouchableOpacity 
                  style={styles.heroButton}
                  onPress={() => navigation.navigate('ShopTab')}
                >
                  <Text style={styles.heroButtonText}>Explore Shop</Text>
                  <MoveRight color={COLORS.black} size={16} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        {/* Philosophy Section */}
        <View style={styles.philosophySection}>
          <Text style={styles.sectionTag}>Legacy of Scent</Text>
          <Text style={styles.philosophyText}>
            "We believe that a fragrance is more than a scent; it's a silent language, a moment suspended in time."
          </Text>
          <View style={styles.divider} />
        </View>

        {/* Featured Collections */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Featured <Text style={styles.italicGold}>Collections</Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate('ShopTab')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.accentGold} style={{ marginVertical: SPACING.xl }} />
        ) : (
          <FlatList
            data={featuredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl }}
            renderItem={({ item }) => (
              <FragranceCard 
                fragrance={item} 
                onPress={() => navigation.navigate('ProductDetails', { id: item._id })} 
              />
            )}
          />
        )}

        {/* Experience Section */}
        <View style={styles.experienceSection}>
          <View style={styles.experienceImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80' }} 
              style={styles.experienceImage}
            />
            <View style={styles.experienceOverlay} />
          </View>
          <View style={styles.experienceContent}>
            <Text style={styles.sectionTag}>The Craftsmanship</Text>
            <Text style={styles.experienceTitle}>Masterfully{'\n'}<Text style={styles.whiteItalic}>Blended</Text></Text>
            <Text style={styles.experienceDescription}>
              Every bottle of Luxora is a result of years of research, using only the rarest ingredients sourced from across the globe.
            </Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>150+</Text>
                <Text style={styles.statLabel}>Rare Botanicals</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>48h</Text>
                <Text style={styles.statLabel}>Sillage</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Categories Banner */}
        <View style={styles.categoriesSection}>
          <Text style={styles.catSectionTitle}>Find Your Signature</Text>
          <View style={[styles.divider, { alignSelf: 'center', marginBottom: SPACING.xl }]} />
          
          <CategoryBanner 
            name="Pour Homme" 
            image="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80" 
            onPress={() => navigation.navigate('ShopTab', { category: 'Men' })}
          />
          <CategoryBanner 
            name="Pour Femme" 
            image="https://images.unsplash.com/photo-1583467875263-d50dec37a88c?auto=format&fit=crop&q=80" 
            onPress={() => navigation.navigate('ShopTab', { category: 'Women' })}
          />
          <CategoryBanner 
            name="L'Universel" 
            image="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80" 
            onPress={() => navigation.navigate('ShopTab', { category: 'Unisex' })}
          />
        </View>

        {/* Newsletter Section */}
        <LinearGradient colors={[COLORS.bgSurface, COLORS.bgDark]} style={styles.newsletterSection}>
          <Text style={styles.sectionTag}>The Inner Circle</Text>
          <Text style={styles.newsletterTitle}>Join the Luxora Society</Text>
          <Text style={styles.newsletterSub}>Subscribe for exclusive access to limited editions and private events.</Text>
          
          <View style={styles.inputContainer}>
            <TextInput 
              placeholder="Your email address" 
              placeholderTextColor="rgba(255,255,255,0.3)"
              style={styles.input}
            />
            <TouchableOpacity style={styles.subscribeBtn}>
              <Text style={styles.subscribeBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ height: 100, backgroundColor: COLORS.bgDark }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  heroContent: {
    marginBottom: SPACING.md,
  },
  heroSubtitle: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: SPACING.sm,
  },
  heroTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 48,
    lineHeight: 52,
    marginBottom: SPACING.md,
  },
  italic: {
    fontStyle: 'italic',
    fontWeight: '300',
    color: 'rgba(255,255,255,0.8)',
  },
  heroDescription: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 24,
    marginBottom: SPACING.xl,
    maxWidth: '85%',
  },
  heroButton: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignSelf: 'flex-start',
    gap: 12,
  },
  heroButtonText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  philosophySection: {
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
  },
  sectionTag: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 5,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  philosophyText: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONTS.display,
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 36,
    fontWeight: '300',
    paddingHorizontal: SPACING.md,
  },
  divider: {
    width: 30,
    height: 1,
    backgroundColor: COLORS.accentGold,
    marginTop: SPACING.xxl,
    opacity: 0.4,
  },
  sectionTitleContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: COLORS.bgDark,
  },
  sectionTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 32,
  },
  italicGold: {
    color: COLORS.accentGold,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  viewAll: {
    color: COLORS.accentGold,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingBottom: 4,
  },
  experienceSection: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    marginVertical: SPACING.xl,
  },
  experienceImageContainer: {
    width: width,
    height: height * 0.5,
  },
  experienceImage: {
    width: '100%',
    height: '100%',
  },
  experienceOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,5,8,0.4)',
  },
  experienceContent: {
    padding: SPACING.xl,
  },
  experienceTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 42,
    lineHeight: 46,
    marginBottom: SPACING.lg,
  },
  whiteItalic: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.5)',
  },
  experienceDescription: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 26,
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.xxl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 28,
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyBold,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  categoriesSection: {
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.bgDark,
  },
  catSectionTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  newsletterSection: {
    margin: SPACING.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  newsletterTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  newsletterSub: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 56,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: SPACING.lg,
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  subscribeBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeBtnText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default HomeScreen;

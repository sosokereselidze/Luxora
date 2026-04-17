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
  StatusBar,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { ArrowRight, Sparkles, Star, Zap, Droplets } from 'lucide-react-native';
import FragranceCard from '../components/FragranceCard';
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
  
  // Animation scroll value
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchFeatured();
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

  // Header Parallax Interpolations
  const headerHeight = height * 0.65;
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight / 3],
    extrapolate: 'clamp',
  });
  
  const headerScale = scrollY.interpolate({
    inputRange: [-headerHeight, 0],
    outputRange: [1.3, 1],
    extrapolate: 'clamp',
  });

  const StatsCard = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
    <View style={styles.statsCard}>
      <View style={styles.statsIconCircle}>
        <Icon size={16} color={COLORS.accentGold} />
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Animated Hero Header */}
        <Animated.View style={[styles.heroContainer, { height: headerHeight, transform: [{ translateY: headerTranslate }, { scale: headerScale }] }]}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80' }}
            style={styles.heroImage}
          >
            <LinearGradient
              colors={['transparent', 'rgba(10,10,18,0.4)', COLORS.bgDark]}
              style={styles.heroGradient}
            >
              <View style={[styles.heroContent, { paddingBottom: SPACING.xxl }]}>
                <View style={styles.exclusiveBadge}>
                  <Sparkles size={10} color={COLORS.accentGold} />
                  <Text style={styles.exclusiveText}>PRIVATE COLLECTION</Text>
                </View>
                
                <Text style={styles.heroTitle}>AROMA{'\n'}<Text style={styles.heroTitleAccent}>OF DESTINY</Text></Text>
                
                <TouchableOpacity 
                  style={styles.discoveryBtn}
                  onPress={() => navigation.navigate('ShopTab')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.discoveryBtnText}>Discover Masteries</Text>
                  <View style={styles.btnIconCircle}>
                    <ArrowRight size={14} color={COLORS.black} />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Introductory Section */}
          <View style={styles.introSection}>
            <Text style={styles.introSubtitle}>Unveiling Excellence</Text>
            <Text style={styles.introTitle}>The Society of Scents</Text>
            <Text style={styles.introBody}>
              Every Luxora fragrance is a distillation of life's most profound moments, 
              captured in a crystal vessel.
            </Text>
          </View>

          {/* Stats Grid - "Olfactory Pulse" */}
          <View style={styles.statsGrid}>
            <StatsCard icon={Zap} value="48H" label="Enduring Sillage" />
            <StatsCard icon={Droplets} value="100%" label="Pure Essence" />
            <StatsCard icon={Star} value="VIP" label="Access Only" />
          </View>

          {/* Featured Rows */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Curated <Text style={styles.accentText}>Picks</Text></Text>
              <View style={styles.goldBar} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ShopTab')}>
              <Text style={styles.viewAllText}>View Boutique</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.accentGold} style={{ marginVertical: 60 }} />
          ) : (
            <FlatList
              data={featuredProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={width * 0.65 + SPACING.lg}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <View style={styles.cardItemWrapper}>
                  <FragranceCard 
                    fragrance={item} 
                    onPress={() => navigation.navigate('ProductDetails', { id: item._id })} 
                  />
                </View>
              )}
            />
          )}

          {/* New Interactive Categories Section */}
          <View style={styles.categoriesSection}>
            <Text style={styles.catLabel}>DISCOVERY TILES</Text>
            <View style={styles.tilesContainer}>
              <TouchableOpacity 
                style={[styles.tile, { backgroundColor: '#1A1A2E' }]}
                onPress={() => navigation.navigate('ShopTab', { category: 'Men' })}
              >
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80' }}
                  style={styles.tileImg}
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.tileOverlay}>
                  <Text style={styles.tileTitle}>MASCULINE</Text>
                  <Text style={styles.tileSub}>Power & Grace</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tile, { backgroundColor: '#2E1A1A' }]}
                onPress={() => navigation.navigate('ShopTab', { category: 'Women' })}
              >
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80' }}
                  style={styles.tileImg}
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.tileOverlay}>
                  <Text style={styles.tileTitle}>FEMININE</Text>
                  <Text style={styles.tileSub}>Charisma & Light</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  heroContainer: {
    width: width,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: SPACING.xl,
  },
  heroContent: {
    width: '100%',
  },
  exclusiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  exclusiveText: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 9,
    letterSpacing: 2,
  },
  heroTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 52,
    lineHeight: 56,
    marginBottom: SPACING.xl,
  },
  heroTitleAccent: {
    color: COLORS.accentGold,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  discoveryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingLeft: 24,
    paddingRight: 8,
    height: 54,
    borderRadius: 27,
    alignSelf: 'flex-start',
    gap: 15,
  },
  discoveryBtnText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  btnIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    backgroundColor: COLORS.bgDark,
    marginTop: -30, // Overlap effect
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: SPACING.xl,
  },
  introSection: {
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    marginBottom: 40,
  },
  introSubtitle: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 10,
  },
  introTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 15,
  },
  introBody: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    marginBottom: 60,
  },
  statsCard: {
    width: (width - SPACING.xl * 2 - 24) / 3,
    backgroundColor: COLORS.bgSurface,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  statsIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(201, 169, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsValue: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 16,
  },
  statsLabel: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyBold,
    fontSize: 7,
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 1,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  sectionTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 30,
  },
  accentText: {
    color: COLORS.accentGold,
    fontStyle: 'italic',
  },
  goldBar: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.accentGold,
    marginTop: 8,
  },
  viewAllText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingBottom: 4,
  },
  horizontalList: {
    paddingLeft: SPACING.xl,
    paddingRight: SPACING.lg,
  },
  cardItemWrapper: {
    width: width * 0.65,
    marginRight: SPACING.lg,
  },
  categoriesSection: {
    marginTop: 60,
    paddingHorizontal: SPACING.xl,
  },
  catLabel: {
    color: COLORS.textMuted,
    fontFamily: FONTS.luxury,
    fontSize: 9,
    letterSpacing: 4,
    marginBottom: 25,
    textAlign: 'center',
  },
  tilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  tile: {
    flex: 1,
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tileImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.6,
  },
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 20,
  },
  tileTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 16,
    letterSpacing: 2,
    marginBottom: 4,
  },
  tileSub: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 9,
    letterSpacing: 1,
    opacity: 0.8,
  },
});

export default HomeScreen;

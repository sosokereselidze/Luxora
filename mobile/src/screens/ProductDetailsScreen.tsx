import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  TextInput
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Clock,
  Plus,
  Minus,
  Heart
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { getImageUrl } from '../services/api';
import { getProduct, createReview } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { toast } from 'react-hot-toast'; // I'll assume toast is available or I'll handle errors gracefully
import { Alert } from 'react-native';


const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  MainTabs: undefined;
  ProductDetails: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);


  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Use unified getProduct from productService which handles both MongoIDs and external IDs
      const { data } = await getProduct(id);
      setProduct({
        ...data,
        topNotes: data.topNotes || [],
        middleNotes: data.middleNotes || [],
        baseNotes: data.baseNotes || [],
        accords: data.accords || [],
        reviews: data.reviews || [],
        _id: data._id || data.id // Map external id to _id
      });

    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to share your impression.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Profile' as any) }
      ]);
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Incomplete', 'Please provide a commentary for your testimonial.');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await createReview(id, {
        rating,
        comment,
        productInfo: product // Pass product info for auto-creation if needed
      });

      Alert.alert('Success', 'Your testimonial has been posted.');
      setComment('');
      setRating(5);
      
      // Refresh product data
      const targetId = response.data.productId || id;
      const { data } = await getProduct(targetId);
      setProduct(data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to post review');
    } finally {
      setSubmittingReview(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={COLORS.accentGold} size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Return to Collection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* Header Visual */}
        <View style={styles.imageHeader}>
          <Image
            source={{ uri: getImageUrl(product.image) }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['rgba(5,5,8,0.4)', 'transparent', COLORS.bgDark]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Top Actions */}
          <SafeAreaView style={[styles.topActions, { top: insets.top }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
              <ChevronLeft color={COLORS.white} size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.circleBtn}>
              <Heart color={isFavorite ? '#ff4d4d' : COLORS.white} size={20} fill={isFavorite ? '#ff4d4d' : 'transparent'} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand || 'LUXORA'}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} color={s <= Math.floor(product.rating || 5) ? COLORS.accentGold : 'rgba(255,255,255,0.1)'} fill={s <= Math.floor(product.rating || 5) ? COLORS.accentGold : 'transparent'} />
              ))}
            </View>
            <Text style={styles.ratingText}>{product.rating || '5.0'} / 5.0</Text>
            <View style={styles.dot} />
            <Text style={styles.reviewCount}>{product.numReviews || 0} Reviews</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            <View style={styles.volumeBadge}>
              <Text style={styles.volumeText}>{product.volume || '100ML'}</Text>
            </View>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {/* Accords Section */}
          {product.accords?.length > 0 && (
            <View style={styles.accordsSection}>
              <Text style={styles.sectionTitle}>Olfactory <Text style={styles.italicGold}>Accords</Text></Text>
              <View style={styles.accordsGrid}>
                {product.accords.map((accord: string, i: number) => (
                  <View key={i} style={styles.accordBadge}>
                    <Text style={styles.accordText}>{accord}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Fragrance <Text style={styles.italicGold}>Profile</Text></Text>

            {/* Top Notes */}
            <View style={styles.noteGroup}>
              <View style={styles.noteHeader}>
                <View style={[styles.noteDot, { backgroundColor: COLORS.accentGold }]} />
                <Text style={styles.noteTitle}>Top Notes</Text>
              </View>
              <Text style={styles.noteList}>
                {product.topNotes?.join(', ') || 'No top notes recorded.'}
              </Text>
            </View>

            {/* Middle Notes */}
            <View style={styles.noteGroup}>
              <View style={styles.noteHeader}>
                <View style={[styles.noteDot, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.noteTitle}>Heart Notes</Text>
              </View>
              <Text style={styles.noteList}>
                {product.middleNotes?.join(', ') || 'No heart notes recorded.'}
              </Text>
            </View>

            {/* Base Notes */}
            <View style={styles.noteGroup}>
              <View style={styles.noteHeader}>
                <View style={[styles.noteDot, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                <Text style={styles.noteTitle}>Base Notes</Text>
              </View>
              <Text style={styles.noteList}>
                {product.baseNotes?.join(', ') || 'No base notes recorded.'}
              </Text>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            <View style={styles.featureBox}>
              <ShieldCheck color={COLORS.accentGold} size={20} />
              <Text style={styles.featureTitle}>Authentic</Text>
              <Text style={styles.featureSub}>100% Genuine</Text>
            </View>
            <View style={styles.featureBox}>
              <Truck color={COLORS.accentGold} size={20} />
              <Text style={styles.featureTitle}>Shipping</Text>
              <Text style={styles.featureSub}>Complimentary</Text>
            </View>
            <View style={styles.featureBox}>
              <Clock color={COLORS.accentGold} size={20} />
              <Text style={styles.featureTitle}>Lasting</Text>
              <Text style={styles.featureSub}>8h+ Projection</Text>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Audience <Text style={styles.italicGold}>Feedback</Text></Text>
            
            <View style={styles.reviewList}>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev: any, i: number) => (
                  <View key={rev._id || i} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View>
                        <Text style={styles.reviewerName}>{rev.name}</Text>
                        <Text style={styles.reviewDate}>{new Date(rev.createdAt).toLocaleDateString()}</Text>
                      </View>
                      <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} color={s <= rev.rating ? COLORS.accentGold : 'rgba(255,255,255,0.1)'} fill={s <= rev.rating ? COLORS.accentGold : 'transparent'} />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>"{rev.comment}"</Text>
                  </View>
                ))
              ) : (
                <View style={styles.noReviews}>
                  <Text style={styles.noReviewsText}>No testimonials yet for this masterpiece.</Text>
                </View>
              )}
            </View>

            {/* Add Review Form */}
            <View style={styles.reviewForm}>
              <Text style={styles.formTitle}>Share Your <Text style={styles.italicGold}>Impression</Text></Text>
              
              <View style={styles.ratingPicker}>
                <Text style={styles.pickerLabel}>Select Rating</Text>
                <View style={styles.pickerStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <TouchableOpacity key={s} onPress={() => setRating(s)}>
                      <Star size={24} color={s <= rating ? COLORS.accentGold : 'rgba(255,255,255,0.1)'} fill={s <= rating ? COLORS.accentGold : 'transparent'} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.pickerLabel}>Your Commentary</Text>
                <TextInput
                  style={styles.commentInput}
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Describe the olfactory journey..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity 
                style={[styles.postBtn, submittingReview && { opacity: 0.5 }]} 
                onPress={handleReviewSubmit}
                disabled={submittingReview}
              >
                <Text style={styles.postBtnText}>{submittingReview ? 'Posting...' : 'Post Testimonial'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qBtn}>
            <Minus size={16} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.qText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={styles.qBtn}>
            <Plus size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToBagBtn}
          onPress={() => {
            addToCart(product, product.volume || '100ml', product.price);
            // In a real app we'd show a toast here
          }}
        >
          <ShoppingBag size={18} color={COLORS.black} />
          <Text style={styles.addToBagText}>Add to Bag</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHeader: {
    width: width,
    height: height * 0.55,
    backgroundColor: 'rgba(255,255,255,0.01)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '80%',
    height: '80%',
  },
  topActions: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropBlur: 10,
  },
  content: {
    padding: SPACING.lg,
  },
  brand: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: SPACING.sm,
  },
  name: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 34,
    lineHeight: 38,
    marginBottom: SPACING.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginRight: 10,
  },
  ratingText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 10,
  },
  reviewCount: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    gap: 15,
  },
  price: {
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 26,
    fontWeight: '300',
  },
  volumeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  volumeText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    letterSpacing: 1,
  },
  description: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 26,
    fontWeight: '300',
    marginBottom: SPACING.xxl,
  },
  accordsSection: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 22,
    marginBottom: SPACING.xl,
  },
  italicGold: {
    color: COLORS.accentGold,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  accordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  accordBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  accordText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  notesSection: {
    marginBottom: SPACING.xxl,
  },
  noteGroup: {
    marginBottom: SPACING.lg,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  noteTitle: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  noteList: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: FONTS.body,
    fontSize: 14,
    marginLeft: 16,
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: SPACING.lg,
  },
  featureBox: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  featureTitle: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featureSub: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 8,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    padding: SPACING.lg,
    flexDirection: 'row',
    gap: 15,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 56,
    paddingHorizontal: 15,
    gap: 15,
  },
  qBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  addToBagBtn: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  addToBagText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  errorText: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 24,
    marginBottom: SPACING.xl,
  },
  backBtn: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentGold,
    paddingBottom: 4,
  },
  backBtnText: {
    color: COLORS.accentGold,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  reviewsSection: {
    marginTop: SPACING.xxl,
    paddingTop: SPACING.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  reviewList: {
    marginBottom: SPACING.xxl,
  },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  reviewerName: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reviewDate: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 9,
    marginTop: 2,
  },
  reviewComment: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONTS.body,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  noReviews: {
    paddingVertical: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  noReviewsText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reviewForm: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: SPACING.xl,
  },
  formTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 20,
    marginBottom: SPACING.xl,
  },
  ratingPicker: {
    marginBottom: SPACING.xl,
  },
  pickerLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  pickerStars: {
    flexDirection: 'row',
    gap: 15,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  commentInput: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: SPACING.md,
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 14,
    height: 100,
  },
  postBtn: {
    backgroundColor: COLORS.white,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postBtnText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});


export default ProductDetailsScreen;

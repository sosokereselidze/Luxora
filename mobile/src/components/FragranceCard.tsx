import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { ShoppingCart, Star } from 'lucide-react-native';
import { getImageUrl } from '../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;

interface Fragrance {
  _id: string;
  name: string;
  price: number;
  image?: string;
  brand?: string;
  category?: string;
  rating?: number;
}

interface FragranceCardProps {
  fragrance: Fragrance;
  onPress: () => void;
}

const FragranceCard: React.FC<FragranceCardProps> = ({ fragrance, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: getImageUrl(fragrance.image) }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Featured</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>{fragrance.brand || 'LUXORA'}</Text>
          <View style={styles.ratingRow}>
            <Star size={8} color={COLORS.accentGold} fill={COLORS.accentGold} />
            <Text style={styles.ratingText}>{fragrance.rating || '4.9'}</Text>
          </View>
        </View>
        
        <Text style={styles.name} numberOfLines={1}>{fragrance.name}</Text>
        <Text style={styles.category}>{fragrance.category || 'Eau de Parfum'}</Text>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>from</Text>
            <Text style={styles.price}>${fragrance.price}</Text>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <ShoppingCart color={COLORS.black} size={14} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.bgCard,
    marginRight: SPACING.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 0.9,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tagContainer: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(5,5,8,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: COLORS.accentGold,
    fontFamily: FONTS.bodyBold,
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brand: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 9,
    letterSpacing: 2.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: FONTS.body,
    fontSize: 8,
  },
  name: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 20,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  category: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 10,
    marginBottom: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: SPACING.lg,
  },
  priceLabel: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  price: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
  },
  cartButton: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FragranceCard;

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { ShoppingCart, Star, Plus } from 'lucide-react-native';
import { getImageUrl } from '../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;

interface FragranceCardProps {
  fragrance: any;
  onPress: () => void;
}

const FragranceCard: React.FC<FragranceCardProps> = ({ fragrance, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: getImageUrl(fragrance.image) }} 
          style={styles.image} 
          resizeMode="contain"
        />
        <View style={styles.ratingBadge}>
          <Star size={8} color={COLORS.accentGold} fill={COLORS.accentGold} />
          <Text style={styles.ratingText}>{fragrance.rating || '5.0'}</Text>
        </View>
        
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={16} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.brand}>{fragrance.brand || 'LUXORA'}</Text>
        <Text style={styles.name} numberOfLines={1}>{fragrance.name}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>${fragrance.price}</Text>
          <View style={styles.dot} />
          <Text style={styles.volume}>{fragrance.volume || '100ml'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: 12,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '75%',
    height: '75%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
  },
  addBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 4,
  },
  brand: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  name: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  volume: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

export default FragranceCard;

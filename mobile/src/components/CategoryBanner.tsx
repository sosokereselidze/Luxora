import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';

const { width } = Dimensions.get('window');

interface CategoryBannerProps {
  name: string;
  image: string;
  onPress: () => void;
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({ name, image, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.line} />
        <Text style={styles.explore}>Explore</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - SPACING.lg * 2,
    height: 450,
    marginBottom: SPACING.lg,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  name: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 28,
    textTransform: 'uppercase',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  line: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginBottom: SPACING.md,
  },
  explore: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
});

export default CategoryBanner;

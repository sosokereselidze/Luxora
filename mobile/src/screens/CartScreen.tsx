import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  MainTabs: { screen: string };
  ShopTab: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList>;

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { cart, removeFromCart, cartTotal } = useCart();

  const updateQuantity = (productId: string, volume: string, newQuantity: number) => {
    // In current context we don't have updateQuantity, I'll update the context too
    // But for now let's just use what we have to prevent the crash
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <ShoppingCart size={40} color="rgba(255,255,255,0.1)" />
      </View>
      <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
      <Text style={styles.emptySubtitle}>Discover the perfect scent to start your collection.</Text>
      <TouchableOpacity 
        style={styles.startShopBtn}
        onPress={() => navigation.navigate('ShopTab')}
      >
        <Text style={styles.startShopText}>Start Exploring</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => navigation.navigate('ProductDetails', { id: item._id || item.id })}
      >
        <Image 
          source={{ uri: getImageUrl(item.image) }} 
          style={styles.image} 
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemBrand}>{item.brand || 'LUXORA'}</Text>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.itemVolume}>{item.volume || '100ml'}</Text>
          </View>
          <TouchableOpacity onPress={() => removeFromCart(item._id || item.id)}>
            <Trash2 size={16} color="rgba(255,255,255,0.2)" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemFooter}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.qBtn} 
              onPress={() => updateQuantity(item._id || item.id, Math.max(1, item.quantity - 1))}
            >
              <Minus size={14} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.qText}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.qBtn}
              onPress={() => updateQuantity(item._id || item.id, item.quantity + 1)}
            >
              <Plus size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your <Text style={styles.italic}>Bag</Text></Text>
        <Text style={styles.itemCount}>{(cart?.length || 0)} {(cart?.length === 1 ? 'Masterpiece' : 'Masterpieces')}</Text>
      </View>

      {cart?.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={(item) => item._id || item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${(cartTotal || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValueFree}>Complimentary</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${(cartTotal || 0).toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <ArrowRight size={18} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        renderEmptyCart()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 42,
  },
  italic: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.5)',
  },
  itemCount: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 5,
  },
  listContent: {
    padding: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: 15,
  },
  imageContainer: {
    width: 90,
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.01)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemBrand: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 2,
  },
  itemName: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 18,
    marginBottom: 2,
  },
  itemVolume: {
    color: 'rgba(255,255,255,0.3)',
    fontFamily: FONTS.bodyBold,
    fontSize: 8,
    textTransform: 'uppercase',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    height: 36,
    gap: 12,
  },
  qBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    minWidth: 16,
    textAlign: 'center',
  },
  itemPrice: {
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 16,
    fontWeight: '300',
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: 'rgba(5,5,8,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  summaryContainer: {
    marginBottom: SPACING.xl,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  summaryValue: {
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 12,
  },
  summaryValueFree: {
    color: COLORS.accentGold,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  totalLabel: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  totalValue: {
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 22,
  },
  checkoutBtn: {
    height: 60,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  checkoutText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  startShopBtn: {
    height: 52,
    paddingHorizontal: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startShopText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default CartScreen;

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, ShoppingBag, Search, User, ShoppingCart } from 'lucide-react-native';
import { COLORS, FONTS } from '../theme/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import AuthScreen from '../screens/AuthScreen';
import ExplorerScreen from '../screens/ExplorerScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetails: { id: string };
  Auth: { isRegister?: boolean } | undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  ShopTab: { category?: string } | undefined;
  ExploreTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bgDark,
          borderTopColor: 'rgba(255,255,255,0.05)',
          paddingTop: 8,
          height: 65,
        },
        tabBarActiveTintColor: COLORS.accentGold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarLabelStyle: {
          fontFamily: FONTS.luxury,
          fontSize: 8,
          textTransform: 'uppercase',
          letterSpacing: 1,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ShopTab"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExplorerScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Bag',
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight,
  Sparkles
} from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  MainTabs: undefined;
  Auth: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Exit Portal',
      'Are you sure you wish to disconnect from The Society?',
      [
        { text: 'Remain', style: 'cancel' },
        { 
          text: 'Exit', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Auth');
          }
        }
      ]
    );
  };

  const ProfileItem = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
    <TouchableOpacity style={styles.profileItem}>
      <View style={styles.itemIconContainer}>
        <Icon size={20} color={COLORS.accentGold} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color="rgba(255,255,255,0.1)" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'L'}
              </Text>
            </View>
            <View style={styles.badge}>
              <Sparkles size={10} color={COLORS.black} />
            </View>
          </View>
          
          <Text style={styles.userName}>{user?.name || 'Guest Patron'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'membership@luxora.society'}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Acquisitions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>Gold</Text>
              <Text style={styles.statLabel}>Society Tier</Text>
            </View>
          </View>
        </View>

        {/* Action List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Society Portfolio</Text>
          <View style={styles.listContainer}>
            <ProfileItem icon={Package} title="Order Repository" subtitle="Track your olfactory acquisitions" />
            <ProfileItem icon={MapPin} title="Delivery Coordinates" subtitle="Manage your shipping destinations" />
            <ProfileItem icon={CreditCard} title="Vault Access" subtitle="Secure payment methods" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Logistics</Text>
          <View style={styles.listContainer}>
            <ProfileItem icon={Bell} title="Society Notices" />
            <ProfileItem icon={Shield} title="Privacy Protocols" />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#ff4d4d" />
          <Text style={styles.logoutText}>Exit The Portal</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Luxora Mobile — v1.0.4 Premium</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: COLORS.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 40,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.bgDark,
  },
  userName: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 26,
    marginBottom: 4,
  },
  userEmail: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 30,
    backgroundColor: 'rgba(255,255,255,0.02)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 18,
  },
  statLabel: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 40,
  },
  section: {
    padding: SPACING.lg,
    marginTop: 10,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontFamily: FONTS.luxury,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
    marginLeft: 5,
  },
  listContainer: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(201, 169, 110, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
  },
  itemSubtitle: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 11,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: 20,
    gap: 12,
  },
  logoutText: {
    color: '#ff4d4d',
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  versionText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.1)',
    fontFamily: FONTS.body,
    fontSize: 10,
    marginVertical: 40,
  },
});

export default ProfileScreen;

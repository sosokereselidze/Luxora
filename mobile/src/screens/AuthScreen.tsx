import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  MainTabs: undefined;
  Auth: { isRegister?: boolean } | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const AuthScreen: React.FC<Props> = ({ navigation, route }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(route.params?.isRegister || false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Incomplete Credentials', 'Please provide both your identity and access key.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // Registration logic if we had the service method exposed
        // For now we'll focus on login as per the basic mobile requirement
        Alert.alert('Boutique Access', 'Registration is currently handled via Invitation or Web Portal. Please use existing credentials.');
      } else {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigation.navigate('MainTabs');
        } else {
          Alert.alert('Access Denied', result.message || 'The credentials provided do not match our records.');
        }
      }
    } catch (err) {
      Alert.alert('Network Error', 'The Society server is currently unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[COLORS.bgDark, '#0a0a15', COLORS.bgDark]} 
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Decorative Orbs */}
      <View style={[styles.orb, { top: -100, right: -100, backgroundColor: 'rgba(56, 38, 115, 0.15)' }]} />
      <View style={[styles.orb, { bottom: -150, left: -150, backgroundColor: 'rgba(201, 169, 110, 0.05)' }]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Sparkles size={32} color={COLORS.accentGold} />
            </View>
            <Text style={styles.title}>{isRegister ? 'Join The Society' : 'Welcome Back'}</Text>
            <Text style={styles.subtitle}>{isRegister ? 'Begin Your Olfactory Journey' : 'Access Your Private Collection'}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardOverlay} />
            
            <View style={styles.form}>
              {isRegister && (
                <>
                  <View style={styles.inputWrapper}>
                    <UserIcon size={18} color="rgba(255,255,255,0.3)" style={styles.inputIcon} />
                    <TextInput 
                      placeholder="Full Name"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      style={styles.input}
                      value={formData.name}
                      onChangeText={(text) => setFormData({...formData, name: text})}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <UserIcon size={18} color="rgba(255,255,255,0.3)" style={styles.inputIcon} />
                    <TextInput 
                      placeholder="Unique Username"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      style={styles.input}
                      value={formData.username}
                      onChangeText={(text) => setFormData({...formData, username: text})}
                    />
                  </View>
                </>
              )}

              <View style={styles.inputWrapper}>
                <Mail size={18} color="rgba(255,255,255,0.3)" style={styles.inputIcon} />
                <TextInput 
                  placeholder="Email Address"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Lock size={18} color="rgba(255,255,255,0.3)" style={styles.inputIcon} />
                <TextInput 
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={styles.input}
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                />
              </View>

              {isRegister && (
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="rgba(255,255,255,0.3)" style={styles.inputIcon} />
                  <TextInput 
                    placeholder="Confirm Password"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    style={styles.input}
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                  />
                </View>
              )}

              {!isRegister && (
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Lost your key?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.authBtn} 
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.black} />
                ) : (
                  <>
                    <Text style={styles.authBtnText}>{isRegister ? 'Apply For Access' : 'Enter The Portal'}</Text>
                    <ArrowRight size={18} color={COLORS.black} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isRegister ? 'Already a patron?' : 'New to Luxora?'}
            </Text>
            <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
              <Text style={styles.footerLink}>
                {isRegister ? ' Sign In Here' : ' Create an Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.luxury,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    opacity: 0.6,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: SPACING.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  form: {
    gap: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    color: 'rgba(255,255,255,0.3)',
    fontFamily: FONTS.body,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  authBtn: {
    height: 60,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  authBtnText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: FONTS.body,
    fontSize: 12,
  },
  footerLink: {
    color: COLORS.accentGold,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
  },
});

export default AuthScreen;

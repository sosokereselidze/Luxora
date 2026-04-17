import React, { useState, useEffect } from 'react';
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
  Alert,
  Image,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { Shield, ChevronRight, Mail, Lock, User, Sparkles } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const { login, googleLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '779575147339-8d5ek3fhpe5p28deamgis3g2h94skbdo.apps.googleusercontent.com',
    webClientId: '779575147339-8d5ek3fhpe5p28deamgis3g2h94skbdo.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'luxora-clone',
    }),
  });

  useEffect(() => {
    // Reveal the Redirect URI for whitelisting in Google Console
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'luxora-clone',
    });
    console.log('🔗 LUXORA REDIRECT URI:', redirectUri);

    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    const result = await googleLogin(idToken);
    if (!result.success) {
      Alert.alert('Access Denied', result.message);
    }
    setLoading(false);
  };

  const handleAction = async () => {
    if (!email || !password) {
      Alert.alert('Information Missing', 'Please fill all fields to proceed.');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      Alert.alert('Access Denied', result.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.bgSurface} />
        <LinearGradient 
          colors={['transparent', 'rgba(94,68,255,0.15)', 'transparent']} 
          style={styles.ambientGlow} 
        />
        <View style={styles.decorativeOrb1} />
        <View style={styles.decorativeOrb2} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Shield color={COLORS.accentGold} size={40} strokeWidth={1.5} />
            </View>
            <Text style={styles.brandTitle}>LUXORA</Text>
            <Text style={styles.subtitle}>PRIVATE PORTAL</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>
              {isLogin ? 'Enter the Society' : 'Apply for Access'}
            </Text>
            
            {/* Google Social Login */}
            <TouchableOpacity 
              style={styles.googleBtn} 
              disabled={!request || loading}
              onPress={() => promptAsync()}
              activeOpacity={0.8}
            >
              <View style={styles.googleIconCircle}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Log_o.svg' }} style={{ width: 18, height: 18 }} />
              </View>
              <Text style={styles.googleBtnText}>Enter with Google Access</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR SECURE PORTAL</Text>
              <View style={styles.divider} />
            </View>

            {!isLogin && (
              <View style={styles.inputWrapper}>
                <User size={18} color={COLORS.accentGold} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Mail size={18} color={COLORS.accentGold} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Identity (Email or Username)"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={18} color={COLORS.accentGold} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Access Code"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.mainBtn} 
              onPress={handleAction}
              disabled={loading}
            >
              <LinearGradient
                colors={[COLORS.accentGold, '#B8860B']}
                style={styles.btnGradient}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.black} />
                ) : (
                  <>
                    <Text style={styles.btnText}>{isLogin ? 'AUTHENTICATE' : 'APPLY'}</Text>
                    <ChevronRight size={18} color={COLORS.black} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsLogin(!isLogin)}
              style={styles.switchBtn}
            >
              <Text style={styles.switchText}>
                {isLogin ? "Don't have access? " : "Already a member? "}
                <Text style={styles.switchHighlight}>
                  {isLogin ? "Apply Now" : "Authenticate"}
                </Text>
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
  bgSurface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.bgDark,
  },
  ambientGlow: {
    position: 'absolute',
    top: height * 0.2,
    left: -width * 0.5,
    right: -width * 0.5,
    height: height * 0.6,
    opacity: 0.5,
  },
  decorativeOrb1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(94,68,255,0.05)',
  },
  decorativeOrb2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(201, 169, 110, 0.03)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: height * 0.1,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(201, 169, 110, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  brandTitle: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 28,
    letterSpacing: 8,
  },
  subtitle: {
    color: COLORS.accentGold,
    fontFamily: FONTS.luxury,
    fontSize: 10,
    letterSpacing: 4,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: 'rgba(20,20,31,0.6)',
    borderRadius: 30,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  welcomeText: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 56,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 25,
    justifyContent: 'center',
    gap: 15,
  },
  googleIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    gap: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dividerText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyBold,
    fontSize: 8,
    letterSpacing: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputIcon: {
    marginRight: 15,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  mainBtn: {
    height: 56,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 15,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnText: {
    color: COLORS.black,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
  },
  switchBtn: {
    marginTop: 25,
    alignItems: 'center',
  },
  switchText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 13,
  },
  switchHighlight: {
    color: COLORS.accentGold,
    fontFamily: FONTS.bodyBold,
  },
});

export default AuthScreen;

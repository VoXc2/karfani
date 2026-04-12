import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { apiClient, setTokens } from '../../lib/api';
import { colors, spacing, fontSizes } from '../../lib/theme';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await apiClient('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      setStep('otp');
    } catch (e: any) {
      setError(e.message || 'فشل إرسال رمز التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiClient<any>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      await setTokens(result.data.accessToken, result.data.refreshToken);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.logo}>كرفاني</Text>
        <Text style={styles.subtitle}>منصة تأجير الكرفانات الأولى في الخليج</Text>

        {step === 'phone' ? (
          <>
            <Text style={styles.label}>رقم الجوال</Text>
            <TextInput
              style={styles.input}
              placeholder="05XXXXXXXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              textAlign="right"
              maxLength={10}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={loading || phone.length < 10}
            >
              <Text style={styles.buttonText}>{loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>رمز التحقق</Text>
            <TextInput
              style={styles.input}
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              textAlign="center"
              maxLength={6}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyOtp}
              disabled={loading || otp.length < 6}
            >
              <Text style={styles.buttonText}>{loading ? 'جاري التحقق...' : 'تأكيد'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('phone')}>
              <Text style={styles.link}>تغيير رقم الجوال</Text>
            </TouchableOpacity>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  logo: { fontSize: fontSizes.title, fontWeight: '700', color: colors.olive, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { fontSize: fontSizes.md, color: colors.charcoalLight, textAlign: 'center', marginBottom: spacing.xl },
  label: { fontSize: fontSizes.md, fontWeight: '600', color: colors.charcoal, textAlign: 'right' },
  input: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.creamDark, borderRadius: 12, padding: spacing.md, fontSize: fontSizes.lg },
  button: { backgroundColor: colors.olive, borderRadius: 12, padding: spacing.md, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.white, fontSize: fontSizes.lg, fontWeight: '600' },
  link: { color: colors.copper, textAlign: 'center', fontSize: fontSizes.md, marginTop: spacing.sm },
  error: { color: colors.error, textAlign: 'center', fontSize: fontSizes.sm },
});

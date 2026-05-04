// screens/Support.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/config';
import Button from '../components/Button';
import Input from '../components/Input';
import { submitSupportTicket } from '../services/auth';

const FAQ_ITEMS = [
  { q: 'How do I scan a QR code?', a: 'Tap "Scan QR" on the home screen and point your camera at any StepPays or UPI QR code.' },
  { q: 'How long does KYC verification take?', a: 'KYC verification is completed within 24-48 hours on business days.' },
  { q: 'Is my payment data secure?', a: 'Yes! All payments are processed via PayU with 256-bit SSL encryption.' },
  { q: 'How do I view my transaction history?', a: 'Tap "Transaction History" on the home screen to see all your transactions.' },
];

const FAQItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion} numberOfLines={expanded ? undefined : 2}>
          {item.q}
        </Text>
        <Text style={styles.faqChevron}>{expanded ? '−' : '+'}</Text>
      </View>
      {expanded && (
        <Text style={styles.faqAnswer}>{item.a}</Text>
      )}
    </TouchableOpacity>
  );
};

const Support = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!subject.trim()) e.subject = 'Subject is required';
    if (!message.trim() || message.length < 20) e.message = 'Please describe your issue (min. 20 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await submitSupportTicket(subject, message);
      setSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={{ fontSize: 52, marginBottom: 12 }}>🎧</Text>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>
            We're here 24/7. Send a ticket and we'll get back to you soon.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.contactRow}>
          <View style={styles.contactCard}>
            <Text style={{ fontSize: 24, marginBottom: 6 }}>📧</Text>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>support@mhsteppays.com</Text>
          </View>
          <View style={styles.contactCard}>
            <Text style={{ fontSize: 24, marginBottom: 6 }}>🕐</Text>
            <Text style={styles.contactLabel}>Response</Text>
            <Text style={styles.contactValue}>Within 24 hours</Text>
          </View>
        </View>

        {/* Success Banner */}
        {submitted && (
          <View style={styles.successBanner}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>✅</Text>
            <View>
              <Text style={styles.successTitle}>Ticket Submitted!</Text>
              <Text style={styles.successSub}>We'll get back to you within 24 hours.</Text>
            </View>
          </View>
        )}

        {/* Ticket Form */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Submit a Ticket</Text>

          <Input
            label="Subject"
            value={subject}
            onChangeText={(v) => {
              setSubject(v);
              if (errors.subject) setErrors({ ...errors, subject: null });
            }}
            placeholder="e.g. Payment issue, KYC problem..."
            error={errors.subject}
            autoCapitalize="sentences"
          />

          <Input
            label="Message"
            value={message}
            onChangeText={(v) => {
              setMessage(v);
              if (errors.message) setErrors({ ...errors, message: null });
            }}
            placeholder="Describe your issue in detail..."
            multiline
            numberOfLines={5}
            error={errors.message}
            autoCapitalize="sentences"
          />

          <Button
            title={submitted ? 'Submit Another' : 'Send Message'}
            onPress={() => {
              if (submitted) setSubmitted(false);
              else handleSubmit();
            }}
            loading={loading}
            size="lg"
            style={styles.submitBtn}
          />
        </View>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: FONTS.bold,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: SIZES.xxl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  contactCard: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    fontWeight: FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
    textAlign: 'center',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  successTitle: {
    fontSize: SIZES.base,
    fontWeight: FONTS.semiBold,
    color: '#065F46',
  },
  successSub: {
    fontSize: SIZES.sm,
    color: '#059669',
    marginTop: 2,
  },
  formSection: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 20,
  },
  submitBtn: {
    marginTop: 8,
  },
  faqSection: {
    marginBottom: 16,
  },
  faqTitle: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: SIZES.base,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginRight: 12,
  },
  faqChevron: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: FONTS.bold,
    lineHeight: 24,
  },
  faqAnswer: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 12,
    lineHeight: 20,
  },
});

export default Support;

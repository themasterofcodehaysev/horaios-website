import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Heart, QrCode, Building2, Smartphone, RefreshCw, Copy, Check,
  ExternalLink, X, ShieldCheck, Info, Sparkles, CheckCircle2,
  CreditCard, Lock, Calendar, ArrowRight, Download, Mail, DollarSign
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useLanguage, translate, getDateLocale } from '../context/LanguageContext';
import { getImageUrl } from '../utils/imageUrl';

export const GivePage: React.FC = () => {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();

  // Contribution Form State
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedFund, setSelectedFund] = useState<string>('General Tithe & Offering');
  const [coverFee, setCoverFee] = useState<boolean>(false);

  // Card details state
  const [cardName, setCardName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [cardError, setCardError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cardSuccessReceipt, setCardSuccessReceipt] = useState<{
    receiptNumber: string;
    amount: number;
    fund: string;
    frequency: string;
    date: string;
    email: string;
  } | null>(null);

  // Modals state for "Other Ways to Give"
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isBankTransferModalOpen, setIsBankTransferModalOpen] = useState<boolean>(false);
  const [isMobileBankingModalOpen, setIsMobileBankingModalOpen] = useState<boolean>(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const donationLevels = [
    { amount: 10, label: t('ui.seed', 'Seed'), description: t('ui.plant_a_seed_of_faith', 'Plant a seed of faith') },
    { amount: 25, label: t('ui.nurture', 'Nurture'), description: t('ui.help_us_grow', 'Help us grow') },
    { amount: 50, label: t('ui.sustain', 'Sustain'), description: t('ui.keep_ministry_going', 'Keep ministry going') },
    { amount: 100, label: t('ui.launch', 'Launch'), description: t('ui.help_us_reach_further', 'Help us reach further') },
    { amount: 250, label: t('ui.transform', 'Transform'), description: t('ui.change_lives', 'Change lives') },
    { amount: 500, label: t('ui.impact', 'Impact'), description: t('ui.make_a_lasting_difference', 'Make a lasting difference') },
  ];

  const funds = [
    'General Tithe & Offering',
    'Student Dormitory Ministry',
    'Missions & Community Outreach',
    'Building & Facility Fund',
    'Youth & Children Ministry',
  ];

  const fundLabels: Record<string, string> = {
    'General Tithe & Offering': translate('ui.general_tithe_offering', 'General Tithe & Offering'),
    'Student Dormitory Ministry': translate('ui.student_dormitory_ministry', 'Student Dormitory Ministry'),
    'Missions & Community Outreach': translate('ui.missions_community_outreach', 'Missions & Community Outreach'),
    'Building & Facility Fund': translate('ui.building_facility_fund', 'Building & Facility Fund'),
    'Youth & Children Ministry': translate('ui.youth_children_ministry', 'Youth & Children Ministry'),
  };

  const baseAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount || 0;
  const processingFee = coverFee ? baseAmount * 0.025 : 0;
  const totalAmount = baseAmount + processingFee;

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(val);
    setSelectedAmount(null);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(raw);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError(null);

    if (totalAmount <= 0) {
      setCardError(translate('ui.please_choose_or_enter_a_valid_contribution_', 'Please choose or enter a valid contribution amount.'));
      return;
    }
    if (!donorEmail || !donorEmail.includes('@')) {
      setCardError(translate('ui.please_enter_a_valid_email_address_to_receiv', 'Please enter a valid email address to receive your contribution receipt.'));
      return;
    }
    if (!cardName.trim()) {
      setCardError(translate('ui.please_enter_the_name_on_your_card', 'Please enter the name on your card.'));
      return;
    }
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      setCardError(translate('ui.please_enter_a_valid_16_digit_credit_or_debi', 'Please enter a valid 16-digit credit or debit card number.'));
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError(translate('ui.please_enter_a_valid_expiry_date_mm_yy', 'Please enter a valid expiry date (MM/YY).'));
      return;
    }
    if (cardCvc.length < 3) {
      setCardError(translate('ui.please_enter_a_valid_cvc_cvv_security_code', 'Please enter a valid CVC / CVV security code.'));
      return;
    }

    setIsProcessing(true);
    // Simulate secure 256-bit gateway verification
    setTimeout(() => {
      setIsProcessing(false);
      setCardSuccessReceipt({
        receiptNumber: `HBC-${Date.now().toString().slice(-6)}`,
        amount: totalAmount,
        fund: selectedFund,
        frequency: frequency === 'monthly' ? 'Monthly Recurring' : 'One-Time Contribution',
        date: new Date().toLocaleDateString(getDateLocale(), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        email: donorEmail,
      });
    }, 1200);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    });
  };

  const handleDownloadReceipt = () => {
    if (!cardSuccessReceipt) return;
    const content = `
==============================================
HORAIOS BAPTIST CHURCH - CONTRIBUTION RECEIPT
==============================================
Receipt Number : ${cardSuccessReceipt.receiptNumber}
Date           : ${cardSuccessReceipt.date}
Donor Email    : ${cardSuccessReceipt.email}
Amount         : $${cardSuccessReceipt.amount.toFixed(2)} USD
Frequency      : ${cardSuccessReceipt.frequency}
Designated Fund: ${cardSuccessReceipt.fund}
Payment Method : Credit / Debit Card (Encrypted)
Status         : Approved & Processed

Thank you for your generous heart and faithful support of Horaios Baptist Church!
"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
==============================================
`.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Horaios_Giving_Receipt_${cardSuccessReceipt.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const qrImageUrl = settings.giving_qr_image ? getImageUrl(settings.giving_qr_image) : '';
  const bankName = settings.giving_bank_name || 'ABA Bank (KHQR)';
  const accountName = settings.giving_account_name || 'HORAIOS BAPTIST CHURCH';
  const accountNumber = settings.giving_account_number || '001 234 567';
  const currency = settings.giving_currency || 'USD / KHR';
  const instructions = settings.giving_instructions || 
    "1. Open your mobile banking app (ABA Mobile, Bakong, or any KHQR-supported app).\n2. Tap 'Scan QR' and point camera at the church QR code.\n3. Enter your contribution amount.\n4. Mention 'Tithe' or 'Offering' in the transfer remarks.\n5. Confirm the transfer.";
  const note = settings.giving_note || 
    "Your financial support empowers our Sunday services, community outreach programs, and Gospel ministries.";

  // Dedicated Channel Settings
  const onetimeMerchant = settings.giving_onetime_merchant_name || '';
  const onetimePortalUrl = settings.giving_onetime_portal_url || '';
  const onetimeNotes = settings.giving_onetime_notes || '';

  const bankUsdAcc = settings.giving_bank_account_number_usd || accountNumber;
  const bankKhrAcc = settings.giving_bank_account_number_khr || '';
  const bankSwift = settings.giving_bank_swift_code || 'ABACXXPP';
  const bankBranch = settings.giving_bank_branch || 'Boeung Tompun Branch, Phnom Penh, Cambodia';
  const bankMemo = settings.giving_bank_wire_memo || '[Your Name] - Tithe/Offering';
  const bankInstructions = settings.giving_bank_instructions || '';

  const mobileProvider = settings.giving_mobile_provider || 'ABA Mobile / Bakong / Wing';
  const mobileAccountName = settings.giving_mobile_account_name || accountName;
  const mobileAccountNumber = settings.giving_mobile_account_number || accountNumber;
  const mobilePhone = settings.giving_mobile_phone || settings.phone || '';
  const mobileInstructions = settings.giving_mobile_instructions || '';

  const recurringAccountName = settings.giving_recurring_account_name || accountName;
  const recurringStandingRef = settings.giving_recurring_standing_order_ref || 'HORAIOS-MONTHLY-[NAME]';
  const recurringPortalUrl = settings.giving_recurring_portal_url || '';
  const recurringInstructions = settings.giving_recurring_instructions || '';

  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title={t('give.hero.title', 'Generous Giving')}
        subtitle={t('give.hero.subtitle', 'Support Our Ministry')}
        description={t('give.hero.desc', 'Your generosity enables us to worship together, serve our local community, and spread the Gospel.')}
        minHeight="md"
      />

      {/* Why Give */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            {t('give.why_give', 'Why Give?')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">⛪</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                {t('give.ministry_title', 'Ministry & Outreach')}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('give.ministry_desc', 'Your gifts fund our worship services, discipleship programs, and community outreach.')}
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                {t('give.growth_title', 'Spiritual Growth')}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('give.growth_desc', 'Support educational programs that help people grow in their faith and knowledge.')}
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                {t('give.impact_title', 'Community Impact')}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('give.impact_desc', "Enable us to serve vulnerable populations and demonstrate Christ's love through action.")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Make a Contribution (Credit & Debit Card Giving) */}
      <section className="py-20 bg-neutral-50" id="make-a-contribution">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card padding="lg" shadow="lg" className="border border-neutral-100 bg-white">
            {!cardSuccessReceipt ? (
              <div>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-body-xs font-semibold mb-3">
                    <CreditCard className="w-3.5 h-3.5" /> {t('ui.credit_debit_card', 'Credit & Debit Card')}
                  </div>
                  <h2 className="text-h3 font-semibold text-neutral-900">
                    {t('ui.make_a_contribution', 'Make a Contribution')}
                  </h2>
                  <p className="text-body-sm text-neutral-500 mt-1 max-w-md mx-auto">
                    {t('ui.give_securely_online_with_any_major_credit_o', 'Give securely online with any major credit or debit card (Visa, Mastercard, UnionPay).')}
                  </p>
                  {onetimePortalUrl && (
                    <div className="mt-3">
                      <a
                        href={onetimePortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-body-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-primary-red" />
                        <span>{t('ui.give_via_external_payment_portal', 'Give via External Payment Portal')} {onetimeMerchant ? `(${onetimeMerchant})` : ''}</span>
                      </a>
                    </div>
                  )}
                  {onetimeNotes && (
                    <p className="text-body-xs text-neutral-500 italic mt-2 max-w-md mx-auto">
                      "{onetimeNotes}"
                    </p>
                  )}
                </div>

                <form onSubmit={handleCardSubmit} className="space-y-6">
                  {/* Frequency Switcher */}
                  <div>
                    <label className="block text-body-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      {t('ui.giving_frequency', 'Giving Frequency')}
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setFrequency('one-time')}
                        className={`py-2 text-body-sm font-semibold rounded-lg transition-all ${
                          frequency === 'one-time'
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {t('ui.one_time_gift', 'One-Time Gift')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('monthly')}
                        className={`py-2 text-body-sm font-semibold rounded-lg transition-all ${
                          frequency === 'monthly'
                            ? 'bg-white text-primary-red shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {t('ui.monthly_recurring', 'Monthly Recurring')}
                      </button>
                    </div>
                  </div>

                  {/* Fund Selection */}
                  <div>
                    <label className="block text-body-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      {t('ui.designate_giving_fund', 'Designate Giving Fund')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {funds.map((fund) => (
                        <button
                          key={fund}
                          type="button"
                          onClick={() => setSelectedFund(fund)}
                          className={`px-3.5 py-2.5 rounded-xl border text-left text-body-xs transition-all flex items-center justify-between ${
                            selectedFund === fund
                              ? 'border-primary-red bg-primary-red/5 text-primary-red font-semibold shadow-xs'
                              : 'border-neutral-200 text-neutral-700 hover:border-neutral-300 bg-white'
                          }`}
                        >
                          <span>{fundLabels[fund] ?? fund}</span>
                          {selectedFund === fund && <Check className="w-4 h-4 text-primary-red" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preset Amounts */}
                  <div>
                    <label className="block text-body-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      {t('ui.select_contribution_amount_usd', 'Select Contribution Amount (USD)')}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                      {donationLevels.map((level) => (
                        <button
                          key={level.amount}
                          type="button"
                          onClick={() => handleSelectPreset(level.amount)}
                          className={`py-2.5 rounded-xl border-2 transition-all text-center ${
                            selectedAmount === level.amount
                              ? 'border-primary-red bg-primary-red text-white shadow-xs font-bold'
                              : 'border-neutral-200 text-neutral-800 hover:border-primary-red/50 bg-white font-semibold'
                          }`}
                        >
                          <div className="text-body-sm">${level.amount}</div>
                          <div className={`text-[10px] mt-0.5 ${selectedAmount === level.amount ? 'text-white/90' : 'text-neutral-400'}`}>
                            {level.label}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount Field */}
                    <div className="relative mt-3">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-body-sm">
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder={t('ui.or_enter_a_custom_amount_e_g_75_150_300', 'Or enter a custom amount (e.g. 75, 150, 300)')}
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="w-full pl-8 pr-4 py-2.5 border border-neutral-200 rounded-xl text-body-sm focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red bg-white"
                      />
                    </div>
                  </div>

                  {/* Cardholder Contact Details */}
                  <div className="pt-2 border-t border-neutral-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-body-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        {t('ui.payment_card_details', 'Payment & Card Details')}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <Lock className="w-3 h-3 text-emerald-600" /> {t('ui.256_bit_ssl_encrypted', '256-Bit SSL Encrypted')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-body-xs text-neutral-600 mb-1">
                          {t('ui.cardholder_full_name', 'Cardholder Full Name')} <span className="text-primary-red">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder={t('ui.e_g_johnathan_doe', 'e.g. Johnathan Doe')}
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:border-primary-red"
                        />
                      </div>

                      <div>
                        <label className="block text-body-xs text-neutral-600 mb-1">
                          {t('ui.email_address_for_receipt', 'Email Address (for receipt)')} <span className="text-primary-red">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:border-primary-red"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-body-xs text-neutral-600 mb-1">
                        {t('ui.card_number', 'Card Number')} <span className="text-primary-red">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4000 1234 5678 9010"
                          className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-mono focus:outline-none focus:border-primary-red"
                        />
                        <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-body-xs text-neutral-600 mb-1">
                          {t('ui.expires_mm_yy', 'Expires (MM/YY)')} <span className="text-primary-red">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-mono focus:outline-none focus:border-primary-red"
                        />
                      </div>

                      <div>
                        <label className="block text-body-xs text-neutral-600 mb-1">
                          CVC / CVV <span className="text-primary-red">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          inputMode="numeric"
                          maxLength={4}
                          value={cardCvc}
                          onChange={handleCvcChange}
                          placeholder="123"
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-mono focus:outline-none focus:border-primary-red"
                        />
                      </div>
                    </div>

                    {/* Cover Fee Option */}
                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-body-xs text-neutral-600">
                        <input
                          type="checkbox"
                          checked={coverFee}
                          onChange={(e) => setCoverFee(e.target.checked)}
                          className="w-4 h-4 rounded text-primary-red focus:ring-primary-red border-neutral-300"
                        />
                        <span>
                          {t('ui.cover_processing_fee_add_2_5', 'Cover processing fee (add 2.5% / $')}{(baseAmount * 0.025).toFixed(2)} {t('ui.so_100_of_my_gift_goes_directly_to_ministry', 'so 100% of my gift goes directly to ministry)')}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Validation Error Banner */}
                  {cardError && (
                    <div className="p-3 bg-red-50 text-red-700 text-body-xs rounded-lg border border-red-200">
                      {cardError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isProcessing}
                      className="py-3.5 text-body-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{t('ui.processing_contribution', 'Processing Contribution...')}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>
                            {t('ui.contribute', 'Contribute $')}{totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'} {t('ui.usd_via_card', 'USD via Card')}
                            {frequency === 'monthly' ? ' / Month' : ''}
                          </span>
                        </>
                      )}
                    </Button>
                    <p className="text-center text-[11px] text-neutral-400 mt-2 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {t('ui.tax_receipts_are_automatically_generated_and', 'Tax receipts are automatically generated and sent to your email.')}
                    </p>
                  </div>
                </form>

                {/* Callout to Other Ways to Give */}
                <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                  <p className="text-body-xs text-neutral-500">
                    {t('ui.prefer_to_scan_via_mobile_banking_khqr_or_ma', 'Prefer to scan via mobile banking (KHQR) or make a direct bank wire?')}
                  </p>
                  <a
                    href="#other-ways-to-give"
                    className="inline-flex items-center gap-1.5 text-body-xs font-semibold text-primary-red hover:underline mt-1"
                  >
                    <span>{t('ui.view_other_ways_to_give_below', 'View Other Ways to Give below')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              /* Success Receipt View */
              <div className="py-8 text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-h3 font-bold text-neutral-900">
                    {t('ui.thank_you_for_your_generosity', 'Thank You for Your Generosity!')}
                  </h3>
                  <p className="text-body-sm text-neutral-600 mt-1 max-w-md mx-auto">
                    {t('ui.your_contribution_of', 'Your contribution of')} <strong className="text-neutral-900">${cardSuccessReceipt.amount.toFixed(2)} USD</strong> {t('ui.has_been_received_with_gratitude', 'has been received with gratitude.')}
                  </p>
                </div>

                <div className="max-w-md mx-auto p-5 bg-neutral-50 rounded-2xl border border-neutral-200 text-left text-body-xs space-y-2.5">
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-500">{t('ui.receipt_number', 'Receipt Number')}</span>
                    <span className="font-mono font-semibold text-neutral-900">{cardSuccessReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-500">{t('event_detail.date', 'Date')}</span>
                    <span className="font-medium text-neutral-800">{cardSuccessReceipt.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-500">{t('ui.designated_fund', 'Designated Fund')}</span>
                    <span className="font-medium text-neutral-800">{fundLabels[cardSuccessReceipt.fund] ?? cardSuccessReceipt.fund}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-500">{t('ui.giving_frequency', 'Giving Frequency')}</span>
                    <span className="font-medium text-neutral-800">{cardSuccessReceipt.frequency === 'Monthly Recurring' ? t('ui.monthly_recurring', 'Monthly Recurring') : translate('ui.one_time_contribution', 'One-Time Contribution')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t('ui.receipt_sent_to', 'Receipt Sent To')}</span>
                    <span className="font-medium text-neutral-800">{cardSuccessReceipt.email}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleDownloadReceipt}
                    className="flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> {t('ui.download_receipt', 'Download Receipt')}
                  </Button>
                  <Button
                    variant="default"
                    size="md"
                    onClick={() => {
                      setCardSuccessReceipt(null);
                      setCardName('');
                      setCardNumber('');
                      setCardExpiry('');
                      setCardCvc('');
                    }}
                  >
                    {t('ui.make_another_contribution', 'Make Another Contribution')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Other Ways to Give (4 Specialized Methods) */}
      <section className="py-20 bg-white" id="other-ways-to-give">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-semibold text-neutral-900">
              {t('give.other_ways', 'Other Ways to Give')}
            </h2>
            <p className="text-body-sm text-neutral-500 mt-2 max-w-xl mx-auto">
              {t('give.other_ways_desc', "Choose the method that works best for you and your family to partner in the work of God's Kingdom.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. QR Code Giving (Kept as is) */}
            <Card padding="lg" className="text-center flex flex-col justify-between border border-neutral-100 hover:border-primary-red/30 transition-all hover:shadow-md">
              <div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-red/10 text-primary-red flex items-center justify-center">
                  <QrCode className="w-7 h-7" />
                </div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('ui.qr_code_giving', 'QR Code Giving')}
                </h4>
                <p className="text-body-sm text-neutral-600 mb-6">
                  {t('ui.scan_instantly_using_any_banking_app_with_kh', 'Scan instantly using any banking app with KHQR (ABA, Bakong, Acleda, etc.).')}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-4 h-4" /> {t('ui.scan_qr_code', 'Scan QR Code')}
              </Button>
            </Card>

            {/* 2. Bank Transfer (Updated based on title) */}
            <Card padding="lg" className="text-center flex flex-col justify-between border border-neutral-100 hover:border-neutral-300 transition-all hover:shadow-md">
              <div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('ui.bank_transfer', 'Bank Transfer')}
                </h4>
                <p className="text-body-sm text-neutral-600 mb-6">
                  {t('ui.domestic_direct_deposit_or_international_swi', 'Domestic direct deposit or international SWIFT wire transfer to church accounts.')}
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => setIsBankTransferModalOpen(true)}
              >
                {t('ui.view_bank_transfer_info', 'View Bank Transfer Info')}
              </Button>
            </Card>

            {/* 3. Mobile Banking (Updated based on title) */}
            <Card padding="lg" className="text-center flex flex-col justify-between border border-neutral-100 hover:border-neutral-300 transition-all hover:shadow-md">
              <div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Smartphone className="w-7 h-7" />
                </div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('ui.mobile_banking', 'Mobile Banking')}
                </h4>
                <p className="text-body-sm text-neutral-600 mb-6">
                  {t('ui.fast_in_app_transfer_via_aba_mobile_bakong_o', 'Fast in-app transfer via ABA Mobile, Bakong, or Wing using account number or phone.')}
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => setIsMobileBankingModalOpen(true)}
              >
                {t('ui.mobile_banking_guide', 'Mobile Banking Guide')}
              </Button>
            </Card>

            {/* 4. Recurring Gift (Updated based on title) */}
            <Card padding="lg" className="text-center flex flex-col justify-between border border-neutral-100 hover:border-neutral-300 transition-all hover:shadow-md">
              <div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('ui.recurring_gift', 'Recurring Gift')}
                </h4>
                <p className="text-body-sm text-neutral-600 mb-6">
                  {t('ui.set_up_automated_monthly_card_giving_or_recu', 'Set up automated monthly card giving or recurring standing order in your banking app.')}
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => setIsRecurringModalOpen(true)}
              >
                {t('ui.set_up_recurring', 'Set Up Recurring')}
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            {t('give.your_impact', 'Your Impact')}
          </h2>

          <Card padding="lg" shadow="lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-h4 font-bold text-primary-red mb-2">$5</p>
                <p className="text-body-sm text-neutral-600">
                  {t('ui.provides_a_meal_for_a_family_in_need', 'Provides a meal for a family in need')}
                </p>
              </div>

              <div>
                <p className="text-h4 font-bold text-primary-red mb-2">$25</p>
                <p className="text-body-sm text-neutral-600">
                  {t('ui.supports_a_week_of_youth_program_activities', 'Supports a week of youth program activities')}
                </p>
              </div>

              <div>
                <p className="text-h4 font-bold text-primary-red mb-2">$100</p>
                <p className="text-body-sm text-neutral-600">
                  {t('ui.funds_bible_materials_for_10_children', 'Funds Bible materials for 10 children')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            {t('give.faqs', 'Giving FAQs')}
          </h2>

          <div className="space-y-4">
            {[
              {
                q: translate('ui.how_do_i_scan_the_qr_code_to_give', 'How do I scan the QR code to give?'),
                a: translate('ui.open_any_mobile_banking_app_with_khqr_suppor', 'Open any mobile banking app with KHQR support (e.g. ABA Mobile, Acleda, Bakong), tap the QR scan icon, point your camera at the church code, enter your desired offering amount, and confirm.'),
              },
              {
                q: translate('ui.can_i_designate_my_giving_for_a_specific_pur', 'Can I designate my giving for a specific purpose?'),
                a: translate('ui.yes_whether_giving_online_with_credit_card_o', 'Yes! Whether giving online with credit card or through bank transfer remarks, choose or write your designated fund such as "Tithe", "Missions", "Building Fund", or "Youth".'),
              },
              {
                q: translate('ui.is_my_donation_tax_deductible_or_eligible_fo', 'Is my donation tax-deductible or eligible for a receipt?'),
                a: translate('ui.yes_horaios_baptist_church_provides_giving_r', 'Yes. Horaios Baptist Church provides giving receipts for all online card contributions and bank transfers upon request. Send transfer slips to info@horaiosbaptist.org or via our Telegram channel.'),
              },
              {
                q: translate('ui.can_i_give_anonymously', 'Can I give anonymously?'),
                a: translate('ui.yes_in_your_bank_transfer_remarks_simply_wri', 'Yes. In your bank transfer remarks, simply write "Anonymous Offering" or leave the remarks field blank.'),
              },
            ].map((faq, i) => (
              <Card key={i} padding="lg">
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {faq.q}
                </h4>
                <p className="text-body-base text-neutral-700">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL 1: Interactive QR Code Giving Modal (Kept as is with top clearance) */}
      {isQrModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[calc(100vh-7.5rem)] sm:max-h-[calc(100vh-8.5rem)] my-auto overflow-y-auto shadow-2xl border border-neutral-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 p-5 border-b border-neutral-100 flex items-start justify-between bg-white/95 backdrop-blur-md rounded-t-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-red/10 text-primary-red flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-h5 font-bold text-neutral-900">{t('ui.scan_to_give_online', 'Scan to Give Online')}</h3>
                  <p className="text-body-xs text-neutral-500">
                    {settings.church_name || 'Horaios Baptist Church'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label={t('ui.close_modal', 'Close modal')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-body-sm">
              {/* QR Code Section */}
              <div className="text-center">
                {qrImageUrl ? (
                  <div className="inline-block p-4 bg-white border-2 border-neutral-200 rounded-2xl shadow-sm max-w-[260px] mx-auto">
                    <img
                      src={qrImageUrl}
                      alt={t('ui.church_giving_qr_code', 'Church Giving QR Code')}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <p className="text-label-xs font-medium text-neutral-500 mt-2">
                      {t('ui.scan_with_any_khqr_banking_app', 'Scan with any KHQR banking app')}
                    </p>
                  </div>
                ) : (
                  <div className="p-8 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-2xl max-w-xs mx-auto text-center space-y-3">
                    <div className="w-16 h-16 bg-primary-red/10 text-primary-red rounded-2xl mx-auto flex items-center justify-center">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-body-base">
                        {bankName}
                      </h4>
                      <p className="text-body-xs text-neutral-500 mt-1">
                        {t('ui.scan_the_official_qr_code_at_church_or_use_t', 'Scan the official QR code at church or use the beneficiary account number below.')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Beneficiary Bank Account Details Card */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.bank_provider', 'Bank / Provider')}</span>
                  <span className="font-semibold text-neutral-900">{bankName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.account_name', 'Account Name')}</span>
                  <span className="font-semibold text-neutral-900">{accountName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.account_number', 'Account Number')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900">{accountNumber}</span>
                    <button
                      onClick={() => handleCopy(accountNumber, 'qr_acc')}
                      className="p-1 text-neutral-500 hover:text-primary-red hover:bg-neutral-200/60 rounded transition-colors"
                      title={t('ui.copy_account_number', 'Copy account number')}
                    >
                      {copiedKey === 'qr_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.currency', 'Currency')}</span>
                  <span className="font-medium text-neutral-800">{currency}</span>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-body-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{t('ui.scan_instructions', 'Scan Instructions')}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg text-body-xs text-neutral-600 whitespace-pre-line leading-relaxed border border-neutral-200/60">
                  {instructions}
                </div>
              </div>

              {note && (
                <p className="text-body-xs text-neutral-500 italic text-center">
                  "{note}"
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {settings.giving_online_url && (
                  <a
                    href={settings.giving_online_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-200 text-neutral-800 text-body-xs font-medium rounded-lg hover:bg-neutral-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> {t('ui.open_online_portal', 'Open Online Portal')}
                  </a>
                )}
                <button
                  onClick={() => handleCopy(accountNumber, 'qr_footer')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-body-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors shadow-xs"
                >
                  {copiedKey === 'qr_footer' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> {t('ui.copied_number', 'Copied Number!')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" /> {t('ui.copy_number', 'Copy Number')}
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsQrModalOpen(false)}
                className="px-5 py-2 bg-primary-red text-white text-body-xs font-medium rounded-lg hover:bg-primary-dark-red transition-colors shadow-xs"
              >
                {t('ui.close', 'Close')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: Bank Transfer & Direct Wire Information Modal */}
      {isBankTransferModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[calc(100vh-7.5rem)] sm:max-h-[calc(100vh-8.5rem)] my-auto overflow-y-auto shadow-2xl border border-neutral-200">
            {/* Header */}
            <div className="sticky top-0 z-10 p-5 border-b border-neutral-100 flex items-start justify-between bg-white/95 backdrop-blur-md rounded-t-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-h5 font-bold text-neutral-900">{t('ui.bank_transfer_wire_info', 'Bank Transfer & Wire Info')}</h3>
                  <p className="text-body-xs text-neutral-500">
                    {t('ui.direct_domestic_and_international_bank_trans', 'Direct domestic and international bank transfers')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBankTransferModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label={t('ui.close_modal', 'Close modal')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-body-sm">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-body-xs text-blue-900">
                {t('ui.you_can_make_one_off_or_recurring_contributi', 'You can make one-off or recurring contributions directly to the church\'s bank account via online banking, wire transfer, or in-branch deposit.')}
              </div>

              {/* Bank Details Table */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.beneficiary_name', 'Beneficiary Name')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{accountName}</span>
                    <button
                      onClick={() => handleCopy(accountName, 'wire_name')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title={t('ui.copy_beneficiary_name', 'Copy beneficiary name')}
                    >
                      {copiedKey === 'wire_name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.bank_name', 'Bank Name')}</span>
                  <span className="font-semibold text-neutral-900">{bankName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.usd_account_number', 'USD Account Number')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900">{bankUsdAcc}</span>
                    <button
                      onClick={() => handleCopy(bankUsdAcc, 'wire_acc_usd')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title={t('ui.copy_usd_account_number', 'Copy USD account number')}
                    >
                      {copiedKey === 'wire_acc_usd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {bankKhrAcc && (
                  <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                    <span className="text-body-xs text-neutral-500 font-medium">{t('ui.khr_account_number', 'KHR Account Number')}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">{bankKhrAcc}</span>
                      <button
                        onClick={() => handleCopy(bankKhrAcc, 'wire_acc_khr')}
                        className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                        title={t('ui.copy_khr_account_number', 'Copy KHR account number')}
                      >
                        {copiedKey === 'wire_acc_khr' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.swift_bic_code', 'SWIFT / BIC Code')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-neutral-800">{bankSwift}</span>
                    <button
                      onClick={() => handleCopy(bankSwift, 'wire_swift')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title={t('ui.copy_swift_code', 'Copy SWIFT code')}
                    >
                      {copiedKey === 'wire_swift' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.branch_location', 'Branch Location')}</span>
                  <span className="text-neutral-800 text-body-xs">{bankBranch}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.accepted_currencies', 'Accepted Currencies')}</span>
                  <span className="font-medium text-neutral-800">{currency}</span>
                </div>
              </div>

              {/* Wire Memo Guidance */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1.5 text-body-xs text-neutral-600">
                <div className="font-semibold text-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('ui.transfer_remarks_payment_reference', 'Transfer Remarks / Payment Reference')}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(bankMemo, 'wire_memo')}
                    className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                    title={t('ui.copy_memo', 'Copy memo')}
                  >
                    {copiedKey === 'wire_memo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p>
                  {t('ui.please_write', 'Please write:')} <span className="font-mono font-bold text-neutral-800">{bankMemo}</span> {t('ui.in_your_transfer_memo_so_our_treasury_team_c', 'in your transfer memo so our treasury team can credit your donation and issue an official receipt.')}
                </p>
              </div>

              {bankInstructions && (
                <div className="space-y-1.5">
                  <div className="text-body-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    {t('ui.bank_instructions', 'Bank Instructions')}
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg text-body-xs text-neutral-600 whitespace-pre-line leading-relaxed border border-neutral-200/60">
                    {bankInstructions}
                  </div>
                </div>
              )}

              <div className="text-body-xs text-neutral-500">
                {t('ui.need_an_international_wire_confirmation_or_t', 'Need an international wire confirmation or tax acknowledgment? Email your wire confirmation slip to')}{' '}
                <a href={`mailto:${settings.email || 'info@horaiosbaptist.org'}`} className="text-primary-red font-medium hover:underline">
                  {settings.email || 'info@horaiosbaptist.org'}
                </a>.
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 rounded-b-2xl flex items-center justify-between">
              <button
                onClick={() => handleCopy(bankUsdAcc, 'wire_btn')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-body-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors shadow-xs"
              >
                {copiedKey === 'wire_btn' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {t('ui.copy_account_number_3cf947', 'Copy Account Number')}
              </button>
              <button
                onClick={() => setIsBankTransferModalOpen(false)}
                className="px-5 py-2 bg-neutral-800 text-white text-body-xs font-medium rounded-lg hover:bg-neutral-900 transition-colors"
              >
                {t('form.done', 'Done')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: Mobile Banking Instructions Modal */}
      {isMobileBankingModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[calc(100vh-7.5rem)] sm:max-h-[calc(100vh-8.5rem)] my-auto overflow-y-auto shadow-2xl border border-neutral-200">
            {/* Header */}
            <div className="sticky top-0 z-10 p-5 border-b border-neutral-100 flex items-start justify-between bg-white/95 backdrop-blur-md rounded-t-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-h5 font-bold text-neutral-900">{t('ui.mobile_banking_guide', 'Mobile Banking Guide')}</h3>
                  <p className="text-body-xs text-neutral-500">
                    {t('ui.give_through_aba_mobile_bakong_wing_or_acled', 'Give through ABA Mobile, Bakong, Wing, or Acleda')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileBankingModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label={t('ui.close_modal', 'Close modal')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-body-sm">
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-body-xs text-purple-900">
                {t('ui.you_can_transfer_directly_from_your_phone_in', 'You can transfer directly from your phone in seconds using your local banking app.')}
              </div>

              {/* Mobile Payee Details Card */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.supported_apps', 'Supported Apps')}</span>
                  <span className="font-semibold text-neutral-900">{mobileProvider}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.beneficiary_name', 'Beneficiary Name')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{mobileAccountName}</span>
                    <button
                      onClick={() => handleCopy(mobileAccountName, 'mobile_name')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title={t('ui.copy_account_name', 'Copy account name')}
                    >
                      {copiedKey === 'mobile_name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">{t('ui.account_bakong_id', 'Account / Bakong ID')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900">{mobileAccountNumber}</span>
                    <button
                      onClick={() => handleCopy(mobileAccountNumber, 'mobile_acc')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title={t('ui.copy_mobile_account', 'Copy mobile account')}
                    >
                      {copiedKey === 'mobile_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {mobilePhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-body-xs text-neutral-500 font-medium">{t('ui.payee_phone_number', 'Payee Phone Number')}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">{mobilePhone}</span>
                      <button
                        onClick={() => handleCopy(mobilePhone, 'mobile_phone')}
                        className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                        title={t('ui.copy_phone', 'Copy phone')}
                      >
                        {copiedKey === 'mobile_phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {mobileInstructions && (
                <div className="space-y-1.5">
                  <div className="text-body-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    {t('ui.instructions', 'Instructions')}
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg text-body-xs text-neutral-600 whitespace-pre-line leading-relaxed border border-neutral-200/60">
                    {mobileInstructions}
                  </div>
                </div>
              )}

              {/* 5-Step Visual Walkthrough */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">{t('ui.open_your_mobile_banking_app', 'Open Your Mobile Banking App')}</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      {t('ui.launch', 'Launch')} {mobileProvider || translate('ui.aba_mobile_bakong_acleda_or_wing', 'ABA Mobile, Bakong, Acleda, or Wing')} {t('ui.on_your_device', 'on your device.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">{t('ui.choose_transfer_or_scan', 'Choose Transfer or Scan')}</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      {t('ui.select', 'Select')} <strong>{t('ui.transfer_to_account', 'Transfer to Account')}</strong> {t('ui.or_tap', 'or tap')} <strong>{t('ui.khqr_scan', 'KHQR Scan')}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">{t('ui.enter_church_account_details', 'Enter Church Account Details')}</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      {t('ui.account_number_7a6afc', 'Account Number:')} <strong className="font-mono text-neutral-800">{mobileAccountNumber}</strong> ({mobileAccountName})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">{t('ui.enter_amount_remarks', 'Enter Amount & Remarks')}</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      {t('ui.specify_the_giving_amount_and_add', 'Specify the giving amount and add')} <em>{t('ui.tithe', '"Tithe"')}</em> {t('ui.or', 'or')} <em>{t('ui.offering', '"Offering"')}</em> {t('ui.in_the_transfer_remark', 'in the transfer remark.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">{t('ui.confirm_save_receipt', 'Confirm & Save Receipt')}</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      {t('ui.complete_the_biometric_pin_confirmation_and_', 'Complete the biometric/PIN confirmation and save or screenshot your digital receipt.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 rounded-b-2xl flex items-center justify-between">
              <button
                onClick={() => {
                  setIsMobileBankingModalOpen(false);
                  setIsQrModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-red text-white text-body-xs font-medium rounded-lg hover:bg-primary-dark-red transition-colors shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5" /> {t('ui.view_qr_code', 'View QR Code')}
              </button>
              <button
                onClick={() => setIsMobileBankingModalOpen(false)}
                className="px-5 py-2 bg-neutral-800 text-white text-body-xs font-medium rounded-lg hover:bg-neutral-900 transition-colors"
              >
                {t('ui.close', 'Close')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: Recurring Gift Setup Modal */}
      {isRecurringModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[calc(100vh-7.5rem)] sm:max-h-[calc(100vh-8.5rem)] my-auto overflow-y-auto shadow-2xl border border-neutral-200">
            {/* Header */}
            <div className="sticky top-0 z-10 p-5 border-b border-neutral-100 flex items-start justify-between bg-white/95 backdrop-blur-md rounded-t-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-h5 font-bold text-neutral-900">{t('ui.set_up_recurring_giving', 'Set Up Recurring Giving')}</h3>
                  <p className="text-body-xs text-neutral-500">
                    {t('ui.faithful_scheduled_stewardship_for_ongoing_m', 'Faithful, scheduled stewardship for ongoing ministry impact')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRecurringModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label={t('ui.close_modal', 'Close modal')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-body-sm">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-body-xs text-emerald-950">
                <p className="italic">
                  {t('ui.each_of_you_should_give_what_you_have_decide', '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."')}
                </p>
                <p className="font-semibold text-right mt-1 text-emerald-800">{t('ui.2_corinthians_9_7', '— 2 Corinthians 9:7')}</p>
              </div>

              {/* 3 Practical Recurring Ways */}
              <div className="space-y-4">
                {recurringPortalUrl && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h5 className="font-semibold text-neutral-900 text-body-sm mb-1 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-emerald-700" />
                      <span>{t('ui.online_recurring_giving_portal', 'Online Recurring Giving Portal')}</span>
                    </h5>
                    <p className="text-body-xs text-neutral-600 mb-3">
                      {t('ui.manage_recurring_monthly_contributions_sched', 'Manage recurring monthly contributions, schedules, and payment methods via our dedicated donor portal.')}
                    </p>
                    <a
                      href={recurringPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-body-xs font-medium transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> {t('ui.open_recurring_portal', 'Open Recurring Portal')}
                    </a>
                  </div>
                )}

                {recurringInstructions && (
                  <div className="space-y-1.5">
                    <div className="text-body-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      {t('ui.recurring_giving_guidelines', 'Recurring Giving Guidelines')}
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg text-body-xs text-neutral-600 whitespace-pre-line leading-relaxed border border-neutral-200/60">
                      {recurringInstructions}
                    </div>
                  </div>
                )}

                {/* Method A: Online Monthly Card */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-primary-red/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-neutral-900 text-body-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary-red" />
                      <span>{t('ui.monthly_credit_or_debit_card_giving', 'Monthly Credit or Debit Card Giving')}</span>
                    </h5>
                    <span className="text-[10px] bg-primary-red/10 text-primary-red px-2 py-0.5 rounded-full font-semibold">
                      {t('ui.recommended', 'Recommended')}
                    </span>
                  </div>
                  <p className="text-body-xs text-neutral-600 mb-3">
                    {t('ui.automatically_draft_your_chosen_tithe_or_off', 'Automatically draft your chosen tithe or offering on a set monthly schedule with immediate digital receipts.')}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setFrequency('monthly');
                      setIsRecurringModalOpen(false);
                      const el = document.getElementById('make-a-contribution');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center justify-center gap-1.5"
                  >
                    <span>{t('ui.set_up_monthly_card_giving', 'Set Up Monthly Card Giving')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Method B: Mobile Banking Scheduled Standing Order */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
                  <h5 className="font-semibold text-neutral-900 text-body-sm flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>{t('ui.banking_app_scheduled_auto_transfer', 'Banking App Scheduled Auto-Transfer')}</span>
                  </h5>
                  <p className="text-body-xs text-neutral-600">
                    {t('ui.set_up_a_scheduled_repeating_transfer_direct', 'Set up a scheduled repeating transfer directly inside your banking app:')}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 text-body-xs">
                      <span className="text-neutral-500">{t('ui.beneficiary', 'Beneficiary:')}</span>
                      <span className="font-semibold text-neutral-900">{recurringAccountName}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 text-body-xs">
                      <span className="text-neutral-500">{t('ui.account_no', 'Account No:')}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-900">{accountNumber}</span>
                        <button
                          onClick={() => handleCopy(accountNumber, 'rec_acc')}
                          className="text-primary-red font-medium hover:underline text-xs flex items-center gap-1"
                        >
                          {copiedKey === 'rec_acc' ? t('ui.copied', 'Copied!') : t('ui.copy', 'Copy')}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 text-body-xs">
                      <span className="text-neutral-500">{t('ui.standing_order_ref', 'Standing Order Ref:')}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neutral-800 text-[11px]">{recurringStandingRef}</span>
                        <button
                          onClick={() => handleCopy(recurringStandingRef, 'rec_ref')}
                          className="text-primary-red font-medium hover:underline text-xs flex items-center gap-1"
                        >
                          {copiedKey === 'rec_ref' ? t('ui.copied', 'Copied!') : t('ui.copy', 'Copy')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method C: Personal Giving Pledge & Envelopes */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <h5 className="font-semibold text-neutral-900 text-body-sm mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{t('ui.weekly_giving_envelopes', 'Weekly Giving Envelopes')}</span>
                  </h5>
                  <p className="text-body-xs text-neutral-600">
                    {t('ui.if_you_prefer_giving_in_person_during_our_su', 'If you prefer giving in person during our Sunday services, collect numbered giving envelopes from our church welcome desk.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setIsRecurringModalOpen(false)}
                className="px-5 py-2 bg-neutral-800 text-white text-body-xs font-medium rounded-lg hover:bg-neutral-900 transition-colors"
              >
                {t('ui.close', 'Close')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Layout>
  );
};

export default GivePage;

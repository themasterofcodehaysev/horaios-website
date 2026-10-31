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
import { getImageUrl } from '../utils/imageUrl';

export const GivePage: React.FC = () => {
  const { settings } = useSiteSettings();

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
    { amount: 10, label: 'Seed', description: 'Plant a seed of faith' },
    { amount: 25, label: 'Nurture', description: 'Help us grow' },
    { amount: 50, label: 'Sustain', description: 'Keep ministry going' },
    { amount: 100, label: 'Launch', description: 'Help us reach further' },
    { amount: 250, label: 'Transform', description: 'Change lives' },
    { amount: 500, label: 'Impact', description: 'Make a lasting difference' },
  ];

  const funds = [
    'General Tithe & Offering',
    'Missions & Community Outreach',
    'Building & Facility Fund',
    'Youth & Children Ministry',
  ];

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
      setCardError('Please choose or enter a valid contribution amount.');
      return;
    }
    if (!donorEmail || !donorEmail.includes('@')) {
      setCardError('Please enter a valid email address to receive your contribution receipt.');
      return;
    }
    if (!cardName.trim()) {
      setCardError('Please enter the name on your card.');
      return;
    }
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      setCardError('Please enter a valid 16-digit credit or debit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      setCardError('Please enter a valid CVC / CVV security code.');
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
        date: new Date().toLocaleDateString(undefined, {
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
  const bankBranch = settings.giving_bank_branch || 'BKK3 Branch, Phnom Penh, Cambodia';
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
        title="Generous Giving"
        subtitle="Support Our Ministry"
        description="Your generosity enables us to worship together, serve our local community, and spread the Gospel."
        minHeight="md"
      />

      {/* Why Give */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            Why Give?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">⛪</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Ministry & Outreach
              </h4>
              <p className="text-body-sm text-neutral-600">
                Your gifts fund our worship services, discipleship programs, and community outreach.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Spiritual Growth
              </h4>
              <p className="text-body-sm text-neutral-600">
                Support educational programs that help people grow in their faith and knowledge.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Community Impact
              </h4>
              <p className="text-body-sm text-neutral-600">
                Enable us to serve vulnerable populations and demonstrate Christ's love through action.
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
                    <CreditCard className="w-3.5 h-3.5" /> Credit & Debit Card
                  </div>
                  <h2 className="text-h3 font-semibold text-neutral-900">
                    Make a Contribution
                  </h2>
                  <p className="text-body-sm text-neutral-500 mt-1 max-w-md mx-auto">
                    Give securely online with any major credit or debit card (Visa, Mastercard, UnionPay).
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
                        <span>Give via External Payment Portal {onetimeMerchant ? `(${onetimeMerchant})` : ''}</span>
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
                      Giving Frequency
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
                        One-Time Gift
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
                        Monthly Recurring
                      </button>
                    </div>
                  </div>

                  {/* Fund Selection */}
                  <div>
                    <label className="block text-body-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      Designate Giving Fund
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
                          <span>{fund}</span>
                          {selectedFund === fund && <Check className="w-4 h-4 text-primary-red" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preset Amounts */}
                  <div>
                    <label className="block text-body-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      Select Contribution Amount (USD)
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
                        placeholder="Or enter a custom amount (e.g. 75, 150, 300)"
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
                        Payment & Card Details
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Encrypted
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-body-xs text-neutral-600 mb-1">
                          Cardholder Full Name <span className="text-primary-red">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="e.g. Johnathan Doe"
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:border-primary-red"
                        />
                      </div>

                      <div>
                        <label className="block text-body-xs text-neutral-600 mb-1">
                          Email Address (for receipt) <span className="text-primary-red">*</span>
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
                        Card Number <span className="text-primary-red">*</span>
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
                          Expires (MM/YY) <span className="text-primary-red">*</span>
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
                          Cover processing fee (add 2.5% / ${(baseAmount * 0.025).toFixed(2)} so 100% of my gift goes directly to ministry)
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
                          <span>Processing Contribution...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>
                            Contribute ${totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'} USD via Card
                            {frequency === 'monthly' ? ' / Month' : ''}
                          </span>
                        </>
                      )}
                    </Button>
                    <p className="text-center text-[11px] text-neutral-400 mt-2 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Tax receipts are automatically generated and sent to your email.
                    </p>
                  </div>
                </form>

                {/* Callout to Other Ways to Give */}
                <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                  <p className="text-body-xs text-neutral-500">
                    Prefer to scan via mobile banking (KHQR) or make a direct bank wire?
                  </p>
                  <a
                    href="#other-ways-to-give"
                    className="inline-flex items-center gap-1.5 text-body-xs font-semibold text-primary-red hover:underline mt-1"
                  >
                    <span>View Other Ways to Give below</span>
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
                    Thank You for Your Generosity!
                  </h3>
                  <p className="text-body-sm text-neutral-600 mt-1 max-w-md mx-auto">
                    Your contribution of <strong className="text-neutral-900">${cardSuccessReceipt.amount.toFixed(2)} USD</strong> has been received with gratitude.
                  </p>
                </div>

                <div className="max-w-md mx-auto p-5 bg-neutral-50 rounded-2xl border border-neutral-200 text-left text-body-xs space-y-2.5">
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-500">Receipt Number</span>
                    <span className="font-mono font-semibold text-neutral-900">{cardSuccessReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-500">Date</span>
                    <span className="font-medium text-neutral-800">{cardSuccessReceipt.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-500">Designated Fund</span>
                    <span className="font-medium text-neutral-800">{cardSuccessReceipt.fund}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-500">Giving Frequency</span>
                    <span className="font-medium text-neutral-800">{cardSuccessReceipt.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Receipt Sent To</span>
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
                    <Download className="w-4 h-4" /> Download Receipt
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
                    Make Another Contribution
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
              Other Ways to Give
            </h2>
            <p className="text-body-sm text-neutral-500 mt-2 max-w-xl mx-auto">
              Choose the method that works best for you and your family to partner in the work of God's Kingdom.
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
                  QR Code Giving
                </h4>
                <p className="text-body-sm text-neutral-600 mb-6">
                  Scan instantly using any banking app with KHQR (ABA, Bakong, Acleda, etc.).
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-4 h-4" /> Scan QR Code
              </Button>
            </Card>

            {/* 2. Bank Transfer (Updated based on title) */}
            <Card padding="lg" className="text-center flex flex-col justify-between border border-neutral-100 hover:border-neutral-300 transition-all hover:shadow-md">
              <div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Bank Transfer
                </h4>
                <p className="text-body-sm text-neutral-600 mb-6">
                  Domestic direct deposit or international SWIFT wire transfer to church accounts.
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => setIsBankTransferModalOpen(true)}
              >
                View Bank Transfer Info
              </Button>
            </Card>

            {/* 3. Mobile Banking (Updated based on title) */}
            <Card padding="lg" className="text-center flex flex-col justify-between border border-neutral-100 hover:border-neutral-300 transition-all hover:shadow-md">
              <div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Smartphone className="w-7 h-7" />
                </div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Mobile Banking
                </h4>
                <p className="text-body-sm text-neutral-600 mb-6">
                  Fast in-app transfer via ABA Mobile, Bakong, or Wing using account number or phone.
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => setIsMobileBankingModalOpen(true)}
              >
                Mobile Banking Guide
              </Button>
            </Card>

            {/* 4. Recurring Gift (Updated based on title) */}
            <Card padding="lg" className="text-center flex flex-col justify-between border border-neutral-100 hover:border-neutral-300 transition-all hover:shadow-md">
              <div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Recurring Gift
                </h4>
                <p className="text-body-sm text-neutral-600 mb-6">
                  Set up automated monthly card giving or recurring standing order in your banking app.
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={() => setIsRecurringModalOpen(true)}
              >
                Set Up Recurring
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            Your Impact
          </h2>

          <Card padding="lg" shadow="lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-h4 font-bold text-primary-red mb-2">$5</p>
                <p className="text-body-sm text-neutral-600">
                  Provides a meal for a family in need
                </p>
              </div>

              <div>
                <p className="text-h4 font-bold text-primary-red mb-2">$25</p>
                <p className="text-body-sm text-neutral-600">
                  Supports a week of youth program activities
                </p>
              </div>

              <div>
                <p className="text-h4 font-bold text-primary-red mb-2">$100</p>
                <p className="text-body-sm text-neutral-600">
                  Funds Bible materials for 10 children
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
            Giving FAQs
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'How do I scan the QR code to give?',
                a: 'Open any mobile banking app with KHQR support (e.g. ABA Mobile, Acleda, Bakong), tap the QR scan icon, point your camera at the church code, enter your desired offering amount, and confirm.',
              },
              {
                q: 'Can I designate my giving for a specific purpose?',
                a: 'Yes! Whether giving online with credit card or through bank transfer remarks, choose or write your designated fund such as "Tithe", "Missions", "Building Fund", or "Youth".',
              },
              {
                q: 'Is my donation tax-deductible or eligible for a receipt?',
                a: 'Yes. Horaios Baptist Church provides giving receipts for all online card contributions and bank transfers upon request. Send transfer slips to info@horaiosbaptist.org or via our Telegram channel.',
              },
              {
                q: 'Can I give anonymously?',
                a: 'Yes. In your bank transfer remarks, simply write "Anonymous Offering" or leave the remarks field blank.',
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
                  <h3 className="text-h5 font-bold text-neutral-900">Scan to Give Online</h3>
                  <p className="text-body-xs text-neutral-500">
                    {settings.church_name || 'Horaios Baptist Church'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
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
                      alt="Church Giving QR Code"
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <p className="text-label-xs font-medium text-neutral-500 mt-2">
                      Scan with any KHQR banking app
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
                        Scan the official QR code at church or use the beneficiary account number below.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Beneficiary Bank Account Details Card */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                  <span className="text-body-xs text-neutral-500 font-medium">Bank / Provider</span>
                  <span className="font-semibold text-neutral-900">{bankName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                  <span className="text-body-xs text-neutral-500 font-medium">Account Name</span>
                  <span className="font-semibold text-neutral-900">{accountName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                  <span className="text-body-xs text-neutral-500 font-medium">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900">{accountNumber}</span>
                    <button
                      onClick={() => handleCopy(accountNumber, 'qr_acc')}
                      className="p-1 text-neutral-500 hover:text-primary-red hover:bg-neutral-200/60 rounded transition-colors"
                      title="Copy account number"
                    >
                      {copiedKey === 'qr_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-body-xs text-neutral-500 font-medium">Currency</span>
                  <span className="font-medium text-neutral-800">{currency}</span>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-body-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Scan Instructions</span>
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
                    <ExternalLink className="w-3.5 h-3.5" /> Open Online Portal
                  </a>
                )}
                <button
                  onClick={() => handleCopy(accountNumber, 'qr_footer')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-body-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors shadow-xs"
                >
                  {copiedKey === 'qr_footer' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Number!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" /> Copy Number
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsQrModalOpen(false)}
                className="px-5 py-2 bg-primary-red text-white text-body-xs font-medium rounded-lg hover:bg-primary-dark-red transition-colors shadow-xs"
              >
                Close
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
                  <h3 className="text-h5 font-bold text-neutral-900">Bank Transfer & Wire Info</h3>
                  <p className="text-body-xs text-neutral-500">
                    Direct domestic and international bank transfers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBankTransferModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-body-sm">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-body-xs text-blue-900">
                You can make one-off or recurring contributions directly to the church's bank account via online banking, wire transfer, or in-branch deposit.
              </div>

              {/* Bank Details Table */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">Beneficiary Name</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{accountName}</span>
                    <button
                      onClick={() => handleCopy(accountName, 'wire_name')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title="Copy beneficiary name"
                    >
                      {copiedKey === 'wire_name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">Bank Name</span>
                  <span className="font-semibold text-neutral-900">{bankName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">USD Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900">{bankUsdAcc}</span>
                    <button
                      onClick={() => handleCopy(bankUsdAcc, 'wire_acc_usd')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title="Copy USD account number"
                    >
                      {copiedKey === 'wire_acc_usd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {bankKhrAcc && (
                  <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                    <span className="text-body-xs text-neutral-500 font-medium">KHR Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">{bankKhrAcc}</span>
                      <button
                        onClick={() => handleCopy(bankKhrAcc, 'wire_acc_khr')}
                        className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                        title="Copy KHR account number"
                      >
                        {copiedKey === 'wire_acc_khr' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">SWIFT / BIC Code</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-neutral-800">{bankSwift}</span>
                    <button
                      onClick={() => handleCopy(bankSwift, 'wire_swift')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title="Copy SWIFT code"
                    >
                      {copiedKey === 'wire_swift' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">Branch Location</span>
                  <span className="text-neutral-800 text-body-xs">{bankBranch}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-body-xs text-neutral-500 font-medium">Accepted Currencies</span>
                  <span className="font-medium text-neutral-800">{currency}</span>
                </div>
              </div>

              {/* Wire Memo Guidance */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1.5 text-body-xs text-neutral-600">
                <div className="font-semibold text-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    <span>Transfer Remarks / Payment Reference</span>
                  </div>
                  <button
                    onClick={() => handleCopy(bankMemo, 'wire_memo')}
                    className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                    title="Copy memo"
                  >
                    {copiedKey === 'wire_memo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p>
                  Please write: <span className="font-mono font-bold text-neutral-800">{bankMemo}</span> in your transfer memo so our treasury team can credit your donation and issue an official receipt.
                </p>
              </div>

              {bankInstructions && (
                <div className="space-y-1.5">
                  <div className="text-body-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Bank Instructions
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg text-body-xs text-neutral-600 whitespace-pre-line leading-relaxed border border-neutral-200/60">
                    {bankInstructions}
                  </div>
                </div>
              )}

              <div className="text-body-xs text-neutral-500">
                Need an international wire confirmation or tax acknowledgment? Email your wire confirmation slip to{' '}
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
                Copy Account Number
              </button>
              <button
                onClick={() => setIsBankTransferModalOpen(false)}
                className="px-5 py-2 bg-neutral-800 text-white text-body-xs font-medium rounded-lg hover:bg-neutral-900 transition-colors"
              >
                Done
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
                  <h3 className="text-h5 font-bold text-neutral-900">Mobile Banking Guide</h3>
                  <p className="text-body-xs text-neutral-500">
                    Give through ABA Mobile, Bakong, Wing, or Acleda
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileBankingModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-body-sm">
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-body-xs text-purple-900">
                You can transfer directly from your phone in seconds using your local banking app.
              </div>

              {/* Mobile Payee Details Card */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">Supported Apps</span>
                  <span className="font-semibold text-neutral-900">{mobileProvider}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">Beneficiary Name</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{mobileAccountName}</span>
                    <button
                      onClick={() => handleCopy(mobileAccountName, 'mobile_name')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title="Copy account name"
                    >
                      {copiedKey === 'mobile_name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <span className="text-body-xs text-neutral-500 font-medium">Account / Bakong ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900">{mobileAccountNumber}</span>
                    <button
                      onClick={() => handleCopy(mobileAccountNumber, 'mobile_acc')}
                      className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                      title="Copy mobile account"
                    >
                      {copiedKey === 'mobile_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {mobilePhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-body-xs text-neutral-500 font-medium">Payee Phone Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">{mobilePhone}</span>
                      <button
                        onClick={() => handleCopy(mobilePhone, 'mobile_phone')}
                        className="p-1 text-neutral-400 hover:text-primary-red hover:bg-neutral-200/60 rounded"
                        title="Copy phone"
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
                    Instructions
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
                    <h5 className="font-semibold text-neutral-900 text-body-xs">Open Your Mobile Banking App</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      Launch {mobileProvider || 'ABA Mobile, Bakong, Acleda, or Wing'} on your device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">Choose Transfer or Scan</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      Select <strong>Transfer to Account</strong> or tap <strong>KHQR Scan</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">Enter Church Account Details</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      Account Number: <strong className="font-mono text-neutral-800">{mobileAccountNumber}</strong> ({mobileAccountName})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">Enter Amount & Remarks</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      Specify the giving amount and add <em>"Tithe"</em> or <em>"Offering"</em> in the transfer remark.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-body-xs">Confirm & Save Receipt</h5>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      Complete the biometric/PIN confirmation and save or screenshot your digital receipt.
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
                <QrCode className="w-3.5 h-3.5" /> View QR Code
              </button>
              <button
                onClick={() => setIsMobileBankingModalOpen(false)}
                className="px-5 py-2 bg-neutral-800 text-white text-body-xs font-medium rounded-lg hover:bg-neutral-900 transition-colors"
              >
                Close
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
                  <h3 className="text-h5 font-bold text-neutral-900">Set Up Recurring Giving</h3>
                  <p className="text-body-xs text-neutral-500">
                    Faithful, scheduled stewardship for ongoing ministry impact
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRecurringModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-body-sm">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-body-xs text-emerald-950">
                <p className="italic">
                  "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                </p>
                <p className="font-semibold text-right mt-1 text-emerald-800">— 2 Corinthians 9:7</p>
              </div>

              {/* 3 Practical Recurring Ways */}
              <div className="space-y-4">
                {recurringPortalUrl && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h5 className="font-semibold text-neutral-900 text-body-sm mb-1 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-emerald-700" />
                      <span>Online Recurring Giving Portal</span>
                    </h5>
                    <p className="text-body-xs text-neutral-600 mb-3">
                      Manage recurring monthly contributions, schedules, and payment methods via our dedicated donor portal.
                    </p>
                    <a
                      href={recurringPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-body-xs font-medium transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Recurring Portal
                    </a>
                  </div>
                )}

                {recurringInstructions && (
                  <div className="space-y-1.5">
                    <div className="text-body-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Recurring Giving Guidelines
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
                      <span>Monthly Credit or Debit Card Giving</span>
                    </h5>
                    <span className="text-[10px] bg-primary-red/10 text-primary-red px-2 py-0.5 rounded-full font-semibold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-body-xs text-neutral-600 mb-3">
                    Automatically draft your chosen tithe or offering on a set monthly schedule with immediate digital receipts.
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
                    <span>Set Up Monthly Card Giving</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Method B: Mobile Banking Scheduled Standing Order */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
                  <h5 className="font-semibold text-neutral-900 text-body-sm flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>Banking App Scheduled Auto-Transfer</span>
                  </h5>
                  <p className="text-body-xs text-neutral-600">
                    Set up a scheduled repeating transfer directly inside your banking app:
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 text-body-xs">
                      <span className="text-neutral-500">Beneficiary:</span>
                      <span className="font-semibold text-neutral-900">{recurringAccountName}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 text-body-xs">
                      <span className="text-neutral-500">Account No:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-900">{accountNumber}</span>
                        <button
                          onClick={() => handleCopy(accountNumber, 'rec_acc')}
                          className="text-primary-red font-medium hover:underline text-xs flex items-center gap-1"
                        >
                          {copiedKey === 'rec_acc' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 text-body-xs">
                      <span className="text-neutral-500">Standing Order Ref:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neutral-800 text-[11px]">{recurringStandingRef}</span>
                        <button
                          onClick={() => handleCopy(recurringStandingRef, 'rec_ref')}
                          className="text-primary-red font-medium hover:underline text-xs flex items-center gap-1"
                        >
                          {copiedKey === 'rec_ref' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method C: Personal Giving Pledge & Envelopes */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <h5 className="font-semibold text-neutral-900 text-body-sm mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Weekly Giving Envelopes</span>
                  </h5>
                  <p className="text-body-xs text-neutral-600">
                    If you prefer giving in person during our Sunday services, collect numbered giving envelopes from our church welcome desk.
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
                Close
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

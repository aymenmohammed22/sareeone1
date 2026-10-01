import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Send, 
  QrCode, 
  Smartphone,
  ExternalLink 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareDriverAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
  driverId?: string | number;
}

export default function ShareDriverAppModal({
  isOpen,
  onClose,
  driverName = 'سائق',
  driverId
}: ShareDriverAppModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Generate the driver app sharing URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/driver${driverId ? `?ref=${driverId}` : ''}`;

  const shareText = `مرحباً، انضم إلينا كسائق توصيل وابدأ باستقبال الطلبات وتحقيق أرباح يومية مميزة! سجل الآن عبر الرابط التالي:`;
  const fullShareMessage = `${shareText}\n${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'تم النسخ بنجاح! 📋',
        description: 'تم نسخ رابط تطبيق السائق إلى الحافظة.',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast({
        title: 'فشل النسخ',
        description: 'يرجى نسخ الرابط يدوياً من الحقل أدناه.',
        variant: 'destructive',
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تطبيق السائق - انضم إلى فريق التوصيل',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed, fallback silently
      }
    } else {
      handleCopyLink();
    }
  };

  const shareViaWhatsApp = () => {
    const encodedText = encodeURIComponent(fullShareMessage);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const shareViaTelegram = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[95vw] rounded-2xl p-6 text-right" dir="rtl">
        <DialogHeader className="text-right sm:text-right space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                مشاركة تطبيق السائق
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                شارك التطبيق مع أصدقائك السائقين للانضمام إلى منصة التوصيل
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              onClick={shareViaWhatsApp}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center gap-2 py-5 rounded-xl font-medium shadow-sm transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>واتساب</span>
            </Button>

            <Button
              type="button"
              onClick={shareViaTelegram}
              className="bg-[#0088cc] hover:bg-[#0077b5] text-white flex items-center justify-center gap-2 py-5 rounded-xl font-medium shadow-sm transition-all"
            >
              <Send className="w-5 h-5" />
              <span>تيليجرام</span>
            </Button>
          </div>

          {/* Native Web Share button (Mobile / Supported browsers) */}
          {'share' in navigator && (
            <Button
              type="button"
              onClick={handleNativeShare}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-5 rounded-xl border-emerald-200 text-emerald-800 hover:bg-emerald-50 font-medium"
            >
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <span>مشاركة عبر تطبيقات الهاتف (أخرى)</span>
            </Button>
          )}

          {/* Copy Link Section */}
          <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
            <label className="text-xs font-semibold text-gray-600 block">
              رابط الانضمام المباشر:
            </label>
            <div className="flex items-center gap-2" dir="ltr">
              <Input
                readOnly
                value={shareUrl}
                className="bg-white text-xs text-gray-700 font-mono select-all h-10 border-gray-200 text-left"
              />
              <Button
                type="button"
                onClick={handleCopyLink}
                className={`shrink-0 h-10 px-4 gap-1.5 transition-all ${
                  copied 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-xs">{copied ? 'تم النسخ' : 'نسخ'}</span>
              </Button>
            </div>
          </div>

          {/* QR Code toggle */}
          <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
            <button
              type="button"
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-between text-xs font-medium text-gray-700 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>{showQR ? 'إخفاء رمز الاستجابة السريعة (QR Code)' : 'عرض رمز QR للمسح المباشر بالهاتف'}</span>
              </div>
              <span className="text-emerald-600 text-xs font-bold">
                {showQR ? 'إغلاق' : 'عرض'}
              </span>
            </button>

            {showQR && (
              <div className="mt-3 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-gray-200">
                <img
                  src={qrCodeUrl}
                  alt="QR Code رابط السائق"
                  className="w-40 h-40 object-contain rounded"
                  loading="lazy"
                />
                <p className="text-[11px] text-gray-500 mt-2 text-center">
                  امسح الرمز بكاميرا الجوال للانتقال المباشر لتطبيق السائق
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 pt-3 border-t border-gray-100 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

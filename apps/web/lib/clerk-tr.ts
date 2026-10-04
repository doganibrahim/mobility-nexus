/**
 * ErasmusMobility Custom Turkish Localization for Clerk Authentication
 */
export const clerkTrLocalization: Record<string, any> = {
  signUp: {
    start: {
      title: 'ErasmusMobility Hesabı Oluşturun',
      subtitle: 'Okul koordinatörleri ve ev sahibi kurumlar için güvenli kayıt.',
      actionText: 'Zaten bir hesabınız var mı? ',
      actionLink: 'Giriş Yap',
    },
    emailCode: {
      title: 'E-postanızı Doğrulayın',
      subtitle: 'Devam etmek için e-posta adresinize gönderilen 6 haneli kodu girin.',
      formTitle: 'Doğrulama Kodu',
      formSubtitle: 'Gelen kutunuzu kontrol edin',
      resendButton: 'Kodu Tekrar Gönder',
    },
    continue: {
      title: 'Kayıt Bilgilerini Tamamlayın',
      actionText: 'Zaten bir hesabınız var mı? ',
      actionLink: 'Giriş Yap',
    },
  },
  signIn: {
    start: {
      title: 'ErasmusMobility Girişi',
      subtitle: 'Okul veya ev sahibi kurum hesabınıza güvenle erişin.',
      actionText: 'Henüz bir hesabınız yok mu? ',
      actionLink: 'Kayıt Ol',
    },
    password: {
      title: 'Şifrenizi Girin',
      subtitle: 'Hesabınıza erişmek için şifrenizi girin.',
      actionLink: 'Şifremi Unuttum',
    },
    emailCode: {
      title: 'E-posta Doğrulaması',
      subtitle: 'Giriş yapmak için e-postanıza gönderilen kodu girin.',
    },
  },
  userProfile: {
    start: {
      headerTitle__profile: 'Profil Bilgileri',
      headerTitle__security: 'Güvenlik Ayarları',
    },
  },
  dividerText: 'veya',
  formFieldLabel__emailAddress: 'E-posta Adresi',
  formFieldInputPlaceholder__emailAddress: 'ornek@email.com',
  formFieldLabel__password: 'Şifre',
  formFieldInputPlaceholder__password: 'En az 8 karakterli şifreniz',
  formButtonPrimary: 'Devam Et',
  socialButtonsBlockButton: '{{provider}} ile Devam Et',
  footerActionLink: 'Giriş Yap',
};

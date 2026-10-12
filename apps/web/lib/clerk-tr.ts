/**
 * ErasmusMobility Custom Turkish Localization for Clerk Authentication
 */
export const clerkTrLocalization: Record<string, any> = {
  signUp: {
    start: {
      title: 'Kayıt Ol',
      subtitle: 'ErasmusMobility platformuna ücretsiz kurumsal kayıt oluşturun.',
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
      title: 'Giriş Yap',
      subtitle: 'ErasmusMobility kurumsal hesabınıza erişin.',
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
    forgotPasswordAlternativeMethods: {
      title: 'Şifre Sıfırlama',
      subtitle: 'Şifrenizi sıfırlamak için bir yöntem seçin.',
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
  formFieldInputPlaceholder__emailAddress: 'ornek@kurum.edu.tr',
  formFieldLabel__password: 'Şifre',
  formFieldInputPlaceholder__password: 'En az 8 karakterli şifreniz',
  formFieldLabel__confirmPassword: 'Şifre Tekrarı',
  formFieldInputPlaceholder__confirmPassword: 'Şifrenizi tekrar girin',
  formFieldLabel__firstName: 'Ad',
  formFieldLabel__lastName: 'Soyad',
  formFieldLabel__username: 'Kullanıcı Adı',
  formButtonPrimary: 'Devam Et',
  socialButtonsBlockButton: '{{provider}} ile Devam Et',
  footerActionText: 'Henüz hesabınız yok mu?',
  footerActionLink: 'Kayıt Ol',
  backButton: 'Geri',
};

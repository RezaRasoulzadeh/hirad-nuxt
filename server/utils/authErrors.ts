// server/utils/authErrors.ts
export function mapLoginErrorMessage(status: number, backendMessage?: string): string {
  switch (status) {
    case 400:
      return 'اطلاعات ارسال شده ناقص یا نامعتبر است.'
    case 401:
      return 'ایمیل یا رمز عبور اشتباه است.'
    case 403:
      return 'دسترسی شما به این حساب مسدود شده است.'
    case 404:
      return 'کاربری با این مشخصات یافت نشد.'
    case 406:
      return 'ایمیل یا رمز عبور اشتباه است.'
    case 422:
      return 'اطلاعات وارد شده معتبر نیست.'
    case 429:
      return 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفا کمی صبر کنید.'
    default:
      if (status >= 500) return 'خطایی در سرور رخ داد. لطفا بعدا تلاش کنید.'
      return backendMessage ?? 'ورود ناموفق بود.'
  }
}
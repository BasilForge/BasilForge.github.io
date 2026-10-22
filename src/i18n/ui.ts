export type Lang = 'en' | 'ar';

const en = {
  'nav.work': 'Work',
  'nav.lang': 'العربية',
  'nav.github': 'BasilForge on GitHub',
  'nav.discord': 'Kairos Discord server',
  'nav.home': 'BasilForge home',
  'nav.label': 'Main',
  'nav.skip': 'Skip to content',
  'footer.rights': 'Free tools, made with care.',
  'notFound.title': 'This page does not exist',
  'notFound.back': 'Back to the home page',
  download: 'Download',
  details: 'Details',
  'home.title': 'Tools I build for players',
  'home.lead': 'Free, open source Windows apps that stay out of your way while you play.',
  'home.workHeading': 'Work',
  'home.seeWork': 'See the work',
  'home.aboutHeading': 'About',
  'home.about': 'I’m BasilForge. I make the tools I want while I play: light, free, open source, and kind to your PC.',
  'home.description': 'BasilForge makes free, open source Windows tools for players, starting with Kairos, instant replay for games.',
  'page.version': 'Version',
  'page.released': 'Released',
  'page.size': 'Size',
  'page.downloads': 'Downloads',
  'page.stars': 'GitHub stars',
  'page.onGithub': 'View on GitHub',
  'page.free': 'Free and open source · Windows 10 and 11',
  'page.watch': 'See it in action',
  'page.features': 'What it does',
  'page.whatsNew': 'New in',
  'page.requirements': 'Requirements',
  'page.support': 'Help and feedback',
  'page.discord': 'Ask on Discord',
  'page.report': 'Report a problem',
  'page.security': 'Report a security issue privately',
  'page.source': 'Source code',
  'page.ctaTitle': 'Ready for your next clip?',
};

type Ui = Record<keyof typeof en, string>;

const ar: Ui = {
  'nav.work': 'الأعمال',
  'nav.lang': 'English',
  'nav.github': 'BasilForge على جيت هاب',
  'nav.discord': 'سيرفر كايروس في ديسكورد',
  'nav.home': 'الصفحة الرئيسية',
  'nav.label': 'الروابط',
  'nav.skip': 'انتقل إلى المحتوى',
  'footer.rights': 'أدوات مجانية، مصنوعة بعناية.',
  'notFound.title': 'هذه الصفحة غير موجودة',
  'notFound.back': 'ارجع إلى الصفحة الرئيسية',
  download: 'تحميل',
  details: 'التفاصيل',
  'home.title': 'أدوات أصنعها للاعبين',
  'home.lead': 'برامج مجانية ومفتوحة المصدر لويندوز، لا تزعجك وأنت تلعب.',
  'home.workHeading': 'الأعمال',
  'home.seeWork': 'شاهد الأعمال',
  'home.aboutHeading': 'من أنا',
  'home.about': 'أنا BasilForge، أصنع الأدوات التي أحتاجها وأنا ألعب: خفيفة ومجانية ومفتوحة المصدر، ولا تثقل جهازك.',
  'home.description': 'BasilForge يصنع أدوات مجانية ومفتوحة المصدر لويندوز للاعبين، أولها كايروس للإعادة الفورية في الألعاب.',
  'page.version': 'الإصدار',
  'page.released': 'تاريخ النشر',
  'page.size': 'الحجم',
  'page.downloads': 'التحميلات',
  'page.stars': 'نجوم جيت هاب',
  'page.onGithub': 'على جيت هاب',
  'page.free': 'مجاني ومفتوح المصدر · ويندوز 10 و11',
  'page.watch': 'شاهده وهو يعمل',
  'page.features': 'ماذا يقدّم',
  'page.whatsNew': 'الجديد في',
  'page.requirements': 'المتطلبات',
  'page.support': 'المساعدة والملاحظات',
  'page.discord': 'اسأل في ديسكورد',
  'page.report': 'أبلغ عن مشكلة',
  'page.security': 'أبلغ عن ثغرة أمنية بشكل خاص',
  'page.source': 'الكود المصدري',
  'page.ctaTitle': 'جاهز لمقطعك القادم؟',
};

export const ui: Record<Lang, Ui> = { en, ar };

export function t(lang: Lang): Ui {
  return ui[lang];
}

/** The same page in the given language: '/kairos/' for English, '/ar/kairos/' for Arabic. */
export function localePath(lang: Lang, path: string): string {
  return lang === 'ar' ? `/ar${path}` : path;
}

/** The twin of a page in the other language. */
export function altPath(path: string, lang: Lang): string {
  if (lang === 'ar') return path.replace(/^\/ar(?=\/)/, '');
  return localePath('ar', path);
}

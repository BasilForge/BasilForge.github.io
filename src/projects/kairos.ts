import { DISCORD_URL } from '../lib/links';
import type { Project } from './types';

const repo = 'https://github.com/BasilForge/Kairos';

export const kairos: Project = {
  slug: 'kairos',
  name: 'Kairos',
  headline: { en: 'Your best plays, saved the moment they happen.', ar: 'أفضل لقطاتك، محفوظة لحظة حدوثها.' },
  tagline: {
    en: 'Instant replay for Windows games. Press a key or say your phrase to save the last minutes. Free, open source, offline.',
    ar: 'إعادة فورية لألعاب ويندوز. اضغط زرًّا أو قل جملتك ليُحفظ آخر ما لعبته. مجاني ومفتوح المصدر ويعمل دون إنترنت.',
  },
  summary: {
    en: 'Kairos keeps the last minutes of your game ready. Press your key or say your phrase and the clip is saved, then cut it, caption it and share it without leaving the app.',
    ar: 'يحتفظ كايروس بآخر دقائق لعبك جاهزة. اضغط زرّك أو قل جملتك فيُحفظ المقطع، ثم قصّه وأضف له ترجمة وشاركه دون أن تغادر البرنامج.',
  },
  logo: '/media/kairos/logo.png',
  ogImage: '/media/kairos/og.png',
  hero: {
    image: 'status',
    alt: {
      en: 'The Kairos Status page: instant replay running, with the latest clip and screenshot',
      ar: 'صفحة الحالة في كايروس: الإعادة الفورية تعمل، مع آخر مقطع وآخر لقطة شاشة',
    },
  },
  video: { src: '/media/kairos/trailer.mp4', poster: '/media/kairos/poster.webp', width: 1920, height: 1080 },
  features: [
    {
      id: 'smart-save',
      title: { en: 'Say it, and it’s saved', ar: 'قل جملتك ويُحفظ المقطع' },
      body: {
        en: 'Record your own phrase in any language or dialect, then say it mid-game to save the last minutes. It runs offline on your PC, and the phrase inside a sentence never saves by mistake.',
        ar: 'سجّل جملتك الخاصة بأي لغة أو لهجة، ثم قلها أثناء اللعب ليُحفظ آخر ما حدث. يعمل على جهازك دون إنترنت، ولا يحفظ إذا جاءت الجملة وسط كلامك.',
      },
      image: 'smart-save',
      alt: { en: 'Smart Save: testing your recorded phrase', ar: 'الحفظ الذكي: تجربة الجملة المسجّلة' },
    },
    {
      id: 'mixer',
      title: { en: 'A mixer for every sound', ar: 'خلاط لكل صوت' },
      body: {
        en: 'A row for each source: game, Discord, music, microphone or any app, each with its own level and, if you like, its own track. SteelSeries Sonar and GoXLR are set up by themselves.',
        ar: 'صف لكل مصدر: اللعبة وديسكورد والموسيقى والميكروفون وأي تطبيق، لكلٍّ مستواه، وعلى مسار مستقل إن أردت. ويُضبط تلقائيًا مع SteelSeries Sonar وGoXLR.',
      },
      image: 'mixer',
      alt: { en: 'The Audio page with a row per sound source', ar: 'صفحة الصوت وفيها صف لكل مصدر' },
    },
    {
      id: 'camera',
      title: { en: 'Your camera over the game', ar: 'كاميرتك فوق اللعبة' },
      body: {
        en: 'Put your webcam or phone in a corner, square or round, or on top of a 9:16 picture for shorts. Kairos opens it at its sharpest size, up to 1080p.',
        ar: 'ضع كاميرا الويب أو جوالك في زاوية، مربعة أو دائرية، أو أعلى صورة 9:16 للمقاطع القصيرة. ويفتحها كايروس بأوضح دقة لها حتى 1080p.',
      },
      image: 'camera',
      alt: { en: 'The Capture page with the camera in a corner', ar: 'صفحة الالتقاط والكاميرا في الزاوية' },
    },
    {
      id: 'quality',
      title: { en: 'Automatic quality', ar: 'جودة تلقائية' },
      body: {
        en: 'Kairos picks what your PC records best with, in H.264 that plays everywhere, up to 1440p. If a game takes the graphics card, it records lighter by itself instead of stuttering.',
        ar: 'يختار كايروس أفضل ما يسجّل به جهازك، بصيغة H.264 التي تعمل في كل مكان وحتى 1440p. وإذا استهلكت اللعبة كرت الشاشة، يخفّف التسجيل بنفسه بدل أن يتقطّع.',
      },
      image: 'quality',
      alt: { en: 'The Quality page set to Automatic', ar: 'صفحة الجودة على الوضع التلقائي' },
    },
    {
      id: 'editor',
      title: { en: 'Edit without leaving', ar: 'حرّر دون أن تغادر' },
      body: {
        en: 'Cut and join parts, change speed and sound per part, add text, auto captions made on your PC, drawings and blur, and now zoom into any area of the picture.',
        ar: 'قصّ واجمع الأجزاء، وغيّر السرعة والصوت لكل جزء، وأضف نصوصًا وترجمة تلقائية تُصنع على جهازك ورسومات وتمويهًا، والآن كبّر أي منطقة من الصورة.',
      },
      image: 'editor',
      alt: { en: 'The editor with a title, captions and drawings on a VALORANT clip', ar: 'المحرّر مع عنوان وترجمة ورسومات على مقطع من فالورانت' },
    },
    {
      id: 'share',
      title: { en: 'Share in a click', ar: 'شارك بضغطة' },
      body: {
        en: 'Copy a clip made to fit Discord’s 10, 50 or 500 MB, drag it straight into a chat, or let Kairos post it to X, TikTok or Instagram for you.',
        ar: 'انسخ المقطع بحجم يناسب ديسكورد (10 أو 50 أو 500 ميقابايت)، أو اسحبه مباشرة إلى المحادثة، أو دع كايروس ينشره لك في X وتيك توك وإنستغرام.',
      },
      image: 'share',
      alt: { en: 'Copy for Discord with the size choices', ar: 'النسخ لديسكورد مع خيارات الحجم' },
    },
    {
      id: 'cloud',
      title: { en: 'Straight to your cloud', ar: 'إلى سحابتك مباشرة' },
      body: {
        en: 'Save to OneDrive, Dropbox or Google Drive in one click. OneDrive and Dropbox can free the copies on your PC.',
        ar: 'احفظ في OneDrive أو Dropbox أو Google Drive بضغطة واحدة، ويمكن لـ OneDrive وDropbox إخلاء النسخ من جهازك.',
      },
      image: 'cloud',
      alt: { en: 'The General page with the cloud choice', ar: 'الصفحة العامة مع خيار السحابة' },
    },
    {
      id: 'library',
      title: { en: 'Every clip, in order', ar: 'كل مقاطعك مرتّبة' },
      body: {
        en: 'Clips and screenshots by day and by game, a player that jumps where you click, and a size limit that moves the oldest to the Recycle Bin.',
        ar: 'المقاطع والصور حسب اليوم وحسب اللعبة، ومشغّل ينتقل حيث تضغط، وحدّ للحجم ينقل الأقدم إلى سلة المحذوفات.',
      },
      image: 'library',
      alt: { en: 'The Clips library by day and game', ar: 'مكتبة المقاطع حسب اليوم واللعبة' },
    },
  ],
  whatsNew: {
    version: '1.1',
    items: [
      { en: 'An audio mixer: a row, a level and a track for each sound.', ar: 'خلاط صوت: صف ومستوى ومسار لكل صوت.' },
      { en: 'Your camera in a corner, or over a 9:16 picture.', ar: 'كاميرتك في زاوية، أو فوق صورة 9:16.' },
      { en: 'Automatic quality that steps down by itself if frames are skipped.', ar: 'جودة تلقائية تخفّ بنفسها إذا تأخر التسجيل.' },
      { en: 'Recording always starts: if one encoder can’t, the next one records.', ar: 'التسجيل يبدأ دائمًا: إذا تعذّر مشفّر، سجّل الذي بعده.' },
      { en: 'Instant replay on your disk or in RAM, your choice: on disk, a long replay costs no memory.', ar: 'الإعادة الفورية على القرص أو في الذاكرة حسب اختيارك، وعلى القرص لا تستهلك الإعادة الطويلة ذاكرة الجهاز.' },
      { en: 'Copy sized for Discord, drag clips into Discord, save to the cloud in one click.', ar: 'نسخ بحجم ديسكورد، وسحب المقاطع إليه، وحفظ في السحابة بضغطة.' },
      { en: 'Zoom in the editor, and a smarter Smart Save.', ar: 'تكبير في المحرّر، وحفظ ذكي أذكى.' },
    ],
  },
  requirements: {
    en: 'Windows 10 (version 2004 or newer) or Windows 11, 64-bit. A graphics card with a video encoder (NVIDIA, AMD or Intel) is recommended.',
    ar: 'ويندوز 10 (الإصدار 2004 أو أحدث) أو ويندوز 11، 64 بت. ويُفضّل كرت شاشة فيه مشفّر فيديو (NVIDIA أو AMD أو Intel).',
  },
  links: {
    github: repo,
    issues: `${repo}/issues`,
    discord: DISCORD_URL,
  },
};

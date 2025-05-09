"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "rtl" | "ltr"
}

const translations = {
  ar: {
    // Auth
    login: "تسجيل الدخول",
    "login.title": "تسجيل الدخول إلى حسابك",
    "login.description": "أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    "forgot.password": "نسيت كلمة المرور؟",
    "forgot.password.title": "نسيت كلمة المرور؟",
    "forgot.password.description": "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور",
    "send.reset.link": "إرسال رابط إعادة التعيين",
    "back.to.login": "العودة إلى تسجيل الدخول",
    "check.email": "تحقق من بريدك الإلكتروني",
    "check.email.description": "لقد أرسلنا لك رابط إعادة تعيين كلمة المرور. يرجى التحقق من بريدك الإلكتروني.",

    // Dashboard

    // Dashboard
    dashboard: "لوحة التحكم",
    "news.management": "إدارة الأخبار",
    "events.management": "إدارة الفعاليات",
    "members.management": "إدارة الأعضاء",
    "user.management": "إدارة المستخدمين",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    "switch.language": "تبديل اللغة",
"add.member": "إضافة عضو",
    // Stats
    "total.news": "إجمالي الأخبار",
    "upcoming.events": "الفعاليات القادمة",
    "past.events": "الفعاليات السابقة",
    "active.users": "المستخدمين النشطين",
    "from.last.month": "من الشهر الماضي",
    "scheduled.this.week": "مجدولة هذا الأسبوع",
    "from.last.quarter": "من الربع الماضي",
    "since.last.login": "منذ آخر تسجيل دخول",

    // Content
    "content.overview": "نظرة عامة على المحتوى",
    "recent.news": "أحدث الأخبار",
    "recent.news.description": "آخر المقالات الإخبارية المنشورة",
    "upcoming.events.title": "الفعاليات القادمة",
    "upcoming.events.description": "الفعاليات المجدولة للثلاثين يومًا القادمة",

    // News
    "add.news": "إضافة خبر",
    "create.news": "إنشاء خبر جديد",
    "edit.news": "تعديل الخبر",
    "news.title": "عنوان الخبر",
    content: "المحتوى",
    "publication.date": "تاريخ النشر",
    image: "الصورة",
    "upload.image": "رفع صورة",
    "change.image": "تغيير الصورة",
    "no.image.uploaded": "لم يتم رفع صورة",
    "update.news": "تحديث الخبر",
    "create.news.button": "إنشاء الخبر",
    cancel: "إلغاء",
    "news.category": "تصنيف الخبر",
    "news.featured": "مميز",
    "news.language": "اللغة",
    "news.preview": "معاينة",
    "news.publish": "نشر",
    "news.unpublish": "إلغاء النشر",
    "news.delete": "حذف",
    "news.view": "عرض",

    // Events
    "add.event": "إضافة فعالية",
    "create.event": "إنشاء فعالية جديدة",
    "edit.event": "تعديل الفعالية",
    "event.title": "عنوان الفعالية",
    "event.date": "تاريخ الفعالية",
    "event.time": "وقت الفعالية",
    "event.type": "نوع الفعالية",
    "event.category": "تصنيف الفعالية",
    "event.featured": "مميز",
    "event.language": "اللغة",
    "event.preview": "معاينة",
    "event.publish": "نشر",
    "event.unpublish": "إلغاء النشر",
    "event.delete": "حذف",
    "event.view": "عرض",
    "event.location": "الموقع",
    location: "الموقع",
    upcoming: "قادمة",
    past: "سابقة",
    "update.event": "تحديث الفعالية",
    "create.event.button": "إنشاء الفعالية",

    // Users
    users: "المستخدمين",
    "add.user": "إضافة مستخدم",
    "create.user": "إنشاء مستخدم جديد",
    "edit.user": "تعديل المستخدم",
    name: "الاسم",
    role: "الدور",
    status: "الحالة",
    admin: "مدير",
    editor: "محرر",
    viewer: "مشاهد",
    active: "نشط",
    inactive: "غير نشط",
    "update.user": "تحديث المستخدم",
    "create.user.button": "إنشاء المستخدم",

    // Table
    actions: "الإجراءات",
    edit: "تعديل",
    delete: "حذف",
    previous: "السابق",
    next: "التالي",
    "no.news.found": "لم يتم العثور على أخبار",
    "no.events.found": "لم يتم العثور على فعاليات",
    "no.users.found": "لم يتم العثور على مستخدمين",

    // Profile
    "personal.information": "المعلومات الشخصية",
    "update.profile": "تحديث الملف الشخصي",
    "change.password": "تغيير كلمة المرور",
    "current.password": "كلمة المرور الحالية",
    "new.password": "كلمة المرور الجديدة",
    "confirm.password": "تأكيد كلمة المرور",
    "profile.picture": "الصورة الشخصية",

    // Months
    jan: "يناير",
    feb: "فبراير",
    mar: "مارس",
    apr: "أبريل",
    may: "مايو",
    jun: "يونيو",
    jul: "يوليو",
    aug: "أغسطس",
    sep: "سبتمبر",
    oct: "أكتوبر",
    nov: "نوفمبر",
    dec: "ديسمبر",

    // Misc
    by: "بواسطة",
    on: "في",
    "pick.a.date": "اختر تاريخًا",
    "select.event.type": "اختر نوع الفعالية",
    "enter.event.location": "أدخل موقع الفعالية",
    saving: "جاري الحفظ...",
    sending: "جاري الإرسال...",
    "logging.in": "جاري تسجيل الدخول...",
    required: "مطلوب",
    optional: "اختياري",
    "select.option": "اختر خيارًا",
    "search.placeholder": "بحث...",
    "filter.by": "تصفية حسب",
    "sort.by": "ترتيب حسب",
    "items.per.page": "عناصر في الصفحة",
    showing: "عرض",
    of: "من",
    items: "عناصر",
    page: "صفحة",
    "first.page": "الصفحة الأولى",
    "last.page": "الصفحة الأخيرة",
    "go.to.page": "انتقل إلى الصفحة",
    "no.results": "لا توجد نتائج",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجاح",
    warning: "تحذير",
    info: "معلومات",
    confirm: "تأكيد",
    // cancel: "إلغاء",
    close: "إغلاق",
    save: "حفظ",
    add: "إضافة",
    remove: "إزالة",
    // edit: "تعديل",
    // delete: "حذف",
    view: "عرض",
    preview: "معاينة",
    download: "تنزيل",
    upload: "رفع",
    copy: "نسخ",
    paste: "لصق",
    cut: "قص",
    undo: "تراجع",
    redo: "إعادة",
    "select.all": "تحديد الكل",
    "select.none": "إلغاء التحديد",
    select: "تحديد",
    clear: "مسح",
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    refresh: "تحديث",
    more: "المزيد",
    less: "أقل",
    "show.more": "عرض المزيد",
    "show.less": "عرض أقل",
    expand: "توسيع",
    collapse: "طي",
    details: "تفاصيل",
    summary: "ملخص",
  },
  en: {
    // Auth
    login: "Login",
    "login.title": "Login to your account",
    "login.description": "Enter your email and password to access the dashboard",
    email: "Email",
    password: "Password",
    "forgot.password": "Forgot your password?",
    "forgot.password.title": "Forgot your password?",
    "forgot.password.description": "Enter your email address and we'll send you a link to reset your password",
    "send.reset.link": "Send Reset Link",
    "back.to.login": "Back to login",
    "check.email": "Check your email",
    "check.email.description": "We've sent you a password reset link. Please check your email.",
    "members.management":"member manaement",
    // Dashboard
    dashboard: "Dashboard",
    "news.management": "News Management",
    "events.management": "Events Management",
    "user.management": "User Management",
    profile: "Profile",
    logout: "Log out",
    "switch.language": "Switch Language",

    // Stats
    "total.news": "Total News",
    "upcoming.events": "Upcoming Events",
    "past.events": "Past Events",
    "active.users": "Active Users",
    "from.last.month": "from last month",
    "scheduled.this.week": "scheduled this week",
    "from.last.quarter": "from last quarter",
    "since.last.login": "since last login",

    // Content
    "content.overview": "Content Overview",
    "recent.news": "Recent News",
    "recent.news.description": "Latest news articles published",
    "upcoming.events.title": "Upcoming Events",
    "upcoming.events.description": "Events scheduled for the next 30 days",
"add.member":"add member",
    // Members
    members:"members",

    // News
    "add.news": "Add News",
    "create.news": "Create News Article",
    "edit.news": "Edit News Article",
    "news.title": "Title",
    content: "Content",
    "publication.date": "Publication Date",
    image: "Image",
    "upload.image": "Upload Image",
    "change.image": "Change Image",
    "no.image.uploaded": "No image uploaded",
    "update.news": "Update News",
    "create.news.button": "Create News",
    cancel: "Cancel",
    "news.category": "Category",
    "news.featured": "Featured",
    "news.language": "Language",
    "news.preview": "Preview",
    "news.publish": "Publish",
    "news.unpublish": "Unpublish",
    "news.delete": "Delete",
    "news.view": "View",

    // Events
    "add.event": "Add Event",
    "create.event": "Create Event",
    "edit.event": "Edit Event",
    "event.title": "Title",
    "event.date": "Event Date",
    "event.time": "Event Time",
    "event.type": "Event Type",
    "event.category": "Category",
    "event.featured": "Featured",
    "event.language": "Language",
    "event.preview": "Preview",
    "event.publish": "Publish",
    "event.unpublish": "Unpublish",
    "event.delete": "Delete",
    "event.view": "View",
    "event.location": "Location",
    location: "Location",
    upcoming: "Upcoming",
    past: "Past",
    "update.event": "Update Event",
    "create.event.button": "Create Event",

    // Users
    users: "Users",
    "add.user": "Add User",
    "create.user": "Create User",
    "edit.user": "Edit User",
    name: "Name",
    role: "Role",
    status: "Status",
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
    active: "Active",
    inactive: "Inactive",
    "update.user": "Update User",
    "create.user.button": "Create User",

    // Table
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    previous: "Previous",
    next: "Next",
    "no.news.found": "No news articles found.",
    "no.events.found": "No events found.",
    "no.users.found": "No users found.",

    // Profile
    "personal.information": "Personal Information",
    "update.profile": "Update Profile",
    "change.password": "Change Password",
    "current.password": "Current Password",
    "new.password": "New Password",
    "confirm.password": "Confirm Password",
    "profile.picture": "Profile Picture",

    // Months
    jan: "Jan",
    feb: "Feb",
    mar: "Mar",
    apr: "Apr",
    may: "May",
    jun: "Jun",
    jul: "Jul",
    aug: "Aug",
    sep: "Sep",
    oct: "Oct",
    nov: "Nov",
    dec: "Dec",

    // Misc
    by: "By",
    on: "on",
    "pick.a.date": "Pick a date",
    "select.event.type": "Select event type",
    "enter.event.location": "Enter event location",
    saving: "Saving...",
    sending: "Sending...",
    "logging.in": "Logging in...",
    required: "Required",
    optional: "Optional",
    "select.option": "Select an option",
    "search.placeholder": "Search...",
    "filter.by": "Filter by",
    "sort.by": "Sort by",
    "items.per.page": "Items per page",
    showing: "Showing",
    of: "of",
    items: "items",
    page: "Page",
    "first.page": "First page",
    "last.page": "Last page",
    "go.to.page": "Go to page",
    "no.results": "No results",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    confirm: "Confirm",
    // cancel: "Cancel",
    close: "Close",
    save: "Save",
    add: "Add",
    remove: "Remove",
    // edit: "Edit",
    // delete: "Delete",
    view: "View",
    preview: "Preview",
    download: "Download",
    upload: "Upload",
    copy: "Copy",
    paste: "Paste",
    cut: "Cut",
    undo: "Undo",
    redo: "Redo",
    "select.all": "Select all",
    "select.none": "Select none",
    select: "Select",
    clear: "Clear",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    refresh: "Refresh",
    more: "More",
    less: "Less",
    "show.more": "Show more",
    "show.less": "Show less",
    expand: "Expand",
    collapse: "Collapse",
    details: "Details",
    summary: "Summary",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: () => {},
  t: (key: string) => key,
  dir: "rtl",
})

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")
  const dir = language === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem("uaemmaf-language") as Language | null
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }

    const htmlElement = document.documentElement
    htmlElement.lang = language
    htmlElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("uaemmaf-language", lang)
  }

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.ar] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

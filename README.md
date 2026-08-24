# Persian Booking Calendar

اپلیکیشن مدیریت رزرو فارسی و راست‌به‌چپ (RTL) با **Next.js App Router** و **TypeScript**. ساختار پروژه feature-oriented و با الهام از اصول **Feature-Sliced Design (FSD)** سازمان‌دهی شده است.

## معرفی

این پروژه یک تقویم رزرو برای مشاهده و مدیریت رویدادهای روزانه ارائه می‌کند. کاربران می‌توانند رزروها را در تقویم ببینند، رزرو جدید ایجاد کنند، رزروهای موجود را ویرایش کنند و آن‌ها را حذف کنند. رابط کاربری برای زبان فارسی و چیدمان RTL طراحی شده و منطق ارتباط با API، اعتبارسنجی، مدیریت خطا و stateهای رابط کاربری از یکدیگر جدا هستند.

## تصاویر پروژه

> برای نمایش تصاویر، فایل‌ها را در مسیرهای زیر قرار دهید:

![نمای تقویم رزرو](docs/screenshots/calendar.png)

![فرم رزرو](docs/screenshots/reservation-form.png)

- `docs/screenshots/calendar.png`: تصویر صفحه تقویم رزرو
- `docs/screenshots/reservation-form.png`: تصویر فرم ایجاد یا ویرایش رزرو

## قابلیت‌ها

- نمایش تقویم و رویدادهای رزرو
- ایجاد رزرو در `CreateReservationDrawer`
- ویرایش رزرو در `EditReservationDialog`
- حذف رزرو در `DeleteReservationDialog`
- نمایش رویدادهای یک روز در `DayEventsDialog` و `DayEventsList`
- نمایش و عملیات رویداد در `CalendarEventItem` و `CalendarEventActions`
- فرم مشترک رزرو با `reservation-form` و `reservation-datetime-field`
- اعتبارسنجی با schema و resolver
- API برای فهرست و ایجاد رزروها و عملیات روی یک رزرو مشخص
- مدیریت خطای تعارض و نگاشت خطا به پیام قابل نمایش برای کاربر
- پشتیبانی از mock development با MSW و پایگاه‌داده درون‌حافظه‌ای
- تست‌های واحد، یکپارچه و smoke برای بخش‌های اصلی

## تکنولوژی‌ها

- Next.js با App Router
- React و TypeScript
- MUI
- FullCalendar
- TanStack Query
- React Hook Form
- Zod
- MSW
- Vitest
- date-fns

## معماری و جریان داده

ساختار کد feature-oriented است و مسئولیت‌های رابط کاربری، دامنه، داده و زیرساخت تا حد امکان جدا نگه داشته شده‌اند.

جریان کلی داده به شکل زیر است:

```text
Calendar UI
   │
   ├── URL state (ناوبری تقویم)
   ├── TanStack Query hooks
   │      └── reservation keys / query cache
   ├── repository / API client / http-client
   │      └── Next.js Route Handlers
   └── domain + validation + error mapping
```

- **Server/query state:** داده‌های رزرو و وضعیت درخواست‌ها با TanStack Query و hookهای رزرو مدیریت می‌شوند.
- **URL state:** وضعیت ناوبری تقویم در URL نگه داشته می‌شود تا تغییر بازه یا مسیر قابل اشتراک و بازیابی باشد.
- **Local UI state:** باز و بسته بودن drawerها و dialogها و وضعیت‌های موقتی فرم در لایه رابط کاربری مدیریت می‌شود.
- جهش‌های داده پس از تأیید سرور انجام می‌شوند؛ در وضعیت فعلی رابط کاربری، برای mutationها از optimistic update استفاده نشده است.

## ساختار پروژه

درخت زیر نمایی مفهومی و منطبق با بخش‌های اصلی موجود در `src-(3).zip` است؛ جزئیات کم‌اهمیت برای خوانایی حذف شده‌اند:

```text
.
├── src
│   ├── app
│   │   ├── api
│   │   │   └── reservations
│   │   │       └── [id]
│   │   └── calendar
│   ├── features
│   │   └── reservations
│   │       ├── api
│   │       ├── components
│   │       │   ├── CalendarEventActions
│   │       │   ├── CalendarEventItem
│   │       │   ├── CreateReservationDrawer
│   │       │   ├── DayEventsDialog
│   │       │   ├── DayEventsList
│   │       │   ├── DeleteReservationDialog
│   │       │   ├── EditReservationDialog
│   │       │   ├── reservation-datetime-field
│   │       │   └── reservation-form
│   │       ├── hooks
│   │       │   ├── use-create
│   │       │   ├── use-delete
│   │       │   ├── use-reservations
│   │       │   └── use-update
│   │       ├── keys
│   │       │   └── reservation-keys
│   │       ├── validation
│   │       └── domain
│   │           └── conflict
│   ├── shared
│   │   ├── api
│   │   │   ├── http-client
│   │   │   └── repository
│   │   ├── date-utils
│   │   ├── reservation-datetime
│   │   └── error-message-mapping
│   ├── mocks
│   │   ├── browser
│   │   ├── handlers
│   │   └── mock-db
│   └── tests
│       ├── calendar-mappers
│       ├── reservation-api
│       ├── reservation-domain
│       ├── reservation-form
│       ├── reservation-mutation-error
│       ├── reservation-mutations
│       └── smoke
├── docs
│   └── screenshots
│       ├── calendar.png
│       └── reservation-form.png
├── package.json
└── README-persian-booking-calendar.md
```

> نام‌گذاری دقیق پوشه‌ها و فایل‌های جزئی ممکن است به سازمان‌دهی نهایی پروژه وابسته باشد؛ `package.json` و سورس پروژه مرجع نهایی اجرای دستورات هستند.

## شروع سریع

### پیش‌نیازها

- Node.js نسخه LTS
- npm

### نصب و اجرا

```bash
npm install
npm run dev
```

سپس برنامه را در آدرس زیر باز کنید:

```text
http://localhost:3000/calendar
```

## اسکریپت‌ها

اسکریپت‌های قابل استفاده باید از `package.json` خوانده شوند؛ `package.json` منبع نهایی و معتبر تعریف دستورات است.

دستورات رایج پروژه عبارت‌اند از:

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run typecheck
```

> فقط اسکریپت‌هایی را اجرا کنید که در `package.json` تعریف شده‌اند. وجود `typecheck` نیز باید در همان فایل بررسی شود و نباید صرفاً بر اساس این README فرض شود.

## API endpoints

Route Handlerهای مربوط به رزرو در مسیرهای زیر قرار دارند:

| متد | مسیر | کاربرد |
|---|---|---|
| `GET` | `/api/reservations` | دریافت فهرست رزروها |
| `POST` | `/api/reservations` | ایجاد رزرو جدید |
| `PATCH` | `/api/reservations/[id]` | ویرایش رزرو، مطابق Route Handler پروژه |
| `DELETE` | `/api/reservations/[id]` | حذف رزرو مشخص |

جزئیات دقیق payload، پاسخ‌ها و قرارداد خطا باید از Route Handlerها و لایه repository/API پروژه استخراج شود؛ مدل مفهومی این README جایگزین قرارداد API نیست.

## مدل مفهومی Reservation

برای توضیح دامنه، یک رزرو به‌صورت مفهومی شامل فیلدهای زیر است:

- `title`: عنوان رزرو
- `customerName`: نام مشتری
- `resourceId`: شناسه منبع
- `start`: زمان شروع
- `end`: زمان پایان
- `status`: وضعیت رزرو

این فهرست **نمای مفهومی** است و قرارداد دقیق request/response یا نام‌گذاری نهایی فیلدها محسوب نمی‌شود.

## اعتبارسنجی و تعارض رزرو

ورودی فرم با schema و resolver اعتبارسنجی می‌شود و تبدیل و مدیریت تاریخ/زمان در utilityهای مرتبط با `reservation-datetime` و `date-utils` انجام می‌گیرد. منطق دامنه تعارض رزروها در بخش `conflict` قرار دارد.

در صورت تشخیص تعارض، API می‌تواند پاسخ HTTP `409 Conflict` برگرداند. این خطا در لایه نگاشت پیام به یک پیام فارسی قابل نمایش برای کاربر تبدیل می‌شود؛ برای نمونه:

> این بازه زمانی با یک رزرو موجود تداخل دارد. لطفاً زمان دیگری انتخاب کنید.

پیام و جزئیات نهایی پاسخ باید با قرارداد Route Handler و نگاشت خطای موجود در پروژه هماهنگ بماند.

## مدیریت state

- **Server/query state:** رزروها، cache و وضعیت درخواست‌ها با TanStack Query، hookهای `use-reservations`، `use-create`، `use-update` و `use-delete` و همچنین `reservation-keys` مدیریت می‌شوند.
- **URL state:** ناوبری تقویم و تغییر بازه از طریق state موجود در URL انجام می‌شود.
- **Local UI state:** dialogها، drawerها، انتخاب رویداد و وضعیت‌های کوتاه‌مدت رابط کاربری در کامپوننت‌ها نگه داشته می‌شوند.

Mutationها server-confirmed هستند؛ یعنی رابط کاربری به‌صورت فعلی پیش از تأیید سرور، تغییر optimistic اعمال نمی‌کند.

## Mock development

برای توسعه و اجرای مستقل رابط کاربری، MSW با handlerهای مرورگر و `mock-db` درون‌حافظه‌ای استفاده می‌شود. این داده‌ها برای توسعه و تست مناسب‌اند و با راه‌اندازی مجدد برنامه پایدار نمی‌مانند.

## تست

تست‌های پروژه بخش‌های زیر را پوشش می‌دهند:

- نگاشت داده‌های تقویم (`calendar-mappers`)
- API رزرو (`reservation-api`)
- منطق دامنه (`reservation-domain`)
- فرم رزرو (`reservation-form`)
- نمایش خطای mutation (`reservation-mutation-error`)
- mutationهای رزرو (`reservation-mutations`)
- smoke test

دستور اجرای تست را از `package.json` بررسی کنید؛ معمولاً نقطه شروع آن `npm run test` است.

## تصمیم‌های معماری

- سازمان‌دهی feature-oriented برای نزدیک نگه‌داشتن UI، منطق دامنه و عملیات داده مرتبط
- استفاده از repository و http client برای جدا کردن feature از جزئیات transport
- استفاده از TanStack Query برای server state و cache
- استفاده از فرم مشترک برای جلوگیری از تکرار منطق ایجاد و ویرایش
- server-confirmed mutations و نبود optimistic update در UI فعلی
- جداسازی منطق تعارض، validation و نگاشت پیام خطا
- نگهداری ناوبری تقویم در URL برای قابلیت بازیابی state

## دسترس‌پذیری و RTL

رابط کاربری برای فارسی و RTL طراحی شده است. در توسعه یا تغییر کامپوننت‌ها باید ترتیب منطقی tab، برچسب‌گذاری کنترل‌ها، فوکوس dialog و drawer، پیام‌های خطا و کنتراست رنگ‌ها حفظ و با ابزارهای دسترس‌پذیری بررسی شوند.

## محدودیت نسخه Demo

`mock-db` یک پایگاه‌داده in-memory است؛ بنابراین داده‌ها با restart شدن برنامه ماندگار نیستند و این پیاده‌سازی به‌تنهایی برای production persistence مناسب نیست.

## Production Notes

برای استفاده production، موارد زیر باید متناسب با نیاز محصول تکمیل شوند:

- اتصال repository به backend و persistence واقعی
- احراز هویت و مجوز دسترسی
- تصمیم و قرارداد روشن برای timezone و ذخیره‌سازی تاریخ/زمان
- اجرای lint، typecheck، test و build در CI
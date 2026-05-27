/** 手机端 Header 占用高度（Menu + 搜索 + Pills） */
export const HOME_MOBILE_HEADER_OFFSET = "pt-[168px] md:pt-[188px]";

export const HOME_HERO_INTRO = [
  "relative z-10 w-full bg-white px-4 pb-3",
  HOME_MOBILE_HEADER_OFFSET,
  "md:mx-auto md:max-w-[1120px] md:bg-transparent md:px-6 md:pb-5",
].join(" ");

export const HOME_HERO_TITLE =
  "text-[26px] font-normal leading-[1.15] tracking-tight text-gray-900 md:text-[34px] md:text-white";

export const HOME_HERO_SUBTITLE =
  "mt-1 text-[14px] font-normal leading-snug text-gray-700 md:mt-0.5 md:text-[15px] md:text-white md:opacity-95";

export const HOME_GUEST_SECTION =
  "mb-3 hidden text-gray-900 md:mb-5 md:block md:text-white";

export const HOME_SALE_GRID =
  "grid grid-cols-1 gap-0 sm:mx-auto sm:max-w-[1120px] sm:grid-cols-2 sm:gap-[18px] sm:px-6";

export const HOME_PAGE_BOTTOM = "pb-20 sm:pb-24";

/** 手机端丛林背景高度（仅覆盖 Header 区域） */
export const HOME_MOBILE_JUNGLE_HEIGHT = "max-md:h-[252px]";

export const HOME_SALE_CARD_ASPECT =
  "relative aspect-[390/220] w-full sm:aspect-[760/257]";

export const HOME_SALE_CARD_IMAGE =
  "absolute inset-0 h-full w-full object-cover object-left sm:object-center";

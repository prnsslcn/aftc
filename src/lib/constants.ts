export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeMWuAgbIi8-xprEo0Sv8G3M-xTmGLZXwNMyYq3KDeMJooAiQ/viewform";

export const CONTACT = {
  name: "박노훈",
  phone: "010-5192-0332",
  location: "아세아항공직업전문학교",
};

export const NAV_ITEMS = [
  { label: "교육원 소개", href: "#intro", active: true },
  { label: "비행 유학 사전교육", href: "#programs", active: true },
  { label: "비행학교", href: "/#", active: false },
  { label: "항공사 입사과정", href: "/#", active: false },
];

export const GROUND_SCHOOL = [
  "FAR Introduction",
  "Aerodynamics",
  "Aircraft System",
  "Aircraft Instrument",
  "Airport & Airport Operation",
  "Airspace",
  "Navigation",
  "Performance",
  "Weight & Balance",
  "Aviation Weather",
  "Aviation Weather Service",
  "Aeromedical & Night Operation",
  "Safety of Flight",
];

export const FTD_TRAINING = [
  "Checklist & Procedure",
  "Maneuvers & Navigation",
  "Instrument Interpretation",
];

export const COURSE_4W = {
  badge: "4주 집중 과정",
  title: "비행 유학 사전교육",
  description:
    "미국 비행학교 입교 예정자를 위한 4주 집중 과정. 단기간 내 핵심 이론과 FTD 실습을 완료합니다.",
  rows: [
    { label: "교육 대상", value: "미국 비행학교 입교 예정자" },
    { label: "교육 기간", value: "4주 집중 과정" },
    { label: "교육 시간", value: "총 80시간 (이론 72시간 / 시뮬레이터 8시간)" },
    { label: "개강", value: "2026년 중" },
    { label: "교육 장소", value: "아세아항공직업전문학교 (강의실 / C172 FTD 실습실)" },
  ],
  cost: "50만원",
  costNote: "(C172 FTD 비용 포함)",
};

export const COURSE_8W = {
  badge: "8주 과정",
  title: "Embry-Riddle 연계과정",
  description:
    "미국 대학교 항공운항학과 입학 예정자를 위한 8주 과정. 영어 교육(Essay 작성 등)이 포함됩니다.",
  highlight: "Embry-Riddle 연계",
  rows: [
    { label: "교육 대상", value: "미국 대학교 항공운항학과 입학 예정자" },
    { label: "교육 기간", value: "8주 과정" },
    { label: "교육 시간", value: "총 160시간 (이론 140시간 / FTD 20시간)" },
    { label: "개강", value: "2026년 5월 개강 확정", highlight: true },
    { label: "교육 장소", value: "아세아항공직업전문학교 (강의실 / C172 FTD 실습실)" },
  ],
  cost: "90만원",
  costNote: "(C172 FTD 비용 포함)",
  footnote: "* Embry-Riddle Aeronautical University 신입생과 함께 진행",
};

export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeMWuAgbIi8-xprEo0Sv8G3M-xTmGLZXwNMyYq3KDeMJooAiQ/viewform";

export const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSeMWuAgbIi8-xprEo0Sv8G3M-xTmGLZXwNMyYq3KDeMJooAiQ/formResponse";

export const FORM_ENTRIES = {
  name: "entry.826355120",
  phone: "entry.1149713456",
  email: "entry.245385898",
  status: "entry.1212825914",
  plan: "entry.1290620365",
  school: "entry.476526749",
  english: "entry.886453069",
  experience: "entry.843615978",
  inquiry: "entry.1138392509",
} as const;

export const CONTACT = {
  phone: "02-717-8811",
  location: "아세아항공직업전문학교",
};

export const NAV_ITEMS = [
  { label: "교육원 소개", href: "#intro", active: true },
  { label: "통합 프로그램", href: "#pipeline", active: true },
  { label: "비행 유학 사전교육", href: "#programs", active: true },
  { label: "비행학교", href: "#flight-school", active: true },
  { label: "항공사 입사과정", href: "#airline-prep", active: true },
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

export const PIPELINE_STEPS = [
  { label: "유학 상담", sub: "1:1 개별상담 / 비행학교 선택" },
  { label: "입교 준비", sub: "I-20 발급 / 비자발급" },
  { label: "사전교육", sub: "항공기초이론 / C172 FTD실습" },
  { label: "출국", sub: "면장 취득 / 1500/1000/300hr" },
  { label: "항공사 공채 준비", sub: "국내외 공채 준비" },
  { label: "항공사 취업", sub: "" },
];

export const FLIGHT_SCHOOL_COURSES = [
  { name: "PPL", hours: 75, months: "6", cost: "$40,000" },
  { name: "IR", hours: 45, months: "3", cost: "$20,000" },
  { name: "CPL(Single)", hours: 60, months: "3", cost: "$30,000" },
  { name: "CPL(Multi)", hours: 20, months: "2", cost: "$20,000" },
  { name: "CFI", hours: 30, months: "5", cost: "$20,000" },
  { name: "CFII", hours: 10, months: "1", cost: "$5,000" },
];

export const FLIGHT_SCHOOLS = [
  { name: "Hillsboro Aero Academy" },
  { name: "AeroGuard Flight Training Center" },
  { name: "Phoenix East Aviation" },
];

export const AIRLINE_PREP_POINTS = [
  "1:1 혹은 2:1의 개별 코칭 교육",
  "스터디 지원",
  "저렴한 가격으로 A320, B737 FTD 교육",
  "필기 시험, 실기 시험, 면접까지 전형 전과정 교육",
  "필기 출제 평가 경력, 실기시험 평가경력, 면접 경력 보유한 강사진",
];

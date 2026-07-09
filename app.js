const initPurinCalendar = () => {
const createCalendarDate = ({ year, month, day }) => new Date(year, month - 1, day);

const purinBirthDate = createCalendarDate({ year: 2026, month: 1, day: 28 });
const defaultSolidStartDate = createCalendarDate({ year: 2026, month: 1, day: 28 + 179 });

const mealPlanBySolidDay = {
  1: { menu: '쌀미음', status: 'new', label: '쌀 1/3', ingredient: '쌀', note: '오전 시간에 1~2스푼으로 시작해요.', trialId: 'rice', trialDay: 1, trialLength: 3 },
  2: { menu: '쌀미음', status: 'observe', label: '쌀 2/3', ingredient: '쌀', note: '전날과 같은 재료로 반응을 살펴봐요.', trialId: 'rice', trialDay: 2, trialLength: 3 },
  3: { menu: '쌀미음', status: 'passed', label: '쌀 3/3', ingredient: '쌀', note: '특이 반응이 없으면 기본 베이스로 사용할 수 있어요.', trialId: 'rice', trialDay: 3, trialLength: 3 },
  4: { menu: '소고기', status: 'new', label: '소고기 1/3', ingredient: '소고기', note: '쌀미음에 잘 익힌 소고기를 곱게 갈아 소량 섞어요.', trialId: 'beef', trialDay: 1, trialLength: 3 },
  5: { menu: '소고기', status: 'observe', label: '소고기 2/3', ingredient: '소고기', note: '같은 재료를 유지하면서 피부, 구토, 컨디션 변화를 기록해요.', trialId: 'beef', trialDay: 2, trialLength: 3 },
  6: { menu: '소고기', status: 'passed', label: '소고기 3/3', ingredient: '소고기', note: '문제 없이 지나가면 단백질 베이스 후보로 저장해요.', trialId: 'beef', trialDay: 3, trialLength: 3 },
  9: { menu: '애호박', status: 'new', label: '애호박 1/3', ingredient: '애호박', note: '새 채소는 쌀미음에 소량 섞어 도입해요.', trialId: 'zucchini', trialDay: 1, trialLength: 3 },
  10: { menu: '애호박', status: 'observe', label: '애호박 2/3', ingredient: '애호박', note: '같은 재료를 반복해 컨디션 변화를 확인해요.', trialId: 'zucchini', trialDay: 2, trialLength: 3 },
  11: { menu: '애호박', status: 'passed', label: '애호박 3/3', ingredient: '애호박', note: '특이 반응이 없으면 통과 재료로 표시해요.', trialId: 'zucchini', trialDay: 3, trialLength: 3 },
  15: { menu: '달걀 노른자', status: 'new', label: '노른자 1/3', ingredient: '달걀 노른자', note: '알레르기 관찰을 위해 낮 시간에 아주 소량으로 시작해요.', trialId: 'egg-yolk', trialDay: 1, trialLength: 3 },
  16: { menu: '달걀 노른자', status: 'observe', label: '노른자 2/3', ingredient: '달걀 노른자', note: '두드러기, 구토, 호흡 증상 등 이상 반응을 살펴봐요.', trialId: 'egg-yolk', trialDay: 2, trialLength: 3 },
  17: { menu: '달걀 노른자', status: 'passed', label: '노른자 3/3', ingredient: '달걀 노른자', note: '문제 없이 지나가면 유지 노출 후보로 표시해요.', trialId: 'egg-yolk', trialDay: 3, trialLength: 3 },
};

const getRequiredElement = (selector) => {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`필수 달력 요소를 찾을 수 없습니다: ${selector}`);
  }

  return element;
};

const calendar = getRequiredElement('#meal-calendar');
const monthLabel = getRequiredElement('#month-label');
const babyAgeToday = getRequiredElement('#baby-age-today');
const todayLabel = getRequiredElement('#today-label');
const startDateInput = getRequiredElement('#solid-start-date');
const solidStartSummary = getRequiredElement('#solid-start-summary');
const dayDetailTitle = getRequiredElement('#day-detail-title');
const dayDetail = getRequiredElement('#day-detail');
const prevMonthButton = getRequiredElement('#prev-month');
const nextMonthButton = getRequiredElement('#next-month');
const currentMonthButton = getRequiredElement('#current-month');

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const toInputDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromInputDateValue = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

let visibleMonth = startOfDay(new Date());
let selectedDate = startOfDay(new Date());
let solidStartDate = startOfDay(defaultSolidStartDate);

const getDayDiff = (fromDate, toDate) => Math.floor((startOfDay(toDate) - startOfDay(fromDate)) / 86400000);
const getBabyDay = (date) => getDayDiff(purinBirthDate, date) + 1;
const getSolidDay = (date) => getDayDiff(solidStartDate, date) + 1;

const formatKoreanDate = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);

const getMealNote = (date) => {
  const solidDay = getSolidDay(date);

  if (solidDay < 1) {
    const daysLeft = Math.abs(solidDay) + 1;
    return {
      menu: `이유식 시작 ${daysLeft}일 전`,
      status: 'waiting',
      label: '시작 전',
      ingredient: '준비',
      note: '수유 리듬, 이유식 도구, 알레르기 관찰 기준을 미리 준비해요.',
    };
  }

  return mealPlanBySolidDay[solidDay] ?? {
    menu: '쉬는 날',
    status: 'planned',
    label: '예정',
    ingredient: '통과 재료',
    note: '새 재료 테스트를 쉬고, 이미 통과한 재료로 편하게 먹는 날이에요.',
  };
};

const renderStartSummary = () => {
  solidStartSummary.textContent = `${formatKoreanDate(solidStartDate)} · D+${getBabyDay(solidStartDate)} 시작`;
};

const renderDayDetail = (date = selectedDate) => {
  const note = getMealNote(date);
  const solidDay = getSolidDay(date);
  const solidDayText = note.trialId
    ? `${note.ingredient} 테스트 ${note.trialDay}/${note.trialLength}`
    : solidDay > 0
      ? '테스트 쉬는 날'
      : `시작 ${Math.abs(solidDay) + 1}일 전`;

  dayDetailTitle.textContent = formatKoreanDate(date);
  dayDetail.innerHTML = `
    <div class="detail-meta">
      <span>D+${getBabyDay(date)}</span>
      <span>${solidDayText}</span>
    </div>
    <div class="detail-menu-card ${note.status}">
      <span class="tag ${note.status}">${note.label}</span>
      <strong>${note.menu}</strong>
      <p>${note.note}</p>
    </div>
    <dl class="detail-list">
      <div>
        <dt>대표 식재료</dt>
        <dd>${note.ingredient}</dd>
      </div>
      <div>
        <dt>다음 액션</dt>
        <dd>${note.status === 'waiting' ? '시작일 전 준비물을 확인해요.' : '섭취량, 반응, 컨디션을 기록할 수 있게 확장할 예정이에요.'}</dd>
      </div>
    </dl>
    <button class="primary-action" type="button">식재료 바꾸기 준비 중</button>
  `;
};

const renderMonthlyCalendar = () => {
  const today = startOfDay(new Date());
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingEmptyDays = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  monthLabel.textContent = `${year}년 ${month + 1}월`;
  babyAgeToday.textContent = `D+${getBabyDay(today)}`;
  todayLabel.textContent = `${formatKoreanDate(today)} 기준`;

  const blanks = Array.from({ length: leadingEmptyDays }, () => '<div class="day-card is-empty" aria-hidden="true"></div>');
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month, day);
    const babyDay = getBabyDay(date);
    const note = getMealNote(date);
    const isToday = date.getTime() === today.getTime();
    const isSelected = date.getTime() === selectedDate.getTime();
    const inputValue = toInputDateValue(date);

    const sequenceClass = note.trialId ? `has-sequence is-sequence-${note.trialDay === 1 ? 'start' : note.trialDay === note.trialLength ? 'end' : 'middle'} sequence-${note.trialId}` : '';

    return `
      <button class="day-card ${sequenceClass} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" type="button" data-date="${inputValue}" aria-label="${month + 1}월 ${day}일, D+${babyDay}, ${note.menu}">
        <span class="day-number">
          <span>${day}</span>
          ${isToday ? '<span class="today-pill">오늘</span>' : ''}
        </span>
        <span class="baby-day">D+${babyDay}</span>
        <span class="menu">${note.menu}</span>
        <span class="tag ${note.status}">${note.label}</span>
      </button>
    `;
  });

  calendar.innerHTML = [...blanks, ...days].join('');
};

const render = () => {
  renderStartSummary();
  renderMonthlyCalendar();
  renderDayDetail();
};

calendar.addEventListener('click', (event) => {
  const card = event.target.closest('[data-date]');
  if (!card) return;

  selectedDate = fromInputDateValue(card.dataset.date);
  render();
});

prevMonthButton.addEventListener('click', () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderMonthlyCalendar();
});

nextMonthButton.addEventListener('click', () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderMonthlyCalendar();
});

currentMonthButton.addEventListener('click', () => {
  visibleMonth = startOfDay(new Date());
  selectedDate = startOfDay(new Date());
  render();
});

startDateInput.value = toInputDateValue(solidStartDate);
startDateInput.addEventListener('change', (event) => {
  solidStartDate = startOfDay(fromInputDateValue(event.target.value));
  selectedDate = solidStartDate;
  visibleMonth = new Date(solidStartDate.getFullYear(), solidStartDate.getMonth(), 1);
  render();
});

render();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPurinCalendar);
} else {
  initPurinCalendar();
}

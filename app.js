const purinBirthDate = new Date(2026, 0, 28);
const defaultSolidStartDate = new Date(2026, 0, 28 + 179);

const mealPlanBySolidDay = {
  1: { menu: '쌀미음 1~2스푼', status: 'new', label: '신규', ingredient: '쌀', note: '오전 시간에 소량으로 시작해요.' },
  2: { menu: '쌀미음', status: 'observe', label: '관찰', ingredient: '쌀', note: '전날과 같은 재료로 반응을 살펴봐요.' },
  3: { menu: '쌀미음', status: 'passed', label: '통과', ingredient: '쌀', note: '특이 반응이 없으면 기본 베이스로 사용할 수 있어요.' },
  5: { menu: '쌀미음 · 애호박', status: 'new', label: '신규', ingredient: '애호박', note: '새 채소는 쌀미음에 소량 섞어 도입해요.' },
  6: { menu: '애호박 관찰식', status: 'observe', label: '관찰', ingredient: '애호박', note: '같은 재료를 반복해 컨디션 변화를 확인해요.' },
  8: { menu: '쌀미음 · 감자', status: 'new', label: '신규', ingredient: '감자', note: '새 재료는 한 번에 하나씩 도입해요.' },
  11: { menu: '소고기 소량', status: 'new', label: '신규', ingredient: '소고기', note: '철분 보충을 위해 잘 갈아 소량으로 시작해요.' },
  12: { menu: '소고기 관찰식', status: 'observe', label: '관찰', ingredient: '소고기', note: '반응과 소화 상태를 기록해요.' },
  15: { menu: '쌀 · 애호박 · 소고기', status: 'passed', label: '통과', ingredient: '조합식', note: '통과한 재료끼리 조합해요.' },
  18: { menu: '달걀 노른자 소량', status: 'new', label: '신규', ingredient: '달걀 노른자', note: '알레르기 관찰을 위해 낮 시간에 아주 소량으로 시작해요.' },
  19: { menu: '달걀 노른자 관찰식', status: 'observe', label: '관찰', ingredient: '달걀 노른자', note: '두드러기, 구토, 호흡 증상 등 이상 반응을 살펴봐요.' },
  22: { menu: '닭고기 · 단호박', status: 'new', label: '신규', ingredient: '닭고기', note: '단백질 재료는 충분히 익혀 곱게 갈아요.' },
  25: { menu: '통과 재료 조합식', status: 'passed', label: '통과', ingredient: '조합식', note: '통과한 재료를 주기적으로 다시 노출해요.' },
};

const calendar = document.querySelector('#meal-calendar');
const monthLabel = document.querySelector('#month-label');
const babyAgeToday = document.querySelector('#baby-age-today');
const todayLabel = document.querySelector('#today-label');
const startDateInput = document.querySelector('#solid-start-date');
const solidStartSummary = document.querySelector('#solid-start-summary');
const dayDetailTitle = document.querySelector('#day-detail-title');
const dayDetail = document.querySelector('#day-detail');
const prevMonthButton = document.querySelector('#prev-month');
const nextMonthButton = document.querySelector('#next-month');
const currentMonthButton = document.querySelector('#current-month');

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
    menu: '식단 계획',
    status: 'planned',
    label: '예정',
    ingredient: '미정',
    note: '통과한 재료와 신규 테스트 슬롯을 기준으로 식단을 채울 수 있어요.',
  };
};

const renderStartSummary = () => {
  solidStartSummary.textContent = `${formatKoreanDate(solidStartDate)} · 생후 ${getBabyDay(solidStartDate)}일차 시작`;
};

const renderDayDetail = (date = selectedDate) => {
  const note = getMealNote(date);
  const solidDay = getSolidDay(date);
  const solidDayText = solidDay > 0 ? `이유식 ${solidDay}일차` : `시작 ${Math.abs(solidDay) + 1}일 전`;

  dayDetailTitle.textContent = formatKoreanDate(date);
  dayDetail.innerHTML = `
    <div class="detail-meta">
      <span>생후 ${getBabyDay(date)}일차</span>
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
  babyAgeToday.textContent = `생후 ${getBabyDay(today)}일차`;
  todayLabel.textContent = `${formatKoreanDate(today)} 기준`;

  const blanks = Array.from({ length: leadingEmptyDays }, () => '<div class="day-card is-empty" aria-hidden="true"></div>');
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month, day);
    const babyDay = getBabyDay(date);
    const solidDay = getSolidDay(date);
    const note = getMealNote(date);
    const isToday = date.getTime() === today.getTime();
    const isSelected = date.getTime() === selectedDate.getTime();
    const inputValue = toInputDateValue(date);

    return `
      <button class="day-card ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" type="button" data-date="${inputValue}" aria-label="${month + 1}월 ${day}일, 생후 ${babyDay}일차, ${note.menu}">
        <span class="day-number">
          <span>${day}</span>
          ${isToday ? '<span class="today-pill">오늘</span>' : ''}
        </span>
        <span class="baby-day">생후 ${babyDay}일차</span>
        <span class="solid-day">${solidDay > 0 ? `이유식 ${solidDay}일차` : `D-${Math.abs(solidDay) + 1}`}</span>
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

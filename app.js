const purinBirthDate = new Date(2026, 0, 28);

const monthlyMealNotes = {
  2: { menu: '쌀미음 · 애호박', status: 'passed', label: '통과' },
  4: { menu: '소고기 소량', status: 'new', label: '신규' },
  5: { menu: '소고기 관찰식', status: 'observe', label: '관찰' },
  8: { menu: '감자 · 브로콜리', status: 'passed', label: '통과' },
  11: { menu: '달걀 노른자 소량', status: 'new', label: '신규' },
  12: { menu: '달걀 관찰식', status: 'observe', label: '관찰' },
  15: { menu: '닭고기 · 단호박', status: 'passed', label: '통과' },
  18: { menu: '두부 소량', status: 'new', label: '신규' },
  19: { menu: '두부 관찰식', status: 'observe', label: '관찰' },
  22: { menu: '통과 재료 조합식', status: 'passed', label: '통과' },
  25: { menu: '흰살생선 소량', status: 'new', label: '신규' },
  26: { menu: '생선 관찰식', status: 'observe', label: '관찰' },
};

const calendar = document.querySelector('#meal-calendar');
const monthLabel = document.querySelector('#month-label');
const babyAgeToday = document.querySelector('#baby-age-today');
const todayLabel = document.querySelector('#today-label');

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getBabyDay = (date) => {
  const diffMs = startOfDay(date) - startOfDay(purinBirthDate);
  return Math.floor(diffMs / 86400000) + 1;
};

const formatKoreanDate = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);

const renderMonthlyCalendar = () => {
  const today = startOfDay(new Date());
  const year = today.getFullYear();
  const month = today.getMonth();
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
    const note = monthlyMealNotes[day] ?? { menu: '식단 계획', status: 'planned', label: '예정' };
    const isToday = date.getTime() === today.getTime();

    return `
      <article class="day-card ${isToday ? 'is-today' : ''}" aria-label="${month + 1}월 ${day}일, 생후 ${babyDay}일차, ${note.menu}">
        <div class="day-number">
          <span>${day}</span>
          ${isToday ? '<span class="today-pill">오늘</span>' : ''}
        </div>
        <p class="baby-day">생후 ${babyDay}일차</p>
        <p class="menu">${note.menu}</p>
        <span class="tag ${note.status}">${note.label}</span>
      </article>
    `;
  });

  calendar.innerHTML = [...blanks, ...days].join('');
};

renderMonthlyCalendar();

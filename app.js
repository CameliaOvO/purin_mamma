const mealPlan = [
  { day: '월', menu: '쌀미음 · 애호박', status: 'passed', label: '통과' },
  { day: '화', menu: '쌀미음 · 소고기', status: 'new', label: '신규' },
  { day: '수', menu: '소고기 관찰식', status: 'observe', label: '관찰' },
  { day: '목', menu: '감자 · 브로콜리', status: 'passed', label: '통과' },
  { day: '금', menu: '달걀 노른자 소량', status: 'new', label: '신규' },
  { day: '토', menu: '달걀 관찰식', status: 'observe', label: '관찰' },
  { day: '일', menu: '통과 재료 조합식', status: 'passed', label: '통과' },
];

const calendar = document.querySelector('#meal-calendar');

calendar.innerHTML = mealPlan
  .map(
    (meal) => `
      <article class="day-card">
        <div class="day-number">
          <span>${meal.day}</span>
          <span class="tag ${meal.status}">${meal.label}</span>
        </div>
        <p class="menu">${meal.menu}</p>
      </article>
    `,
  )
  .join('');

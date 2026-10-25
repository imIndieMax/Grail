const mainScreen = document.getElementById('main-screen');
const memoryScreen = document.getElementById('memory-screen');
const memTitle = document.getElementById('mem-title');
const memText = document.getElementById('mem-text');
const dimLayer = document.getElementById('dimLayer');

// Словарь персонажей: латинское имя (для имени файла) -> отображаемое имя
const CHARACTERS = {
	Cherv: 'Червь',
	Beor: 'Беор',
	Ayley: 'Айлей',
	Niav: 'Ниав',
  // добавляй новых персонажей сюда — одной строкой
};

// Читаем параметр char из адресной строки: ?char=Niav
function getCharacterKey() {
  const params = new URLSearchParams(window.location.search);
  return params.get('char');
}

function createGrid(containerId, nameLatin, nameDisplay) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.textContent = String(i);
    btn.addEventListener('click', () => handleMemory(nameLatin, nameDisplay, i));
    container.appendChild(btn);
  }
}

function initPage() {
  const key = getCharacterKey();
  const display = CHARACTERS[key];

  if (!display) {
    // Незнакомый (или пустой) параметр — показываем аккуратное сообщение
    document.getElementById('char-heading').textContent = 'Персонаж не найден';
    return;
  }

  // Подставляем имя в заголовок вкладки и в h2
  document.title = `Воспоминания ${display}`;
  document.getElementById('char-heading').textContent = `Воспоминания ${display}`;

  // Создаём грид для нужного персонажа
  createGrid('char-grid', key, display);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

async function handleMemory(nameLatin, nameDisplay, num) {
  memTitle.textContent = `${nameDisplay} — Воспоминание ${num}`;
  memText.textContent = 'Загрузка...';

  const url = `../Characters_Data/${nameLatin}/Memory_${num}.txt`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Файл не найден: ${url}`);
    }
    memText.textContent = await response.text();
  } catch (error) {
    console.error(error);
    memText.textContent = ('Не удалось загрузить текст. Проверь наличие файла. ${url}');
  }

  mainScreen.classList.add('hidden');
  memoryScreen.classList.remove('hidden');
  dimLayer.classList.add('active');
  memoryScreen.scrollTop = 0;
}

function goBack() {
  memoryScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
  dimLayer.classList.remove('active');
}

const backTrigger = document.getElementById('back-trigger');
if (backTrigger) {
  backTrigger.addEventListener('click', goBack);
}

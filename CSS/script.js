const mainScreen = document.getElementById('main-screen');
const memoryScreen = document.getElementById('memory-screen');
const memTitle = document.getElementById('mem-title');
const memText = document.getElementById('mem-text');
const dimLayer = document.getElementById('dimLayer');

/**
 * Создаёт сетку кнопок 1–10 для указанного персонажа.
 * @param {string} containerId - ID контейнера, куда вставлять кнопки.
 * @param {string} nameLatin - Имя персонажа в латинице (для имени файла, напр. "Niav", "Beor").
 * @param {string} nameDisplay - Имя для отображения на экране (напр. "Ниав", "Беор").
 */
function createGrid(containerId, nameLatin, nameDisplay) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // очищаем контейнер

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.textContent = String(i);
    // передаём латинское имя (для URL) и отображаемое имя (для заголовка)
    btn.addEventListener('click', () => handleMemory(nameLatin, nameDisplay, i));
    container.appendChild(btn);
  }
}

// Инициализация после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Пример: создаём сетки для разных персонажей
    createGrid('grid-niav', 'Niav', 'Ниав');
    createGrid('grid-beor', 'Beor', 'Беор');
    // сюда можно добавить остальных: createGrid('grid-ayley', 'Ayley', 'Айлей'); и т.д.
  });
} else {
  createGrid('grid-niav', 'Niav', 'Ниав');
  createGrid('grid-beor', 'Beor', 'Беор');
}

/**
 * Загружает воспоминание для персонажа и номера.
 * Формат файла: Memory_<NameLatin>_<num>.txt
 */
async function handleMemory(nameLatin, nameDisplay, num) {
  memTitle.textContent = `${nameDisplay} — Воспоминание ${num}`;
  memText.textContent = 'Загрузка...';

  const url = `https://raw.githubusercontent.com/imIndieMax/Grail/main/Characters_Data/${nameLatin}/Memory_${num}.txt`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Файл не найден: ${url}`);
    }
    memText.textContent = await response.text();
  } catch (error) {
    console.error(error);
    memText.textContent = 'Не удалось загрузить текст. Проверьте наличие файла. ${url}';
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

// === ZAMANLAYICI AYARLARI ===
const defaultTimes = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

let timer;
let currentMode = 'pomodoro';
let remainingTime = defaultTimes[currentMode];
let isRunning = false;
let completedPomodoros = 0;
let muted = false;

const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const muteToggle = document.getElementById('mute-toggle');
const modeButtons = document.querySelectorAll('.mode-btn');
const circle = document.querySelector('.progress-ring__circle');
const pomodoroCount = document.getElementById('pomodoro-count');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');

// === SES ===
const audio = new Audio('https://www.soundjay.com/buttons/beep-07.wav');

// === PROGRESS ===
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - (percent * circumference);
  circle.style.strokeDashoffset = offset;
}

function updateTimeDisplay() {
  const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
  const seconds = (remainingTime % 60).toString().padStart(2, '0');
  timeDisplay.textContent = `${minutes}:${seconds}`;
  const total = defaultTimes[currentMode];
  setProgress((total - remainingTime) / total);
}

function switchMode(mode) {
  currentMode = mode;
  remainingTime = defaultTimes[mode];
  updateTimeDisplay();
  clearInterval(timer);
  isRunning = false;
  modeButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
}

function playSound() {
  if (!muted) audio.play();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateTimeDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      handleSessionEnd();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  remainingTime = defaultTimes[currentMode];
  updateTimeDisplay();
}

function handleSessionEnd() {
  playSound();
  if (currentMode === 'pomodoro') {
    completedPomodoros++;
    pomodoroCount.textContent = completedPomodoros;
    if (completedPomodoros % 4 === 0) {
      switchMode('longBreak');
    } else {
      switchMode('shortBreak');
    }
    startTimer();
  } else {
    switchMode('pomodoro');
  }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
muteToggle.addEventListener('click', () => {
  muted = !muted;
  muteToggle.textContent = muted ? '🔕' : '🔔';
});
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchMode(btn.dataset.mode);
  });
});

// === TEMA ===
function setTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  setTheme(!isDark);
});

// === TODO ===
function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(text => addTodo(text));
}

function saveTodos() {
  const todos = Array.from(todoList.children).map(li => li.querySelector('span').textContent);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo(text) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = text;
  li.appendChild(span);

  span.addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  const del = document.createElement('button');
  del.textContent = '🗑️';
  del.addEventListener('click', () => {
    li.remove();
    saveTodos();
  });

  li.appendChild(del);
  todoList.appendChild(li);
  saveTodos();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    addTodo(text);
    todoInput.value = '';
  }
});

// === YÜKLEME ===
window.addEventListener('DOMContentLoaded', () => {
  updateTimeDisplay();
  switchMode('pomodoro');
  setTheme(localStorage.getItem('theme') === 'dark');
  loadTodos();
});
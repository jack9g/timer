// عناصر قائمة المهام
const tasksBtn = document.getElementById("tasksBtn");
const tasksList = document.getElementById("tasksList");
const closeTasksBtn = document.getElementById("closeTasksBtn");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const tasksContainer = document.getElementById("tasksContainer");

// عناصر قائمة الموسيقى
const musicMenuBtn = document.getElementById("musicMenuBtn");
const closeMusicMenu = document.getElementById("closeMusicMenu");
const musicMenu = document.getElementById("musicMenu");
const musicInput = document.getElementById("musicInput");
const musicList = document.getElementById("musicList");
const musicPlayBtn = document.getElementById("musicPlayBtn");
const musicVolumeUpBtn = document.getElementById("musicVolumeUpBtn");
const musicVolumeDownBtn = document.getElementById("musicVolumeDownBtn");
const musicControls = document.getElementById("musicControls");

// زر تغيير الخلفية
const changeBackgroundButton = document.getElementById("changeBackgroundBtn");

// عناصر المؤقت
const studyTimerDisplay = document.getElementById("study-timer");
const breakTimerDisplay = document.getElementById("break-timer");
const studyBtn = document.getElementById("studyBtn");
const breakBtn = document.getElementById("breakBtn");
const toggle = document.getElementById("toggle");
const resetBtn = document.getElementById("resetBtn");

// نافذة الإعدادات
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const saveSettings = document.getElementById("saveSettings");
const studyDurationInput = document.getElementById("studyDuration");
const breakDurationInput = document.getElementById("breakDuration");

// إعداد المؤقت والموسيقى
let studyTimeLeft = parseInt(localStorage.getItem("studyTimeLeft")) || 25 * 60;
let breakTimeLeft = parseInt(localStorage.getItem("breakTimeLeft")) || 5 * 60;
let currentTimer = localStorage.getItem("currentTimer") || "study";
let timer;
let isRunning = false;
let selectedMusic = null;
let audioPlayer = new Audio();
let musicFiles = [];

// عرض الوقت
function displayTime(timeLeft, element) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  element.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}


// زر تغيير الخلفية
const images = [
  "images/image-1.jpg",
  "images/image-2.jpg",
  "images/image-3.jpg",
  "images/image-4.jpg",
  "images/image-5.jpg",
  "images/image-6.jpg",
  "images/image-7.jpg",
];

changeBackgroundButton.addEventListener("click", () => {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = `url('${randomImage}')`;
  localStorage.setItem("background", randomImage);
});

// حفظ حالة المؤقت
function saveTimerState() {
  localStorage.setItem("studyTimeLeft", studyTimeLeft);
  localStorage.setItem("breakTimeLeft", breakTimeLeft);
  localStorage.setItem("currentTimer", currentTimer);
}

// إعادة ضبط المؤقت
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  toggle.checked = false;

  if (currentTimer === "study") {
    studyTimeLeft = parseInt(studyDurationInput.value) * 60 || 25 * 60;
    displayTime(studyTimeLeft, studyTimerDisplay);
  } else {
    breakTimeLeft = parseInt(breakDurationInput.value) * 60 || 5 * 60;
    displayTime(breakTimeLeft, breakTimerDisplay);
  }

  saveTimerState();
}

// تشغيل/إيقاف المؤقت
function toggleTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (currentTimer === "study" && studyTimeLeft > 0) {
        studyTimeLeft--;
        displayTime(studyTimeLeft, studyTimerDisplay);
        if (studyTimeLeft === 0) {
          clearInterval(timer);
          showBreakTimer();
        }
      } else if (currentTimer === "break" && breakTimeLeft > 0) {
        breakTimeLeft--;
        displayTime(breakTimeLeft, breakTimerDisplay);
        if (breakTimeLeft === 0) {
          clearInterval(timer);
          showStudyTimer();
        }
      }
      saveTimerState();
    }, 1000);
  } else {
    clearInterval(timer);
    isRunning = false;
  }
}

// تبديل الزر النشط
function switchActiveButton(activeButton) {
  studyBtn.classList.remove("active");
  breakBtn.classList.remove("active");
  activeButton.classList.add("active");
}

// إظهار مؤقت الدراسة
function showStudyTimer() {
  clearInterval(timer);
  isRunning = false;
  toggle.checked = false;
  currentTimer = "study";
  studyTimerDisplay.style.display = "block";
  breakTimerDisplay.style.display = "none";
  displayTime(studyTimeLeft, studyTimerDisplay);
  switchActiveButton(studyBtn);
  playMusic(); // تشغيل الموسيقى مع المؤقت
  saveTimerState();
}

// إظهار مؤقت الراحة
function showBreakTimer() {
  clearInterval(timer);
  isRunning = false;
  toggle.checked = false;
  currentTimer = "break";
  studyTimerDisplay.style.display = "none";
  breakTimerDisplay.style.display = "block";
  displayTime(breakTimeLeft, breakTimerDisplay);
  switchActiveButton(breakBtn);
  stopMusic(); // إيقاف الموسيقى عند الانتقال للراحة
  saveTimerState();
}

// نافذة الإعدادات
function openSettingsModal() {
  settingsModal.classList.add("show");
}

function closeSettingsModal() {
  settingsModal.classList.remove("show");
}

function saveSettingsHandler() {
  studyTimeLeft = parseInt(studyDurationInput.value) * 60 || 25 * 60;
  breakTimeLeft = parseInt(breakDurationInput.value) * 60 || 5 * 60;

  resetTimer();
  closeSettingsModal();
}

// التحكم في قائمة المهام
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasksContainer.innerHTML = ""; // تفريغ القائمة
  savedTasks.forEach((taskValue) => {
    const li = document.createElement("li");
    li.textContent = taskValue;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });
    li.appendChild(deleteBtn);
    tasksContainer.appendChild(li);
  });
}

function saveTasks() {
  const tasks = Array.from(tasksContainer.children).map(
    (li) => li.firstChild.textContent
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addTaskBtn.addEventListener("click", () => {
  const taskValue = taskInput.value.trim();
  if (taskValue) {
    const li = document.createElement("li");
    li.textContent = taskValue;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });
    li.appendChild(deleteBtn);
    tasksContainer.appendChild(li);
    taskInput.value = "";
    saveTasks();
  }
});

// التحكم في قائمة المهام
tasksBtn.addEventListener("click", () => {
  tasksList.classList.toggle("visible");
});
closeTasksBtn.addEventListener("click", () => {
  tasksList.classList.remove("visible");
});

// التحكم في قائمة الموسيقى
document.getElementById("musicMenuBtn").addEventListener("click", () => {
  document.getElementById("musicMenu").classList.add("visible");
});

document.getElementById("closeMusicMenu").addEventListener("click", () => {
  document.getElementById("musicMenu").classList.remove("visible");
});


// إضافة رابط موسيقى
document.getElementById("musicInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    if (musicFiles.length < 3) {
      // إضافة الملف إلى المصفوفة
      musicFiles.push(file);

      // إنشاء عنصر قائمة جديد لعرض الملف
      const li = document.createElement("li");
      li.textContent = file.name;
      li.classList.add("music-item");

      // إنشاء زر "حذف"
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-btn");

      // إضافة حدث لحذف الملف عند الضغط على الزر
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation(); // منع تنفيذ الحدث الأساسي (تحديد الملف) عند الضغط على زر الحذف
        musicFiles = musicFiles.filter((f) => f !== file); // إزالة الملف من المصفوفة
        li.remove(); // إزالة العنصر من القائمة
        if (selectedMusic === file) {
          selectedMusic = null; // إذا كان الملف المحذوف هو الملف المحدد، قم بتصفيره
          showMusicControls(); // تحديث الأزرار بناءً على الحالة الحالية
        }
      });

      // إضافة زر الحذف إلى عنصر القائمة
      li.appendChild(deleteButton);

      // إضافة حدث لتحديد الملف عند النقر عليه
      li.addEventListener("click", () => {
        // إذا تم النقر على ملف مختلف، يتم تشغيله تلقائيًا
        if (selectedMusic !== file) {
          selectedMusic = file;
          li.classList.add("selected");
          // إزالة التحديد من باقي الملفات
          Array.from(musicList.children).forEach((item) => {
            if (item !== li) item.classList.remove("selected");
          });

          // تشغيل الملف الجديد تلقائيًا
          const fileURL = URL.createObjectURL(file);
          audioPlayer.src = fileURL;
          audioPlayer.loop = true;
          audioPlayer.play();
        }
      });

      // إضافة العنصر إلى قائمة الموسيقى
      musicList.appendChild(li);

      // إذا كان هناك ملف واحد، حدد الملف تلقائيًا
      if (musicFiles.length === 1) {
        selectedMusic = file;
        li.classList.add("selected");

        // تشغيل الملف تلقائيًا إذا كان هو الوحيد
        const fileURL = URL.createObjectURL(file);
        audioPlayer.src = fileURL;
        audioPlayer.loop = true;
        audioPlayer.play();
      }
    } else {
      alert("You can only add up to 3 files.");
    }
  }
});

// إظهار أزرار التحكم عند رفع ملف
function showMusicControls() {
  if (selectedMusic) {
    document.getElementById("musicControls").style.display = "block";
  } else {
    document.getElementById("musicControls").style.display = "none";
  }
}

// تشغيل/إيقاف الموسيقى
musicPlayBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    // تحقق من وجود ملفات موسيقى أكثر من واحد
    if (musicFiles.length > 1) {
      if (!selectedMusic) {
        alert("Please select a music file.");
        return; // لا يتم تشغيل الموسيقى إلا بعد تحديد ملف
      }
    } else if (!selectedMusic) {
      alert("Please select a music file.");
      return; // لا يتم تشغيل الموسيقى إلا بعد تحديد ملف
    }

    // إذا تم اختيار ملف موسيقى
    const fileURL = URL.createObjectURL(selectedMusic);
    audioPlayer.src = fileURL;
    audioPlayer.loop = true;
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});



document.getElementById("musicVolumeUpBtn").addEventListener("click", () => {
  audioPlayer.volume = Math.min(audioPlayer.volume + 1, 100);
});

document.getElementById("musicVolumeDownBtn").addEventListener("click", () => {
  audioPlayer.volume = Math.max(audioPlayer.volume - 1, 0);
});

// ربط الأحداث
toggle.addEventListener("change", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
studyBtn.addEventListener("click", showStudyTimer);
breakBtn.addEventListener("click", showBreakTimer);
settingsBtn.addEventListener("click", openSettingsModal);
closeSettings.addEventListener("click", closeSettingsModal);
saveSettings.addEventListener("click", saveSettingsHandler);

// تحميل المهام المحفوظة عند بدء التشغيل
loadTasks();

// تحديث العرض عند التحميل
if (currentTimer === "study") {
  showStudyTimer();
} else {
  showBreakTimer();
}

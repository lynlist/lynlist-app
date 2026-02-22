let timer;
let timeLeft = 25 * 60;
let isBreak = false;
let sessionCounter = 0;

function updateDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    document.getElementById('timer-display').textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function playAlarm() {
    const alarm = document.getElementById('alarm-sound');
    alarm.play().catch(e => console.log("Sound played"));
}

function startTimer() {
    if (timer) return;
    document.getElementById('start-btn').textContent = "Running...";
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            handleSessionEnd();
        }
    }, 1000);
}

function handleSessionEnd() {
    clearInterval(timer);
    timer = null;
    document.getElementById('start-btn').textContent = "Start";
    
    playAlarm();

    if (!isBreak) {
        sessionCounter++;
        autoAddTomato();
        
        if (sessionCounter % 4 === 0) {
            startBreak(15, "Long Break 🌸");
        } else {
            startBreak(5, "Short Break 🍵");
        }
    } else {
        isBreak = false;
        timeLeft = 25 * 60;
        document.getElementById('timer-status').textContent = "Focus Time";
    }
    updateDisplay();
    updateSessionText();
}

function startBreak(minutes, label) {
    isBreak = true;
    timeLeft = minutes * 60;
    document.getElementById('timer-status').textContent = label;
    updateDisplay();
}

function skipSession() {
    handleSessionEnd();
}

function autoAddTomato() {
    const activeCourses = document.querySelectorAll('.course-item');
    for (let item of activeCourses) {
        const name = item.querySelector('.course-name');
        if (!name.classList.contains('done')) {
            const countSpan = item.querySelector('.count');
            countSpan.textContent = parseInt(countSpan.textContent) + 1;
            break; 
        }
    }
}

function updateSessionText() {
    document.getElementById('session-count').textContent = `Sessions: ${sessionCounter % 4} / 4`;
}

function pauseTimer() { 
    clearInterval(timer); 
    timer = null; 
    document.getElementById('start-btn').textContent = "Start";
}

function resetTimer() { 
    pauseTimer(); 
    isBreak = false;
    sessionCounter = 0;
    timeLeft = 25 * 60; 
    document.getElementById('timer-status').textContent = "Focus Time";
    updateDisplay(); 
    updateSessionText();
}

function addCourse() {
    const input = document.getElementById('courseInput');
    if (!input.value) return;

    const li = document.createElement('li');
    li.className = 'course-item';
    li.innerHTML = `
        <div class="course-main" onclick="toggleNotes(this)">
            <span class="course-name" onclick="toggleDone(event, this)">${input.value}</span>
            <div>
                <span class="pomo-counter">🍅 <span class="count">0</span></span>
                <button class="icon-btn" onclick="addPomo(event, this)">➕</button>
                <button class="icon-btn" onclick="this.closest('.course-item').remove()">❌</button>
            </div>
        </div>
        <textarea class="notes-area" placeholder="Add notes for this course..." onclick="event.stopPropagation()"></textarea>
    `;
    
    document.getElementById('courseList').appendChild(li);
    input.value = '';
}

function toggleNotes(container) {
    const area = container.parentElement.querySelector('.notes-area');
    area.classList.toggle('active-notes');
}

function toggleDone(event, el) {
    event.stopPropagation();
    el.classList.toggle('done');
}

function addPomo(event, btn) {
    event.stopPropagation();
    const countSpan = btn.parentElement.querySelector('.count');
    countSpan.textContent = parseInt(countSpan.textContent) + 1;
}

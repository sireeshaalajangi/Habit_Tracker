let activities = JSON.parse(localStorage.getItem("activities")) || [];

function addActivity() {
    let preset = document.getElementById("preset").value;
    let custom = document.getElementById("custom").value;

    let name = preset || custom;

    if (name === "") {
        document.getElementById("warning").innerText = "⚠️ Add an activity!";
        return;
    }

    document.getElementById("warning").innerText = "";

    let today = new Date().toLocaleDateString();

    let activity = {
        name,
        time: 0,
        date: today,
        running: false,
        interval: null,
        done: false
    };

    activities.push(activity);
    saveData();

    document.getElementById("custom").value = "";
    document.getElementById("preset").value = "";

    display();
}

function display() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    let today = new Date().toLocaleDateString();

    let completed = 0;
    let total = 0;

    activities.forEach((act, index) => {
        if (act.date !== today) return;

        total++;

        if (act.done) completed++;

        let li = document.createElement("li");

        li.innerHTML = `
            <b>${act.name}</b><br>
            ⏱️ ${formatTime(act.time)} <br><br>

            <button onclick="start(${index})">▶</button>
            <button onclick="stop(${index})">⏸</button>
            <button onclick="markDone(${index})">✅</button>
            <button onclick="editTask(${index})">✏️</button>
            <button onclick="deleteTask(${index})">❌</button>
        `;

        if (act.done) {
            li.classList.add("done");
        }

        list.appendChild(li);
    });

    showSummary();
    showCount(completed, total);
}

function start(i) {
    if (!activities[i].running) {
        activities[i].running = true;

        activities[i].interval = setInterval(() => {
            activities[i].time++;
            saveData();
            display();
        }, 1000);
    }
}

function stop(i) {
    activities[i].running = false;
    clearInterval(activities[i].interval);
    saveData();
}

function markDone(i) {
    activities[i].done = true;
    saveData();
    display();
}

function deleteTask(i) {
    clearInterval(activities[i].interval);
    activities.splice(i, 1);
    saveData();
    display();
}

function editTask(i) {
    let newName = prompt("Edit activity:", activities[i].name);
    if (newName) {
        activities[i].name = newName;
        saveData();
        display();
    }
}

function resetDay() {
    if (confirm("Reset today's data?")) {
        let today = new Date().toLocaleDateString();
        activities = activities.filter(act => act.date !== today);
        saveData();
        display();
    }
}

function formatTime(sec) {
    let hrs = Math.floor(sec / 3600);
    let mins = Math.floor((sec % 3600) / 60);
    let secs = sec % 60;
    return hrs + "h " + mins + "m " + secs + "s";
}

function saveData() {
    localStorage.setItem("activities", JSON.stringify(activities));
}

function showSummary() {
    let today = new Date().toLocaleDateString();
    let total = 0;

    activities.forEach(act => {
        if (act.date === today) {
            total += act.time;
        }
    });

    document.getElementById("summary").innerText =
        "🔥 Total Time Today: " + formatTime(total);
}

function showCount(done, total) {
    document.getElementById("count").innerText =
        `✅ Completed: ${done} | ⏳ Pending: ${total - done}`;
}

// Load data
display();

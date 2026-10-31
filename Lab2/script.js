// 0. Test data

const saved_tasks = localStorage.getItem("todo_tasks");

let tasks = saved_tasks !== null
    ? JSON.parse(saved_tasks)
    : [
        {
            id: 1,
            title: "Сделать черновик сайта",
            date: "2026-10-30",
            completed: true
        },
        {
            id: 2,
            title: "Загрузить черновик в гитхаб",
            date: "2026-10-31",
            completed: true
        },
        {
            id: 3,
            title: "Сделать перенос элементов",
            date: "2026-10-31",
            completed: true
        },
        {
            id: 4,
            title: "Загрузить рабочий вариант в гитхаб",
            date: "2026-10-31",
            completed: true
        },
        {
            id: 5,
            title: "Добавить графики через css",
            date: "2026-10-31",
            completed: false
        },
        {
            id: 6,
            title: "Загрузить финальный вариант в гитхаб",
            date: "2026-10-31",
            completed: false
        },
        {
            id: 7,
            title: "Разобраться с pages в гитхабе",
            date: "2026-10-31",
            completed: true
        },
        {
            id: 8,
            title: "Сделать сохранение списка задач",
            date: "2026-10-31",
            completed: true
        },
        {
            id: 9,
            title: "Загрузить рабочую версию в гитхаб",
            date: "2026-10-31",
            completed: false
        }
    ]
    if (saved_tasks === null) { saveTasks(); };

let next_task_id = Math.max(0, ...tasks.map(task => task.id)) + 1;



// 1. Create blocks in html

// 1.1 Header

const header = document.createElement("header");

const heading = document.createElement("h1");
heading.textContent = "ToDo List";

const section_name = document.createElement("h2");
section_name.textContent = "Добавить задачу";

header.append(heading, section_name);

// 1.2 Main

// 1.2.1 Form

const main = document.createElement("main");

const task_form = document.createElement("form");

const title_input = document.createElement("input");
title_input.type = "text";
title_input.required = true;

const date_input = document.createElement("input");
date_input.type = "date";

const add_button = document.createElement("button");
add_button.type = "submit";
add_button.textContent = "Добавить";

const form_label = document.createElement("label");
form_label.textContent = "Новая задача";
form_label.append(title_input);

task_form.append(form_label, date_input, add_button);

// 1.2.2 Toolbar

const toolbar = document.createElement("section");

const search_input = document.createElement("input");
search_input.type = "search";
search_input.placeholder = "Поиск по названию";

function createOption(value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    return option;
}

const status_filter = document.createElement("select");
status_filter.append(
    createOption("all", "Все задачи"),
    createOption("active", "Активные"),
    createOption("completed", "Выполненные")
);

const sort_select = document.createElement("select");
sort_select.append(
    createOption("manual", "Без сортировки"),
    createOption("asc", "Сначала ближайшие"),
    createOption("desc", "Сначала дальние")
);

toolbar.append(search_input, status_filter, sort_select);

search_input.addEventListener("input", renderTasks);

status_filter.addEventListener("change", renderTasks);

sort_select.addEventListener("change", renderTasks);

// 1.2.3 Tasks

const task_section = document.createElement("section");

const section_heading = document.createElement("h2");
section_heading.textContent = "Список задач";

const task_list = document.createElement("ul");

task_section.append(section_heading, task_list);

task_form.addEventListener("submit", event => {
    event.preventDefault();

    const new_task = {
        id: next_task_id++,
        title: title_input.value,
        date: date_input.value,
        completed: false
    };

    tasks.push(new_task);

    task_form.reset();
    saveTasks();
    renderTasks();
});

main.append(task_form, toolbar, task_section);



// 3. Func

// 3.1 Recreate

function renderTasks() {
    task_list.replaceChildren();

    let visible_tasks = [...tasks];

    // 3.1.1 Title
    const search_query = search_input.value.toLowerCase();
    visible_tasks = visible_tasks.filter( task => task.title.toLowerCase().includes(search_query) );

    // 3.1.2 Checkbox
    if (status_filter.value === "active") { visible_tasks = visible_tasks.filter(task => !task.completed); }

    if (status_filter.value === "completed") { visible_tasks = visible_tasks.filter(task => task.completed); }

    // 3.1.3 Date
    if (sort_select.value === "asc") { visible_tasks.sort((a, b) => a.date.localeCompare(b.date)); }

    if (sort_select.value === "desc") { visible_tasks.sort((a, b) => b.date.localeCompare(a.date)); }

    // 3.2 Items
    visible_tasks.forEach(task => {
        const task_item = document.createElement("li");

        task_item.draggable = sort_select.value === "manual" && status_filter.value === "all" && search_input.value === "";
        task_item.dataset.id = task.id;

        const task_info = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        if (task.completed) { task_item.classList.add("completed"); }

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const title = document.createElement("span");
        title.textContent = task.title;

        task_info.append(checkbox, title);

        const date = document.createElement("time");
        date.textContent = task.date ? formatDate(task.date) : "Без срока";
        if (task.date) date.dateTime = task.date;

        const edit_button = document.createElement("button");
        edit_button.type = "button";
        edit_button.textContent = "Редактировать";

        edit_button.addEventListener("click", () => {
            const edit_title = document.createElement("input");
            edit_title.type = "text";
            edit_title.value = task.title;
            edit_title.required = true;

            const edit_date = document.createElement("input");
            edit_date.type = "date";
            edit_date.value = task.date;

            const save_button = document.createElement("button");
            save_button.type = "submit";
            save_button.textContent = "Сохранить";

            const edit_form = document.createElement("form");

            edit_form.append(edit_title, edit_date, save_button);

            task_item.replaceChildren(edit_form);

            edit_form.addEventListener("submit", event => {
                event.preventDefault();

                const new_title = edit_title.value;
                if (!new_title) return;

                task.title = new_title;
                task.date = edit_date.value;

                saveTasks();
                renderTasks();
            });
        });

        const delete_button = document.createElement("button");
        delete_button.type = "button";
        delete_button.textContent = "Удалить";

        delete_button.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        task_item.append(task_info, date, edit_button, delete_button);
        task_list.append(task_item);
    });
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}

let dragged_task_id = null;

task_list.addEventListener("dragstart", event => {
    const task_item = event.target.closest("li");

    dragged_task_id = Number(task_item.dataset.id);
});

task_list.addEventListener("dragover", event => {
    const task_item = event.target.closest("li");

    if (task_item) {
        event.preventDefault();
    }
});

task_list.addEventListener("drop", event => {
    event.preventDefault();

    const target_item = event.target.closest("li");

    const target_id = Number(target_item.dataset.id);
    if (dragged_task_id === target_id) return;

    const from_index = tasks.findIndex(task => task.id === dragged_task_id);

    const [moved_task] = tasks.splice(from_index, 1);

    const target_index = tasks.findIndex(task => task.id === target_id);

    tasks.splice(target_index, 0, moved_task);

    saveTasks();
    renderTasks();
});

task_list.addEventListener("dragend", () => {
    dragged_task_id = null;
});

function saveTasks() {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
}



// 4. End

document.body.append(header, main);
renderTasks();

"use strict";
// ---- 1. Типи ----
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProfessor = addProfessor;
exports.addCourse = addCourse;
exports.addClassroom = addClassroom;
exports.validateLesson = validateLesson;
exports.addLesson = addLesson;
exports.findAvailableClassrooms = findAvailableClassrooms;
exports.getProfessorSchedule = getProfessorSchedule;
exports.getClassroomUtilization = getClassroomUtilization;
exports.getMostPopularCourseType = getMostPopularCourseType;
exports.reassignClassroom = reassignClassroom;
exports.cancelLesson = cancelLesson;
// ---- 2. "База даних" у пам'яті ----
const professors = [];
const classrooms = [];
const courses = [];
const schedule = [];
const lessonIdMap = {};
let professorCounter = 1;
let courseCounter = 1;
let lessonCounter = 1;
// ---- 3. Додавання сутностей ----
function addProfessor(professor) {
    const newProfessor = Object.assign(Object.assign({}, professor), { id: professorCounter++ });
    professors.push(newProfessor);
    return newProfessor;
}
function addCourse(course) {
    const newCourse = Object.assign(Object.assign({}, course), { id: courseCounter++ });
    courses.push(newCourse);
    return newCourse;
}
function addClassroom(room) {
    const exists = classrooms.some((c) => c.number === room.number);
    if (!exists) {
        classrooms.push(room);
    }
}
// ---- 4. Валідація і додавання уроку ----
function validateLesson(lesson) {
    for (let i = 0; i < schedule.length; i++) {
        const existing = schedule[i];
        const sameSlot = existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;
        if (sameSlot && existing.professorId === lesson.professorId) {
            return {
                type: "ProfessorConflict",
                lessonDetails: existing
            };
        }
        if (sameSlot && existing.classroomNumber === lesson.classroomNumber) {
            return {
                type: "ClassroomConflict",
                lessonDetails: existing
            };
        }
    }
    return null;
}
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict !== null) {
        console.warn("Конфлікт при додаванні уроку:", conflict.type);
        return false;
    }
    schedule.push(lesson);
    lessonIdMap[lessonCounter++] = lesson;
    return true;
}
// ---- 5. Пошук та фільтрація ----
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const busy = [];
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        if (lesson.dayOfWeek === dayOfWeek &&
            lesson.timeSlot === timeSlot) {
            busy.push(lesson.classroomNumber);
        }
    }
    const free = [];
    for (let i = 0; i < classrooms.length; i++) {
        const room = classrooms[i];
        if (busy.indexOf(room.number) === -1) {
            free.push(room.number);
        }
    }
    return free;
}
function getProfessorSchedule(professorId) {
    const result = [];
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        if (lesson.professorId === professorId) {
            result.push(lesson);
        }
    }
    return result;
}
// ---- 6. Аналіз ----
const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];
const allSlots = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];
function getClassroomUtilization(classroomNumber) {
    const totalSlots = allDays.length * allSlots.length;
    if (totalSlots === 0) {
        return 0;
    }
    let used = 0;
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].classroomNumber === classroomNumber) {
            used++;
        }
    }
    const percent = (used / totalSlots) * 100;
    return Math.round(percent * 10) / 10;
}
function getMostPopularCourseType() {
    const counter = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        const course = courses.find((c) => c.id === lesson.courseId);
        if (!course)
            continue;
        counter[course.type] = counter[course.type] + 1;
    }
    let maxType = "Lecture";
    let maxCount = counter[maxType];
    const types = ["Lecture", "Seminar", "Lab", "Practice"];
    for (let i = 0; i < types.length; i++) {
        const t = types[i];
        if (counter[t] > maxCount) {
            maxType = t;
            maxCount = counter[t];
        }
    }
    return maxType;
}
// ---- 7. Модифікація ----
function reassignClassroom(lessonId, newClassroomNumber) {
    const lesson = lessonIdMap[lessonId];
    if (!lesson) {
        console.warn("Урок з таким id не знайдено:", lessonId);
        return false;
    }
    const updated = Object.assign(Object.assign({}, lesson), { classroomNumber: newClassroomNumber });
    const conflict = validateLesson(updated);
    if (conflict !== null) {
        console.warn("Не можна змінити аудиторію через конфлікт:", conflict.type);
        return false;
    }
    // оновлюємо в масиві schedule
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i] === lesson) {
            schedule[i] = updated;
            break;
        }
    }
    lessonIdMap[lessonId] = updated;
    return true;
}
function cancelLesson(lessonId) {
    const lesson = lessonIdMap[lessonId];
    if (!lesson) {
        console.warn("Немає уроку з id =", lessonId);
        return;
    }
    const index = schedule.indexOf(lesson);
    if (index !== -1) {
        schedule.splice(index, 1);
    }
    delete lessonIdMap[lessonId];
}
// ---- 8. Приклад використання ----
addClassroom({ number: "101", capacity: 30, hasProjector: true });
const p = addProfessor({ name: "Олег Мельник", department: "CS" });
const c = addCourse({ name: "Мережі", type: "Lecture" });
addLesson({
    courseId: c.id,
    professorId: p.id,
    classroomNumber: "101",
    dayOfWeek: "Tuesday",
    timeSlot: "10:15-11:45"
});
console.log(getProfessorSchedule(p.id));
console.log(findAvailableClassrooms("10:15-11:45", "Tuesday"));

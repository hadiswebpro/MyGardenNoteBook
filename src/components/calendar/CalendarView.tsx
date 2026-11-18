import { useState } from "react";
import { ChevronLeft, ChevronRight, Circle, CircleCheck } from "lucide-react";
import { useGarden } from "../../context/GardenContext";
import { today } from "../../utils/date";
import styles from "./CalendarView.module.css";

export default function CalendarView() {
  const { month, setMonth, data } = useGarden();
  const [selectedDate, setSelectedDate] = useState(today());

  const offset = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const selectedTasks = data.tasks.filter((task) => task.due === selectedDate);
  const selectedDateLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  );

  function changeMonth(direction: number) {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + direction, 1);
    setMonth(nextMonth);
    setSelectedDate([
      nextMonth.getFullYear(),
      String(nextMonth.getMonth() + 1).padStart(2, "0"),
      "01",
    ].join("-"));
  }

  return (
    <section className={styles.panel}>
      <div className={styles.heading}>
        <h3>{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
        <div>
          <button className="icon-btn" aria-label="Previous month" onClick={() => changeMonth(-1)}>
            <ChevronLeft />
          </button>
          <button className="icon-btn" aria-label="Next month" onClick={() => changeMonth(1)}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span className={styles.weekday} key={day}>{day}</span>
        ))}
        {Array.from({ length: offset }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: days }, (_, index) => {
          const date = [
            month.getFullYear(),
            String(month.getMonth() + 1).padStart(2, "0"),
            String(index + 1).padStart(2, "0"),
          ].join("-");
          const count = data.tasks.filter((task) => task.due === date).length;
          const isToday = date === today();
          const isSelected = date === selectedDate;

          return (
            <button
              key={date}
              type="button"
              className={[
                isToday ? styles.today : styles.day,
                isSelected ? styles.selected : "",
              ].filter(Boolean).join(" ")}
              onClick={() => setSelectedDate(date)}
              aria-pressed={isSelected}
              aria-label={`${date}, ${count} ${count === 1 ? "task" : "tasks"}`}
            >
              <span>{index + 1}</span>
              {count > 0 && <small>{count} ✿</small>}
            </button>
          );
        })}
      </div>

      <section className={styles.dayDetails} aria-live="polite">
        <div className={styles.dayDetailsHeading}>
          <div>
            <h4>Tasks for this day</h4>
            <p>{selectedDateLabel}</p>
          </div>
          <span className={styles.taskCount}>
            {selectedTasks.length} {selectedTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {selectedTasks.length > 0 ? (
          <ul className={styles.taskList}>
            {selectedTasks.map((task) => {
              const project = data.projects.find((item) => item.id === task.projectId);
              return (
                <li className={styles.task} key={task.id}>
                  {task.done ? (
                    <CircleCheck className={styles.taskIcon} aria-label="Completed" />
                  ) : (
                    <Circle className={styles.taskIcon} aria-label="Not completed" />
                  )}
                  <div className={styles.taskInfo}>
                    <span className={task.done ? styles.completedTask : ""}>{task.title}</span>
                    {project && <small>{project.name}</small>}
                  </div>
                  {task.done && <span className={styles.completedLabel}>Completed</span>}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.emptyState}>You don’t have any tasks for this day.</p>
        )}
      </section>
    </section>
  );
}

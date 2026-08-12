import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";

import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";

import "./MyTasks.css";

const MONTH_NAMES = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function MyTasks() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // Calendar month/year currently displayed - defaults to today's month/year
    const today = new Date();
    const [calendarMonth, setCalendarMonth] = useState(today.getMonth()); // 0-11
    const [calendarYear, setCalendarYear] = useState(today.getFullYear());

    const token = localStorage.getItem("token");

    // ================= Fetch Tasks =================
    const fetchTasks = useCallback(async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/tasks/user",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTasks(response.data);
        } catch (error) {
            console.log("Fetch task error", error);
        }
    }, [token]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Keep the calendar automatically on the current month/year
    // whenever the component mounts / the real-world month changes.
    useEffect(() => {
        const now = new Date();
        setCalendarMonth(now.getMonth());
        setCalendarYear(now.getFullYear());
    }, []);

    // ================= Delete Task =================
    const deleteTask = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchTasks();
        } catch (error) {
            console.log(error);
        }
    };

    // ================= Complete Task =================
    const completeTask = async (id) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/tasks/${id}/status`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchTasks();
        } catch (error) {
            console.log(error);
        }
    };

    // ================= Search Filter =================
    const filteredTasks = tasks.filter(task => {
        const query = search.toLowerCase();

        const searchMatch =
            task.title?.toLowerCase().includes(query);

        const filterMatch =
            filter === "all" ||
            task.status?.toLowerCase() === filter;

        return searchMatch && filterMatch;
    });

    // ================= Calendar =================
    // Builds a proper month grid: leading blanks so day 1 lines up
    // under the correct weekday, then every real day of the month.
    const calendarCells = useMemo(() => {
        const firstWeekday = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 = Sunday ... 6 = Saturday
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

        const cells = [];

        // Leading blank cells so the 1st aligns under the right weekday
        for (let i = 0; i < firstWeekday; i++) {
            cells.push(null);
        }

        // Real days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            cells.push(day);
        }

        return cells;
    }, [calendarMonth, calendarYear]);

    const getTasksForDay = (day) => {
        return tasks.filter(task => {
            if (!task.due_date) return false;

            const date = new Date(task.due_date);

            return (
                date.getDate() === day &&
                date.getMonth() === calendarMonth &&
                date.getFullYear() === calendarYear
            );
        });
    };

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            calendarMonth === today.getMonth() &&
            calendarYear === today.getFullYear()
        );
    };

    // Year dropdown options: a few years back/forward from today
    const yearOptions = useMemo(() => {
        const currentYear = today.getFullYear();
        const years = [];

        for (let y = currentYear - 2; y <= currentYear + 2; y++) {
            years.push(y);
        }

        return years;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mytasks-container">

            {/* Header */}
            <div className="mytasks-header">
                <h2>My Tasks</h2>

                <button className="create-btn" onClick={() => setIsModalOpen(true)}>
                    <FaPlus />
                    Create Task
                </button>
            </div>

            {/* Search Filter - sticky toolbar */}
            <div className="task-toolbar">
                <input
                    type="text"
                    placeholder="Search by task name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Task Table - wrapped for horizontal scroll on small screens */}
            <div className="task-table-wrapper">
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.id}>
                                <td data-label="Title">{task.title}</td>

                                <td data-label="Priority">
                                    <span className={task.priority.toLowerCase()}>
                                        {task.priority}
                                    </span>
                                </td>

                                <td data-label="Due Date">{task.due_date}</td>

                                <td data-label="Status">{task.status}</td>

                                <td data-label="Actions">
                                    <button
                                        className="action-btn edit"
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setEditOpen(true);
                                        }}
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="action-btn delete"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <FaTrash />
                                    </button>

                                    <button
                                        className="action-btn complete"
                                        onClick={() => completeTask(task.id)}
                                    >
                                        <FaCheck />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Calendar */}
            <div className="task-calendar-wrapper">
                <div className="calendar-header-row">
                    <h2>Task Calendar</h2>

                    <div className="calendar-controls">
                        <select
                            value={calendarMonth}
                            onChange={e => setCalendarMonth(Number(e.target.value))}
                        >
                            {MONTH_NAMES.map((name, index) => (
                                <option key={name} value={index}>{name}</option>
                            ))}
                        </select>

                        <select
                            value={calendarYear}
                            onChange={e => setCalendarYear(Number(e.target.value))}
                        >
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Weekday header row */}
                <div className="calendar-weekdays">
                    {WEEKDAY_LABELS.map(label => (
                        <div key={label} className="calendar-weekday-label">{label}</div>
                    ))}
                </div>

                <div className="task-calendar">
                    {calendarCells.map((day, index) => {
                        if (day === null) {
                            return <div key={`blank-${index}`} className="calendar-day empty" />;
                        }

                        const dayTasks = getTasksForDay(day);

                        return (
                            <div
                                key={day}
                                className={
                                    `calendar-day` +
                                    (dayTasks.length ? " has-task" : "") +
                                    (isToday(day) ? " today" : "")
                                }
                                onClick={() => setSelectedDate(day)}
                            >
                                <h3>{day}</h3>

                                {dayTasks.length > 0 && (
                                    <span className="calendar-task-count">
                                        {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Day Details Popup */}
            {selectedDate && (
                <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
                    <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>
                            Tasks on {MONTH_NAMES[calendarMonth]} {selectedDate}, {calendarYear}
                        </h2>

                        {getTasksForDay(selectedDate).length === 0 && (
                            <p>No tasks due on this day.</p>
                        )}

                        {getTasksForDay(selectedDate).map(task => (
                            <div key={task.id} className="calendar-modal-task">
                                <p><strong>Title:</strong><br />{task.title}</p>
                                <p><strong>Priority:</strong><br />{task.priority}</p>
                                <p><strong>Status:</strong><br />{task.status}</p>
                                <p><strong>Created By:</strong><br />{task.username}</p>
                            </div>
                        ))}

                        <button className="close-btn" onClick={() => setSelectedDate(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={() => {
                        fetchTasks();
                        setIsModalOpen(false);
                    }}
                />
            )}

            {/* Edit Modal */}
            {editOpen && (
                <EditTaskModal
                    task={selectedTask}
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    refresh={fetchTasks}
                />
            )}
        </div>
    );
}

export default MyTasks;

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  ListTodo,
  Download,
  LogOut,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import "../styles/todo.css";
import supabase from "../supabase";
import { showToast } from "../utils/notifications";
import ConfirmDialog from "../components/ConfirmDialog";

const Todo = () => {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  // Fetch logged-in user's todos
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading("fetch");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("user_todos")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });

      if (error) {
        showToast("error", error.message);
      } else {
        setTodos(data || []);
      }

      setLoading("");
    };

    fetchTodos();
  }, [navigate]);

  // Add or Update Task
  const addTodo = async () => {
    if (!input.trim() || !user || loading) return;

    setLoading(editId !== null ? "update" : "add");

    let error;
    let data;

    if (editId !== null) {
      const result = await supabase
        .from("user_todos")
        .update({ text: input.trim() })
        .eq("id", editId)
        .eq("user_id", user.id)
        .select()
        .single();

      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("user_todos")
        .insert({
          user_id: user.id,
          text: input.trim(),
        })
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    setLoading("");

    if (error) {
      showToast("error", error.message);
      return;
    }

    if (editId !== null) {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === editId ? data : todo)),
      );

      setEditId(null);
    } else {
      setTodos((prev) => [data, ...prev]);
    }

    setInput("");
  };

  // Edit Task
  const editTodo = (todo) => {
    setInput(todo.text);
    setEditId(todo.id);
  };

  // Delete Task
  const deleteTodo = async () => {
    if (!user || loading || deleteId === null) return;

    const id = deleteId;
    setLoading("delete");

    const { error } = await supabase
      .from("user_todos")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    setLoading("");
    setDeleteId(null);

    if (error) {
      showToast("error", error.message);
      return;
    }

    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    if (editId === id) {
      setEditId(null);
      setInput("");
    }
  };

  // Download PDF
  const downloadPDF = () => {
    if (todos.length === 0 || loading) return;

    setLoading("download");

    setTimeout(() => {
      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.text("Taskly - My Tasks", 20, 20);

      doc.setFontSize(12);
      doc.text("Total Tasks: " + todos.length, 20, 32);

      let y = 48;

      todos.forEach((todo, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        const lines = doc.splitTextToSize(index + 1 + ". " + todo.text, 170);
        doc.text(lines, 20, y);
        y = y + lines.length * 8 + 5;
      });

      doc.save("Taskly-Tasks.pdf");
      setLoading("");
    }, 300);
  };

  // Logout
  const handleLogout = async () => {
    if (loading) return;

    setLoading("logout");
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoading("");
      showToast("error", error.message);
      return;
    }

    navigate("/login", { replace: true });
  };

  return (
    <div className="taskly-page">
      <div className="taskly-container">
        <header className="taskly-header">
          <div className="brand">
            <div className="brand-icon">
              <ListTodo size={25} />
            </div>
            <h1>
              Taskly<span>.</span>
            </h1>
          </div>

          <p>Make every task count.</p>

          <button
            className="logout-btn"
            onClick={handleLogout}
            disabled={loading !== ""}
          >
            {loading === "logout" ? (
              <ClipLoader size={16} color="#ffffff" />
            ) : (
              <>
                <LogOut size={17} /> Logout
              </>
            )}
          </button>
        </header>

        <main className="taskly-card">
          <div className="taskly-top">
            <div className="taskly-heading">
              <h2>My Tasks</h2>
              <p>Keep your day organized.</p>
            </div>

            <div className="taskly-tools">
              <div className="task-count">
                <span>{todos.length}</span>
                <p>Total Tasks</p>
              </div>

              <button
                className="download-btn"
                onClick={downloadPDF}
                disabled={loading !== "" || todos.length === 0}
              >
                {loading === "download" ? (
                  <ClipLoader size={16} color="#ffffff" />
                ) : (
                  <>
                    <Download size={16} /> Download Tasks
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="taskly-input">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              disabled={loading !== ""}
            />

            <button onClick={addTodo} disabled={loading !== "" || !user}>
              {loading === "add" || loading === "update" ? (
                <ClipLoader size={16} color="#ffffff" />
              ) : editId !== null ? (
                <>
                  <Check size={18} /> Update
                </>
              ) : (
                <>
                  <Plus size={18} /> Add Task
                </>
              )}
            </button>
          </div>

          <div className="taskly-list">
            {loading === "fetch" ? (
              <div className="empty-state">
                <ClipLoader size={25} color="#244b80" />
                <p>Loading tasks...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <ListTodo size={30} />
                </div>
                <h3>No tasks yet</h3>
                <p>Add your first task and get started.</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div className="task-item" key={todo.id}>
                  <div className="task-info">
                    <span className="task-dot"></span>
                    <p>{todo.text}</p>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() => editTodo(todo)}
                      title="Edit task"
                      disabled={loading !== ""}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => setDeleteId(todo.id)}
                      title="Delete task"
                      disabled={loading !== ""}
                    >
                      {loading === "delete" ? (
                        <ClipLoader size={15} color="#ffffff" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {todos.length > 0 && (
            <div className="taskly-footer">
              You have {todos.length} tasks to manage.
            </div>
          )}
        </main>

        <p className="taskly-bottom">Stay focused. Keep moving forward.</p>

        <ConfirmDialog
          open={deleteId !== null}
          title="Delete this task?"
          message="This task will be permanently removed."
          confirmText="Delete Task"
          isLoading={loading === "delete"}
          onCancel={() => setDeleteId(null)}
          onConfirm={deleteTodo}
        />
      </div>
    </div>
  );
};

export default Todo;

import React, { useState } from "react";
import "../styles/PollCard.css"; // reuse styles, plus we assume Results.css is loaded

export default function CreatePollModal({ onClose, onCreate }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const updateOpt = (idx, val) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)));
  };

  const addOption = () => {
    if (options.length >= 20) return;
    setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (idx) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e) => {
    e.preventDefault();
    const cleanOptions = options.map((o) => o.trim()).filter((o) => o);
    if (!question.trim()) return alert("Question required");
    if (cleanOptions.length < 2) return alert("At least two options required");
    setLoading(true);
    try {
      await onCreate({ question: question.trim(), options: cleanOptions });
    } catch (err) {
      alert(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Create Poll</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </header>

        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 0.95 }}>
            Question
          </label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              color: "var(--card)",
            }}
          />

          <div style={{ marginTop: 12 }}>
            <label
              style={{ display: "block", marginBottom: 6, fontSize: 0.95 }}
            >
              Options
            </label>
            {options.map((opt, idx) => (
              <div
                key={idx}
                style={{ display: "flex", gap: 8, marginBottom: 8 }}
              >
                <input
                  value={opt}
                  onChange={(e) => updateOpt(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    color: "var(--card)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  −
                </button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={addOption}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "transparent",
                  color: "var(--card)",
                  cursor: "pointer",
                }}
              >
                + Add option
              </button>
              <span style={{ color: "var(--muted)", alignSelf: "center" }}>
                {options.length} options
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "transparent",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "var(--accent)",
                color: "#012",
                cursor: "pointer",
              }}
            >
              {loading ? "Creating..." : "Create Poll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

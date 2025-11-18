import React, { useEffect, useMemo, useState } from "react";
import { fetchPolls, vote, createPoll } from "./api";
import PollList from "./components/PollList";
import CreatePollModal from "./components/CreatePollModal";
import "./styles/base.css";
import "./styles/Results.css";
import { debounce } from "./utils/debounce";

export default function App() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchPolls()
      .then((data) => {
        if (mounted) setPolls(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const debouncedVote = useMemo(
    () =>
      debounce(async (pollId, optionId) => {
        try {
          const res = await vote(pollId, optionId);
          setPolls((prev) =>
            prev.map((p) => (p._id === pollId ? res.poll : p))
          );
        } catch (err) {
          alert("Vote failed: " + err.message);
        }
      }, 400),
    []
  );

  const onVote = (pollId, optionId) => {
    // optimistic update first (so UI reacts instantly)
    setPolls((prev) =>
      prev.map((p) =>
        p._id === pollId
          ? {
              ...p,
              options: p.options.map((o) =>
                o._id === optionId ? { ...o, votes: o.votes + 1 } : o
              ),
            }
          : p
      )
    );

    debouncedVote(pollId, optionId);
  };

  const handleCreate = async ({ question, options }) => {
    try {
      const newPoll = await createPoll(question, options);
      // prepend new poll so it's visible immediately
      setPolls((prev) => [newPoll, ...prev]);
      setShowCreate(false);
    } catch (err) {
      alert("Create poll failed: " + err.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="header">
        <h1>Live Polls</h1>
        <p className="sub">Vote on short, fun polls — mobile-first UI</p>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "var(--card)",
              cursor: "pointer",
            }}
          >
            + Create Poll
          </button>
        </div>
      </header>

      <main className="main">
        {loading && <div className="center">Loading polls...</div>}
        {error && <div className="center error">{error}</div>}
        {!loading && !error && <PollList polls={polls} onVote={onVote} />}
      </main>

      <footer className="footer">
        <small>Phase 3 — Results & Create Poll</small>
      </footer>

      {showCreate && (
        <CreatePollModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

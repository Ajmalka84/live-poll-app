import React, { useEffect, useState } from "react";
import { fetchPolls, unvote, vote } from "./api";
import PollList from "./components/PollList";

export default function App() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchPolls()
      .then((data) => {
        console.log("polls =>", data);
        if (mounted) setPolls(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    // return () => {
    //   mounted = false;
    // };
  }, []);

  const onVote = async (pollId, optionId) => {
    // optimistic update: increment locally then call API
    setPolls((prev) =>
      prev.map((p) => {
        if (p._id !== pollId) return p;
        return {
          ...p,
          options: p.options.map((o) =>
            o._id === optionId ? { ...o, votes: o.votes + 1, _voting: true } : o
          ),
        };
      })
    );

    try {
      const res = await vote(pollId, optionId);
      // update with server response (safe)
      setPolls((prev) => prev.map((p) => (p._id === pollId ? res.poll : p)));
    } catch (err) {
      // rollback optimistic update on error
      setPolls((prev) =>
        prev.map((p) => {
          if (p._id !== pollId) return p;
          return {
            ...p,
            options: p.options.map((o) =>
              o._id === optionId ? { ...o, votes: Math.max(0, o.votes - 1) } : o
            ),
          };
        })
      );
      alert("Vote failed: " + err.message);
    }
  };

  const onUnvote = async (pollId, optionId) => {
    // similar to onVote but for unvoting
    setPolls((prev) =>
      prev.map((p) => {
        if (p._id !== pollId) return p;
        return {
          ...p,
          options: p.options.map((o) =>
            o._id === optionId
              ? { ...o, votes: Math.max(0, o.votes - 1), _voting: true }
              : o
          ),
        };
      })
    );

    try {
      const res = await unvote(pollId, optionId);
      setPolls((prev) => prev.map((p) => (p._id === pollId ? res.poll : p)));
    } catch (err) {
      setPolls((prev) =>
        prev.map((p) => {
          if (p._id !== pollId) return p;
          return {
            ...p,
            options: p.options.map((o) =>
              o._id === optionId ? { ...o, votes: o.votes + 1 } : o
            ),
          };
        })
      );
      alert("Unvote failed: " + err.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="header">
        <h1 style={{ textAlign: "center" }}>Live Polls</h1>
        <p className="sub" style={{ textAlign: "center" }}>
          Vote on short, fun polls — mobile-first UI
        </p>
      </header>

      <main className="main">
        {loading && <div className="center">Loading polls...</div>}
        {error && <div className="center error">{error}</div>}
        {!loading && !error && (
          <PollList polls={polls} onVote={onVote} onUnvote={onUnvote} />
        )}
      </main>

      <footer className="footer">
        <small>Phase 2 — Voting UI • Backend: localhost:5001</small>
      </footer>
    </div>
  );
}

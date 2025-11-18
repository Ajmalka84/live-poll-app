import React, { useState, useMemo } from "react";
import "../styles/PollCard.css";

export default function PollCard({ poll, onVote }) {
  const [votingOption, setVotingOption] = useState(null);

  // compute total votes (cheap, optional to memoize)
  const totalVotes = useMemo(
    () => poll.options.reduce((s, o) => s + (o.votes || 0), 0),
    [poll]
  );

  const handleClick = async (optionId) => {
    if (votingOption) return;
    setVotingOption(optionId);
    try {
      // parent handles optimistic update and final reconciliation
      await onVote(poll._id, optionId);
    } catch (err) {
      // parent already handles rollback / alert; keep this catch to ensure state updated
      console.error("Vote error:", err);
    } finally {
      setVotingOption(null);
    }
  };

  return (
    <article className="poll-card">
      <h3 className="question">{poll.question}</h3>

      <div className="options">
        {poll.options.map((opt) => {
          const percent =
            totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);

          return (
            <div
              key={opt._id}
              className="option-block"
              style={{ marginBottom: "1rem" }}
            >
              <button
                className={`option-btn ${
                  votingOption === opt._id ? "voting" : ""
                }`}
                onClick={() => handleClick(opt._id)}
                disabled={!!votingOption}
                aria-pressed={false}
                type="button"
                style={{ width: "100%", marginBottom: "0.5rem" }}
              >
                <span className="opt-left">
                  <span className="opt-text">{opt.text}</span>
                </span>

                <span className="opt-right">
                  <span
                    className="opt-votes"
                    aria-label={`${opt.votes} votes`}
                    style={{ marginRight: "0.5rem" }}
                  >
                    {opt.votes} vote{opt.votes !== 1 ? "s" : ""}
                  </span>
                  <span className="opt-percent" aria-hidden>
                    {percent}%
                  </span>
                </span>
              </button>

              <div className="result-bar-wrap" aria-hidden>
                <div
                  className="result-bar-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

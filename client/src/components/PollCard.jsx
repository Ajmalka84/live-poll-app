import React, { useState } from "react";
import "../styles/PollCard.css";

export default function PollCard({ poll, onVote, onUnvote }) {
  const [votingOption, setVotingOption] = useState(null);
  console.log(onUnvote);
  const handleClick = async (optionId) => {
    if (votingOption) return; // prevent multi-click
    setVotingOption(optionId);
    try {
      await onVote(poll._id, optionId);
      // show a brief confirmation animation by toggling a class
      // we clear votingOption after a short delay so button re-enabled
    } finally {
      setTimeout(() => setVotingOption(null), 700);
    }
  };

  return (
    <article className="poll-card">
      <h3 className="question">{poll.question}</h3>

      <div className="options">
        {poll.options.map((opt) => (
          <div key={opt._id} style={{ display: "flex", gap: "0.25rem" }}>
            <button
              key={opt._id}
              className={`option-btn ${
                votingOption === opt._id ? "voting" : ""
              }`}
              style={{ flex: 10 }}
              onClick={() => handleClick(opt._id)}
              disabled={!!votingOption}
              aria-pressed={false}
            >
              <span className="opt-text">{opt.text}</span>
              <span className="opt-votes">{opt.votes}</span>
            </button>
            {/* <button
              key={opt._id + "-unvote"}
              className={`option-btn ${
                votingOption === opt._id ? "voting" : ""
              }`}
              style={{ flex: 2 }}
              onClick={() => onUnvote(poll._id, opt._id)}
              disabled={!!votingOption}
              aria-pressed={false}
            >
              Unvote
            </button> */}
          </div>
        ))}
      </div>
    </article>
  );
}

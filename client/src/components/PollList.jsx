import React from "react";
import PollCard from "./PollCard";

export default function PollList({ polls, onVote }) {
  if (!polls.length) return <div className="center muted">No polls yet</div>;
  return (
    <div className="poll-list">
      {polls.map((p) => (
        <PollCard key={p._id} poll={p} onVote={onVote} />
      ))}
    </div>
  );
}

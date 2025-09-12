// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { getElections, getElection, postVote } from "../utils/api";
import AuthContext from "../contexts/authContext";
import ElectionCard from "../components/ElectionCard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const token = user?.token || null;
  const walletAddress = user?.walletAddress?.toLowerCase?.() || null;

  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);
  const [userVoteMap, setUserVoteMap] = useState({}); // electionId -> { hasVoted, score }
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const data = await getElections({ token, page: 1, limit: 25 });
        const list = Array.isArray(data.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : data.results || [];
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (!mounted) return;
        setElections(list);

        if (token && walletAddress && list.length > 0) {
          const details = await Promise.all(
            list.map((el) =>
              getElection(el._id, token).catch((e) => ({ error: e }))
            )
          );

          const map = {};
          for (let i = 0; i < list.length; i++) {
            const el = list[i];
            const dr = details[i];

            if (dr && Array.isArray(dr.votes)) {
              const votes = dr.votes;
              const total = votes.length;
              const avg = total
                ? votes.reduce((s, v) => s + Number(v.score || 0), 0) / total
                : 0;

              const found = votes.find(
                (v) =>
                  (v.voter?.walletAddress || "").toLowerCase() === walletAddress
              );
              if (found) map[el._id] = { hasVoted: true, score: found.score };
              else map[el._id] = { hasVoted: false, score: null };

              el.averageScore = avg;
              el.totalVotes = total;
            } else {
              map[el._id] = { hasVoted: false, score: null };
            }
          }

          if (mounted) setUserVoteMap(map);
        } else {
          setUserVoteMap({});
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        if (mounted) setError("Failed to load elections");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
  }, [token, walletAddress]);

  const refreshElectionDetail = async (electionId) => {
    try {
      const dr = await getElection(electionId, token);
      if (!dr) return;
      const votes = dr.votes || [];
      const total = dr.totalVotes ?? (votes.length || 0);
      const avg =
        dr.averageScore ??
        (votes.length
          ? votes.reduce((s, v) => s + Number(v.score || 0), 0) / votes.length
          : 0);

      setElections((prev) =>
        prev.map((el) =>
          String(el._id) === String(electionId)
            ? { ...el, averageScore: avg, totalVotes: total }
            : el
        )
      );

      if (user?.walletAddress) {
        const found = votes.find(
          (v) =>
            (v.voter?.walletAddress || "").toLowerCase() ===
            user.walletAddress.toLowerCase()
        );
        setUserVoteMap((prev) => ({
          ...prev,
          [electionId]: found
            ? { hasVoted: true, score: found.score }
            : { hasVoted: false, score: null },
        }));
      }
    } catch (err) {
      console.error("refreshElectionDetail error:", err);
    }
  };

  const handleVote = async (electionId, score) => {
    if (!token) {
      alert("You must be logged in to vote");
      return;
    }

    try {
      const res = await postVote(electionId, score, token);

      if (!res.ok) {
        const msg =
          res.error?.message || JSON.stringify(res.error) || "Vote failed";
        if (
          res.status === 400 &&
          String(msg).toLowerCase().includes("already")
        ) {
          alert("You already voted for this election.");
          await refreshElectionDetail(electionId);
          setUserVoteMap((prev) => ({
            ...prev,
            [electionId]: {
              hasVoted: true,
              score: prev[electionId]?.score || null,
            },
          }));
          return;
        }
        alert(msg);
        return;
      }

      const data = res.data || {};
      setUserVoteMap((prev) => ({
        ...prev,
        [electionId]: { hasVoted: true, score },
      }));

      if (
        typeof data.newAverage !== "undefined" ||
        typeof data.newTotal !== "undefined"
      ) {
        setElections((prev) =>
          prev.map((el) =>
            String(el._id) === String(electionId)
              ? {
                  ...el,
                  averageScore: data.newAverage ?? el.averageScore,
                  totalVotes:
                    data.newTotal ?? (el.totalVotes ? el.totalVotes + 1 : 1),
                }
              : el
          )
        );
      } else if (
        typeof data.averageScore !== "undefined" ||
        typeof data.totalVotes !== "undefined"
      ) {
        setElections((prev) =>
          prev.map((el) =>
            String(el._id) === String(electionId)
              ? {
                  ...el,
                  averageScore: data.averageScore ?? el.averageScore,
                  totalVotes:
                    data.totalVotes ?? (el.totalVotes ? el.totalVotes + 1 : 1),
                }
              : el
          )
        );
      } else {
        await refreshElectionDetail(electionId);
      }

      alert(data.message || "Vote recorded");
    } catch (err) {
      console.error("vote error:", err);
      alert(err?.message || "Failed to submit vote");
    }
  };

  if (loading)
    return (
      <div className="card">
        <p>Loading elections...</p>
      </div>
    );
  if (error)
    return (
      <div className="card">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  if (!elections.length)
    return (
      <div className="card">
        <h2>No elections yet</h2>
      </div>
    );

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Elections</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {elections.map((el) => (
          <ElectionCard
            key={el._id}
            election={el}
            userInfo={userVoteMap[el._id]}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}

// frontend/src/pages/Dashboard.jsx
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElections, setTotalElections] = useState(0);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const data = await getElections({
          token,
          page: currentPage,
          limit: itemsPerPage,
        });
        const list = Array.isArray(data.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : data.results || [];
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (!mounted) return;
        setElections(list);

        // Update pagination info
        if (data.total !== undefined) {
          setTotalElections(data.total);
          setTotalPages(Math.ceil(data.total / itemsPerPage));
        } else {
          setTotalElections(list.length);
          setTotalPages(1);
        }

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
  }, [token, walletAddress, currentPage, itemsPerPage]);

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

  // Pagination functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className="pagination-btn pagination-nav"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        ← Previous
      </button>
    );

    // Add separator if there are page numbers
    if (startPage <= endPage) {
      pages.push(<div key="separator1" className="pagination-separator" />);
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Add separator before next button
    if (startPage <= endPage) {
      pages.push(<div key="separator2" className="pagination-separator" />);
    }

    // Next button
    pages.push(
      <button
        key="next"
        className="pagination-btn pagination-nav"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        Next →
      </button>
    );

    return pages;
  };

  if (loading)
    return (
      <div className="card">
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <div
            className="loading-spinner"
            style={{ marginBottom: "var(--space-4)" }}
          ></div>
          <p>Loading elections...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="card">
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <div
            style={{
              color: "var(--error-600)",
              fontSize: "3rem",
              marginBottom: "var(--space-4)",
            }}
          >
            ⚠️
          </div>
          <p style={{ color: "var(--error-600)", fontSize: "1.125rem" }}>
            {error}
          </p>
        </div>
      </div>
    );

  if (!elections.length)
    return (
      <div className="card">
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
            🗳️
          </div>
          <h2 style={{ marginBottom: "var(--space-2)" }}>No elections yet</h2>
          <p style={{ color: "var(--gray-600)" }}>
            Check back later for new voting opportunities!
          </p>
        </div>
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-6)",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "var(--gray-900)",
              margin: 0,
              background:
                "linear-gradient(135deg, var(--primary-600), var(--primary-800))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            📊 Elections Dashboard
          </h1>
          <p
            style={{
              color: "var(--gray-600)",
              margin: "var(--space-2) 0 0 0",
              fontSize: "1rem",
            }}
          >
            {totalElections} total election{totalElections !== 1 ? "s" : ""} •
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        {elections.map((el) => (
          <ElectionCard
            key={el._id}
            election={el}
            userInfo={userVoteMap[el._id]}
            onVote={handleVote}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {renderPagination()}
          <div className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalElections)} of{" "}
            {totalElections}
          </div>
        </div>
      )}
    </div>
  );
}

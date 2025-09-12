// src/pages/ElectionDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function ElectionDetail() {
  const { id } = useParams();
  return (
    <div className="card">
      <h2>Election Detail</h2>
      <p>Election ID: {id}</p>
      <p>
        This page will show transaction details and allow voting (1-5 score).
      </p>
    </div>
  );
}

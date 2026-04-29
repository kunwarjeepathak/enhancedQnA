import React, { useState, useEffect } from 'react';
import QACard from './QACard';
import data from '../data/qa-data';
import type { QACardData } from '../data/qa-data';

interface QAListProps {
  category: string;
  searchTerm: string;
}

export default function QAList({ category, searchTerm }: QAListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  let filtered: QACardData[] = [];
  if (category === 'all') {
    filtered = (data as QACardData[]).filter(card => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.subItems.some(si =>
          si.question.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesSearch;
    });
  } else {
    filtered = (data as QACardData[]).filter(card => {
      const inCategory = card.category === category;
      const matchesSearch =
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.subItems.some(si =>
          si.question.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return inCategory && matchesSearch;
    });
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [category, searchTerm]);

  return (
    <main className="content">
      {paginated.map(card => (
        <QACard key={card.title} card={card} />
      ))}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>
          <div className="pagination-info">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}

import React from 'react';

export default function displayDate(date: Date, format: 'datetime' | 'date' | 'date-without-year' | 'date-left' | 'time-left'):string | number {
  const options: any = format === 'datetime' ? {
    year: "numeric", month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
  } : format === 'date' ? {
    year: "numeric", month: 'long', day: 'numeric'
  } : {
    month: 'long', day: 'numeric'
  };

  const now = new Date();
  const diffTime = new Date(date).setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (format === 'date-left') {
    return `${diffDays}`;
  }

  if (format === 'time-left') {
    const diffTime = new Date(date).getTime() - now.getTime();

    if (Math.abs(diffDays) >= 1) {
      return `${Math.abs(diffDays)}일`;
    }

    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (Math.abs(diffHours) >= 1) {
      return `${Math.abs(diffHours)}시간`;
    }

    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    if (Math.abs(diffMinutes) >= 1) {
      return `${Math.abs(diffMinutes)}분`;
    }

    const diffSeconds = Math.floor(diffTime / 1000);
    if (Math.abs(diffSeconds) >= 1) {
      return `${Math.abs(diffSeconds)}초`;
    }

    return '방금';
  }

  return new Date(date).toLocaleDateString('ko-KR', options);
}
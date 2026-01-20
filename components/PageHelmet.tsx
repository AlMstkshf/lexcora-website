import React, { useEffect } from 'react';

interface PageHelmetProps {
  title: string;
  description: string;
}

export const PageHelmet: React.FC<PageHelmetProps> = ({ title, description }) => {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [title, description]);

  return null;
};

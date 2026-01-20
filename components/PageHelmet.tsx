import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageHelmetProps {
  title: string;
  description: string;
}

export const PageHelmet: React.FC<PageHelmetProps> = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

import rawArticles from '../data/articles.json';
import { ArticleRecord, Language } from '../types';

const articles = rawArticles as ArticleRecord[];

export const getArticles = (lang: Language): ArticleRecord[] =>
  articles.filter((article) => article.lang === lang);

export const getFeaturedArticles = (lang: Language, limit = 6): ArticleRecord[] =>
  getArticles(lang).slice(0, limit);

export const getArticleBySlug = (slug: string, lang: Language): ArticleRecord | undefined =>
  getArticles(lang).find((article) => article.slug === slug);

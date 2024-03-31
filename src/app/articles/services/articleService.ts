import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Article } from "../models/Article";

const articlesDirectory = path.join(process.cwd(), "articles"); // Replace with your articles directory

export function getArticleSlugs() {
  return fs
    .readdirSync(articlesDirectory)
    .filter((file) => path.extname(file) === ".md");
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    id: data.id, // Add a unique identifier for the article
    slug: slug, // Use the slug as the URL identifier
    title: data.title, // Add the title from the front matter
    excerpt: data.excerpt, // Add an excerpt from the front matter
    content: contentHtml, // Use the processed content as HTML
    publishDate: data.publishDate, // Add the publish date from the front matter
    author: data.author, // Add the author from the front matter
    coverImage: data.coverImage, // Add the cover image from the front matter
    tags: data.tags, // Add the tags from the front matter
  };
}

// Inside of models/Article.ts
// id: string; // Unique identifier for the article
// slug: string; // URL-friendly identifier used in dynamic routes
// title: string; // Title of the article
// excerpt: string; // A short summary or teaser of the article
// content: string; // The HTML or Markdown content of the article
// publishDate: string; // ISO date string when the article was published
// author: string; // Name of the author
// coverImage?: string; // Optional URL to a cover image for the article
// tags?: string[]; // Optional array of tags related to the article

export async function getAllArticles(): Promise<Article[]> {
  const slugs = getArticleSlugs();
  const articlesPromises = slugs.map((slug) =>
    getArticleBySlug(slug.replace(/\.md$/, "")),
  );
  const articles = await Promise.all(articlesPromises);
  return articles;
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Article } from "../models/Article";

const articlesDirectory = path.join(process.cwd(), "public/articles"); // Replace with your articles directory

export function getArticleSlugs() {
  // Get file names under /articles
  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames.map((fileName) => {
    // Remove ".md" from file name to get slugs
    return fileName.replace(/\.md$/, "");
  });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  if (!data.id) {
    throw new Error(`Missing 'id' in the frontmatter of ${slug}.md`);
  }

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

export async function getAllArticles(): Promise<Article[]> {
  const slugs = getArticleSlugs();
  const articlesPromises = slugs.map((slug) =>
    getArticleBySlug(slug.replace(/\.md$/, "")),
  );
  const articles = await Promise.all(articlesPromises);
  return articles;
}

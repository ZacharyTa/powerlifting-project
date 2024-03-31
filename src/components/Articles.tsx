import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import React from "react";

// Define the directory where the articles are stored
const articlesDirectory = path.join(process.cwd(), "public/articles");

export async function getStaticProps() {
  // Get file names under /articles
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slugs
    const slug = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const { data } = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      ...data,
    };
  });

  return {
    props: {
      articles,
    },
  };
}

export default function Articles({ articles }) {
  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`}>
              <a>{article.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

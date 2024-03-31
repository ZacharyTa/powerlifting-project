import React from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import { Article } from "../../src/app/articles/models/Article";
import { getAllArticles } from "../../src/app/articles/services/articleService"; // This would be a function you create to read all articles

interface ArticlesProps {
  articles: Article[];
}

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
  const articles = await getAllArticles(); // Fetch all articles from the local files

  return {
    props: {
      articles,
    },
  };
};

const ArticlesListPage: React.FC<ArticlesProps> = ({ articles }) => {
  return (
    <section>
      {articles.map((article) => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <Link href={`/articles/${article.slug}`}>
            <a>Read more</a>
          </Link>
        </article>
      ))}
    </section>
  );
};

export default ArticlesListPage;

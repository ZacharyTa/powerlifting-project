import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Article from "../../src/components/Article"; // If you have set up absolute paths
import { Article as IArticle } from "../../src/app/articles/models/Article"; // Adjust the import according to your path setup
import {
  getArticleSlugs,
  getArticleBySlug,
} from "../../src/app/articles/services/articleService"; // Adjust the import according to your path setup
import React from "react";

interface ArticlePageProps {
  article: IArticle; // The article object
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  return (
    <>
      <Head>
        <title>{article.title} - Test::Barbell Metric:: </title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.coverImage} />
        <meta
          property="og:url"
          content={`http://localhost:3000/articles/${article.slug}`}
        />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.publishDate} />
        <meta property="article:author" content={article.author} />
        <link
          rel="canonical"
          href={`http://localhost:3000/articles/${article.slug}`}
        />
        {/* Other SEO tags */}
      </Head>
      <Article {...article} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const slugs = getArticleSlugs();
    console.log("Slugs:", slugs);
    const paths = slugs.map((slug) => ({ params: { slug } }));
    console.log("Paths:", paths);

    return { paths, fallback: false };
  } catch (error) {
    console.error("getStaticPaths error:", error);
    throw error; // rethrow the error to see it in the terminal
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    console.log("Slug:", slug);
    const article = await getArticleBySlug(slug);
    console.log("Article:", article);

    if (!article) {
      return { notFound: true };
    }

    return { props: { article } };
  } catch (error) {
    console.error("getStaticProps error:", error);
    throw error; // rethrow the error to see it in the terminal
  }
};

export default ArticlePage;

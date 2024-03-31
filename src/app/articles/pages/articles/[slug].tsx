import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Article from "@/components/Article"; // If you have set up absolute paths
import { Article as IArticle } from "@/models/Article"; // Adjust the import according to your path setup
import { getArticleSlugs, getArticleBySlug } from "@/services/articleService"; // Adjust the import according to your path setup
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
          content={`https://www.yoursite.com/articles/${article.slug}`}
        />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.publishDate} />
        <meta property="article:author" content={article.author} />
        <link
          rel="canonical"
          href={`https://www.yoursite.com/articles/${article.slug}`}
        />
        {/* Other SEO tags */}
      </Head>
      <Article {...article} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getArticleSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const article = await getArticleBySlug(slug);

  return {
    props: {
      article,
    },
  };
};

export default ArticlePage;

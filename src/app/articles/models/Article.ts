export interface Article {
  id: string; // Unique identifier for the article
  slug: string; // URL-friendly identifier used in dynamic routes
  title: string; // Title of the article
  excerpt: string; // A short summary or teaser of the article
  content: string; // The HTML or Markdown content of the article
  publishDate: string; // ISO date string when the article was published
  author: string; // Name of the author
  coverImage?: string; // Optional URL to a cover image for the article
  tags?: string[]; // Optional array of tags related to the article
  // You can add more fields that are relevant to your articles
}

// // Example usage of the Article interface
// const exampleArticle: Article = {
//   id: 'unique-article-id',
//   slug: 'my-first-article',
//   title: 'My First Article',
//   excerpt: 'This is an excerpt from my first article.',
//   content: 'Here is the full content of the article...',
//   publishDate: '2021-01-01T00:00:00.000Z',
//   author: 'Author Name',
//   coverImage: 'https://example.com/path-to-your-image.jpg',
//   tags: ['Tag1', 'Tag2'],
// };

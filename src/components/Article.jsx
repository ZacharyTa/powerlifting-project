export default function Article({ title, content }) {
  return (
    <article className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold leading-tight mb-4">{title}</h1>
      <div className="prose lg:prose-xl">
        {/* Temporary text for testing */}
        <p> Article Component </p>
        {/* Content will be rendered here */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </article>
  );
}

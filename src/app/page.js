import Card from "../components/landing/Card";
import { ARTICLES } from "../data/landing/Articles";

export default function Home() {
  return (
    <>
      <div className="w-1/2 flex items-center justify-center h-2/3">
        <div className="flex flex-col w-1/2">
          <div className="text-7xl font-bold">Barbell Metrics</div>
          <div className="text-xl">
            Barbell Metrics compares you against USA Powerlifting competitors
            and lets you visualize those results!
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center text-6xl font-bold my-5">
        See Articles
      </div>
      <div className="grid grid-cols-2 gap-x-10 mx-5 my-[5%]">
        {ARTICLES.map((article, index) => (
          <Card
            key={index}
            title={article.title}
            description={article.description}
            img={article.image}
          />
        ))}
      </div>
    </>
  );
}

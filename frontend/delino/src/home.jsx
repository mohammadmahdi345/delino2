import Food from "./foods";
import Restorant from "./restorant";

const Home = () => {
  return (
    <main className="home-page">
      <header className="home-header">
        <h1>🍽️ صفحه اصلی</h1>
        <p>مشاهده فهرست غذاها و رستوران‌ها</p>
      </header>

      <section className="home-content">
        <Food />
        <Restorant />
      </section>
    </main>
  );
};

export default Home;
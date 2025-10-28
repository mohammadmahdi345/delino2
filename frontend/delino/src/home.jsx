import BestRestorant from "./best-res";
import Food from "./foods";
import Restorant from "./restorant";

const Home = () => {
  return (
    <main className="home-page">
      <header className="home-header">
        <h1>🍴 خوش آمدید به دنیای طعم‌ها</h1>
        <p>بهترین رستوران‌ها و غذاهای محلی نزدیک را کشف کنید</p>
      </header>

      <section className="home-content">
        <BestRestorant />
        <Food />
        <Restorant />
      </section>
    </main>
  );
};

export default Home;
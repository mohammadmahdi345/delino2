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


      {/* Best / featured restorant (kept where it was) */}
      <BestRestorant />

      <section className="home-content container">
        {/* label above Food */}
        <section
          className="section-label section-label-food"
          aria-labelledby="label-food"
        >
          <h3 id="label-food" className="label-title">
            غذاهای محبوب
          </h3>
          <p className="label-subtitle">طعم‌هایی که مردم همین امروز سفارش می‌دهند</p>
        </section>

        <Food />

        {/* label above Restorant */}
        <section
          className="section-label section-label-res"
          aria-labelledby="label-res"
        >
          <h3 id="label-res" className="label-title">
            رستوران‌های منتخب
          </h3>
          <p className="label-subtitle">مکان‌هایی که نباید از دست بدهید</p>
        </section>

        <Restorant />
      </section>
    </main>
  );
};

export default Home;
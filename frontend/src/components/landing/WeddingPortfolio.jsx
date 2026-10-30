import PortfolioGallery from "./PortfolioGallery";
import SectionHeading from "@/components/common/SectionHeading";
import { WEDDING_PORTFOLIO } from "@/data/demoContent";
const categories = ["Bride", "Groom", "Couple", "Ceremony", "Reception", "Family", "Candid Moments"];
function WeddingPortfolio() {
  return <section id="wedding" className="section-pad bg-ink-950"><div className="container-max">
    <SectionHeading
      eyebrow="Wedding Portfolio"
      title="Weddings, framed forever"
      subtitle={"A curated selection from our wedding archives \u2014 rituals, portraits and candid moments from celebrations across India."}
    />
    <PortfolioGallery photos={WEDDING_PORTFOLIO} categories={categories} />
  </div></section>;
}
export {
  WeddingPortfolio as default
};

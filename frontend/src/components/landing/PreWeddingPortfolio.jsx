import PortfolioGallery from "./PortfolioGallery";
import SectionHeading from "@/components/common/SectionHeading";
import { PREWEDDING_PORTFOLIO } from "@/data/demoContent";
const categories = ["Outdoor", "Cinematic", "Destination"];
function PreWeddingPortfolio() {
  return <section id="pre-wedding" className="section-pad bg-ink-900"><div className="container-max">
    <SectionHeading
      eyebrow="Pre-Wedding Stories"
      title="Before the big day begins"
      subtitle={"Relaxed, romantic pre-wedding shoots at destinations the couple loves \u2014 from forts and mountains to old-city streets."}
    />
    <PortfolioGallery photos={PREWEDDING_PORTFOLIO} categories={categories} />
  </div></section>;
}
export {
  PreWeddingPortfolio as default
};

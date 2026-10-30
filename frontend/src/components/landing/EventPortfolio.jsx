import PortfolioGallery from "./PortfolioGallery";
import SectionHeading from "@/components/common/SectionHeading";
import { EVENT_PORTFOLIO } from "@/data/demoContent";
const categories = ["Birthday", "Engagement", "Anniversary", "Corporate"];
function EventPortfolio() {
  return <section id="events" className="section-pad bg-ink-950"><div className="container-max">
    <SectionHeading
      eyebrow="Event Coverage"
      title="Every celebration, beautifully told"
      subtitle={"Birthdays, engagements, anniversaries and corporate events \u2014 covered with the same care and artistry as our weddings."}
    />
    <PortfolioGallery photos={EVENT_PORTFOLIO} categories={categories} />
  </div></section>;
}
export {
  EventPortfolio as default
};

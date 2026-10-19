import { BRANDS, type BrandSlug } from "@/lib/brands";
import { LogoAnimated } from "./LogoAnimated";
import { Preloader } from "./Preloader";

/** Intro con el monograma dibujándose: solo en el inicio de cada marca. */
export function BrandIntro({ slug }: { slug: BrandSlug }) {
  const brand = BRANDS[slug];
  return (
    <Preloader caption={brand.descriptor}>
      <LogoAnimated name={brand.monogram} />
    </Preloader>
  );
}

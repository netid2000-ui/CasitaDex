import { useEffect } from "react";
import { useTheme } from "./ui";

/** Honor the app's explicit appearance preference as well as System. */
export function BrandWebMeta() {
  const { dark, colors } = useTheme();
  useEffect(() => {
    const link = document.getElementById("casitadex-favicon") as HTMLLinkElement | null;
    if (link) {
      link.href = `/brand/favicon-${dark ? "dark" : "light"}-32.png`;
      document.head.appendChild(link);
    }
    const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (theme) theme.content = colors.paper;
  }, [dark, colors.paper]);
  return null;
}

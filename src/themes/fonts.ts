import React from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { getAvailableFonts } from "@remotion/google-fonts";

/** Load the Google Fonts a theme DNA names (e.g. {body:"Sora"}). Non-Google names (".svg") are ignored. */
export const useThemeFonts = (fonts: Record<string, string>) => {
  const key = Object.values(fonts).join("|");
  const [handle] = React.useState(() => delayRender(`theme fonts: ${key}`));
  React.useEffect(() => {
    const names = [...new Set(Object.values(fonts))].filter(
      (n) => !n.endsWith(".svg"),
    );
    const all = getAvailableFonts();
    Promise.all(
      names.map(async (n) => {
        const f = all.find((x) => x.fontFamily === n);
        if (!f) return;
        const mod = await f.load();
        await mod.loadFont().waitUntilDone();
      }),
    )
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
};

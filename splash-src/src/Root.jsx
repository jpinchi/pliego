import { Composition } from "remotion";
import { PliegoSplash } from "./PliegoSplash";
import { PliegoSplashQuiet } from "./PliegoSplashQuiet";

export const RemotionRoot = () => (
  <>
    <Composition
      id="PliegoSplash"
      component={PliegoSplash}
      durationInFrames={66}
      fps={30}
      width={1040}
      height={640}
    />
    <Composition
      id="PliegoSplashQuiet"
      component={PliegoSplashQuiet}
      durationInFrames={36}
      fps={30}
      width={1040}
      height={640}
    />
  </>
);

import { Composition, Folder } from "remotion";
import { KormosCover } from "./kormos/Cover";
import { DURATION, KormosReel } from "./kormos/KormosReel";
import { FPS } from "./kormos/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Reels">
      <Composition id="KormosReel" component={KormosReel} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
      <Composition id="KormosCover" component={KormosCover} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    </Folder>
  );
};

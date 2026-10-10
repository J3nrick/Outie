import { Composition, Folder, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Opening } from "./Opening";
import { YourThings } from "./YourThings";
import { LocalContext } from "./LocalContext";
import { CheckAndRemind } from "./CheckAndRemind";
import { AtAGlance } from "./AtAGlance";
import { Closing } from "./Closing";
import {OutiePromo} from './promo/OutiePromo';
import {Hook} from './promo/Hook';
import {Meet} from './promo/Meet';
import {Things} from './promo/Things';
import {Context} from './promo/Context';
import {Departure} from './promo/Departure';
import {Checks} from './promo/Checks';
import {Widgets} from './promo/Widgets';
import {Finale} from './promo/Finale';
import {Momentum} from './promo/Momentum';
export const OutieDemo = () => {
  const { fps } = useVideoConfig();
  return <TransitionSeries>
    <TransitionSeries.Sequence name="Meet Outie" durationInFrames={7.5 * fps} premountFor={fps}><Opening /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
    <TransitionSeries.Sequence name="Choose your things" durationInFrames={10 * fps} premountFor={fps}><YourThings /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
    <TransitionSeries.Sequence name="Local intelligence" durationInFrames={13 * fps} premountFor={fps}><LocalContext /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
    <TransitionSeries.Sequence name="Check and remind" durationInFrames={12 * fps} premountFor={fps}><CheckAndRemind /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
    <TransitionSeries.Sequence name="Widgets" durationInFrames={11 * fps} premountFor={fps}><AtAGlance /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
    <TransitionSeries.Sequence name="Head out" durationInFrames={9 * fps} premountFor={fps}><Closing /></TransitionSeries.Sequence>
  </TransitionSeries>;
};
export const RemotionRoot = () => <>
  <Composition id="OutiePromo" component={OutiePromo} durationInFrames={1800} fps={30} width={1920} height={1080} />
  <Folder name="Promo-scenes">
    <Composition id="PromoHook" component={Hook} durationInFrames={169} fps={30} width={1920} height={1080}/>
    <Composition id="PromoMeet" component={Meet} durationInFrames={112} fps={30} width={1920} height={1080}/>
    <Composition id="PromoThings" component={Things} durationInFrames={225} fps={30} width={1920} height={1080}/>
    <Composition id="PromoContext" component={Context} durationInFrames={281} fps={30} width={1920} height={1080}/>
    <Composition id="PromoDeparture" component={Departure} durationInFrames={225} fps={30} width={1920} height={1080}/>
    <Composition id="PromoChecks" component={Checks} durationInFrames={169} fps={30} width={1920} height={1080}/>
    <Composition id="PromoWidgets" component={Widgets} durationInFrames={225} fps={30} width={1920} height={1080}/>
    <Composition id="PromoMomentum" component={Momentum} durationInFrames={169} fps={30} width={1920} height={1080}/>
    <Composition id="PromoFinale" component={Finale} durationInFrames={225} fps={30} width={1920} height={1080}/>
  </Folder>
  <Composition id="OutieDemo" component={OutieDemo} durationInFrames={1800} fps={30} width={1920} height={1080} />
  <Folder name="Scenes">
    <Composition id="Opening" component={Opening} durationInFrames={225} fps={30} width={1920} height={1080} />
    <Composition id="YourThings" component={YourThings} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="LocalContext" component={LocalContext} durationInFrames={390} fps={30} width={1920} height={1080} />
    <Composition id="CheckAndRemind" component={CheckAndRemind} durationInFrames={360} fps={30} width={1920} height={1080} />
    <Composition id="AtAGlance" component={AtAGlance} durationInFrames={330} fps={30} width={1920} height={1080} />
    <Composition id="Closing" component={Closing} durationInFrames={270} fps={30} width={1920} height={1080} />
  </Folder>
</>;

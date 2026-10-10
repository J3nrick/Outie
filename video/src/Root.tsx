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
import {ScriptOpening} from './hackathon/Opening';
import {ScriptSetup} from './hackathon/Setup';
import {ScriptContext} from './hackathon/Context';
import {ScriptReminder} from './hackathon/Reminder';
import {ScriptControl} from './hackathon/Control';
import {ScriptClosing} from './hackathon/Closing';
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
  <Composition id="OutiePromo" component={OutiePromo} defaultProps={{voiceoverSrc:"audio/outie-haven-aligned.wav",voiceoverVolume:1,musicVolume:0.82}} durationInFrames={1800} fps={30} width={1920} height={1080} />
  <Folder name="Script-scenes">
    <Composition id="ScriptOpening" component={ScriptOpening} durationInFrames={300} fps={30} width={1920} height={1080}/>
    <Composition id="ScriptSetup" component={ScriptSetup} durationInFrames={300} fps={30} width={1920} height={1080}/>
    <Composition id="ScriptContext" component={ScriptContext} durationInFrames={360} fps={30} width={1920} height={1080}/>
    <Composition id="ScriptReminder" component={ScriptReminder} durationInFrames={360} fps={30} width={1920} height={1080}/>
    <Composition id="ScriptControl" component={ScriptControl} durationInFrames={300} fps={30} width={1920} height={1080}/>
    <Composition id="ScriptClosing" component={ScriptClosing} durationInFrames={180} fps={30} width={1920} height={1080}/>
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

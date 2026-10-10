import {Audio} from '@remotion/media';
import {Series,staticFile,useVideoConfig} from 'remotion';
import {Hook} from './Hook';
import {Meet} from './Meet';
import {Things} from './Things';
import {Context} from './Context';
import {Departure} from './Departure';
import {Checks} from './Checks';
import {Widgets} from './Widgets';
import {Momentum} from './Momentum';
import {Finale} from './Finale';
export const OutiePromo = () => {
  const {fps}=useVideoConfig();
  return <>
    <Audio name="Original uplift score — 128 BPM" src={staticFile('audio/outie-uplift.wav')} durationInFrames={60*fps} premountFor={fps} volume={.88}/>
    <Audio name="Authored chimes and motion sounds" src={staticFile('audio/outie-motion-fx.wav')} durationInFrames={60*fps} premountFor={fps} volume={.4}/>
    <Series>
      <Series.Sequence name="Halfway out" durationInFrames={169} premountFor={fps}><Hook/></Series.Sequence>
      <Series.Sequence name="Meet Outie" durationInFrames={112} premountFor={fps}><Meet/></Series.Sequence>
      <Series.Sequence name="Your things" durationInFrames={225} premountFor={fps}><Things/></Series.Sequence>
      <Series.Sequence name="Local context" durationInFrames={281} premountFor={fps}><Context/></Series.Sequence>
      <Series.Sequence name="Departure reminder" durationInFrames={225} premountFor={fps}><Departure/></Series.Sequence>
      <Series.Sequence name="Unchecked only" durationInFrames={169} premountFor={fps}><Checks/></Series.Sequence>
      <Series.Sequence name="Widgets" durationInFrames={225} premountFor={fps}><Widgets/></Series.Sequence>
      <Series.Sequence name="More getting there" durationInFrames={169} premountFor={fps}><Momentum/></Series.Sequence>
      <Series.Sequence name="Head out" durationInFrames={225} premountFor={fps}><Finale/></Series.Sequence>
    </Series>
  </>;
};

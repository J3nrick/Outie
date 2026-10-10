import {Audio} from '@remotion/media';
import {Series,staticFile,useVideoConfig,interpolate,useCurrentFrame} from 'remotion';
import {ScriptOpening} from '../hackathon/Opening';
import {ScriptSetup} from '../hackathon/Setup';
import {ScriptContext} from '../hackathon/Context';
import {ScriptReminder} from '../hackathon/Reminder';
import {ScriptControl} from '../hackathon/Control';
import {ScriptClosing} from '../hackathon/Closing';
import {clamp} from './kit';
export type PromoProps={voiceoverSrc:string;voiceoverVolume:number;musicVolume:number};
export const OutiePromo=({voiceoverSrc='',voiceoverVolume=1,musicVolume=.82}:PromoProps)=>{
 const {fps}=useVideoConfig();const f=useCurrentFrame();
 return <>
  <Audio name="HEAD OUT — original 120 BPM score" src={staticFile('audio/outie-forward.wav')} durationInFrames={60*fps} premountFor={fps} volume={musicVolume*(voiceoverSrc?.length ? .20 : 1)*interpolate(f,[0,.6*fps,58.7*fps,60*fps],[0,1,1,0],clamp)}/>
  <Audio name="Script-synced cues" src={staticFile('audio/outie-script-fx.wav')} durationInFrames={60*fps} premountFor={fps} volume={.7}/>
  {voiceoverSrc?<Audio name="ElevenLabs voiceover" src={staticFile(voiceoverSrc)} durationInFrames={60*fps} premountFor={fps} volume={voiceoverVolume}/>:null}
  <Series>
   <Series.Sequence name="00–10 • Welcome and Makati at 1 PM" durationInFrames={10*fps} premountFor={fps}><ScriptOpening/></Series.Sequence>
   <Series.Sequence name="10–20 • Home and four essentials" durationInFrames={10*fps} premountFor={fps}><ScriptSetup/></Series.Sequence>
   <Series.Sequence name="20–32 • Calendar and local AI" durationInFrames={12*fps} premountFor={fps}><ScriptContext/></Series.Sequence>
   <Series.Sequence name="32–44 • Reminder and reasons" durationInFrames={12*fps} premountFor={fps}><ScriptReminder/></Series.Sequence>
   <Series.Sequence name="44–54 • Actual status and controls" durationInFrames={10*fps} premountFor={fps}><ScriptControl/></Series.Sequence>
   <Series.Sequence name="54–60 • Outie sign-off" durationInFrames={6*fps} premountFor={fps}><ScriptClosing/></Series.Sequence>
  </Series>
 </>;
};

import {ChargeSculpture,DrawLine} from './Details';
import {interpolate} from 'remotion';
import {Kinetic} from '../promo/stage';
import {clamp,ease} from '../promo/kit';
import {Scene,Phone,UiTitle,UiText,UiButton,UiBoard,UiCard,Logo,Shot,Copy,Tag,Cable,EndWipe,useTime} from './shared';
export const ScriptOpening=()=>{const t=useTime();return <Scene chapter="A day with Outie">
  <Cable progress={interpolate(t,[4,8],[0,1],{...clamp,easing:ease})} style={{opacity:.35}}/>
  <Shot until={3.15}><Kinetic text="This is Outie." size={157} style={{position:'absolute',left:95,top:285,width:1020}}/><DrawLine at={.8} width={790} style={{position:"absolute",left:105,top:478}}/><Copy style={{position:'absolute',left:103,top:542,width:870}}>Remember what matters<br/>when you head out.</Copy><Phone x={1270} width={378} angle={5}><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28}}><Logo size={49}/><b style={{fontSize:28}}>Outie</b></div><UiTitle>Remember what matters when you head out.</UiTitle><UiText>Check your everyday things, with weather and calendar extras.</UiText><UiButton>Set up my reminders</UiButton><UiText>Try a permission-free example</UiText><UiCard><b>Rain forecast + a school day</b><UiText>Remember your keys, school ID, and an umbrella.</UiText></UiCard></Phone></Shot>
  <Shot at={3.15} until={6.7}><Kinetic text="Makati. 1 PM." delay={3.15} size={142} style={{position:'absolute',left:95,top:255,width:1000}}/><Copy style={{position:'absolute',left:102,top:455,fontSize:54,width:900}}>AppBuilders PH<br/>Hackathon</Copy><div style={{position:'absolute',left:104,top:650}}><Tag>Today’s plan</Tag></div></Shot>
  <Shot at={6.7}><Kinetic text="My charger’s invited too." delay={6.7} size={130} style={{position:'absolute',left:95,top:225,width:1000}}/><ChargeSculpture at={6.8} style={{position:"absolute",left:835,top:605}}/><Copy style={{position:'absolute',left:104,top:610,width:590}}>Let’s make sure<br/>it shows up.</Copy></Shot>
  <Shot at={3.15}><Phone x={1260} width={390} at={3.15} angle={-4}><UiTitle>Before you go</UiTitle><UiText>Your reminders, ready for the day.</UiText><UiBoard/><UiButton secondary>Refresh today’s suggestions</UiButton><UiCard><b>AppBuilders PH Hackathon</b><UiText>Makati · Today, 1:00 PM</UiText></UiCard></Phone></Shot><EndWipe at={9.5}/>
</Scene>;};

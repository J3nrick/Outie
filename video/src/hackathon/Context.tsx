import {interpolate} from 'remotion';
import {Kinetic} from '../promo/stage';
import {clamp} from '../promo/kit';
import {ConnectLine,LogoSeal,DrawLine} from './Details';
import {Scene,Phone,UiTitle,UiText,UiButton,UiCard,UiRow,Icon,Shot,Copy,Tag,C,EndWipe,useTime,Tap} from './shared';
export const ScriptContext=()=>{const t=useTime();return <Scene dark chapter="Calendar → Local AI" note="Sample event and suggestions · local AI requires a supported, ready iPhone">
  <Shot until={4.5}>
    <Kinetic text="Your day, understood." size={111} style={{position:'absolute',left:96,top:170,width:1150}}/>
    <ConnectLine at={1}/><LogoSeal at={1.9}/>
    <div style={{position:'absolute',left:105,top:380,width:620,height:410,perspective:1500,rotate:`${interpolate(t,[0,.7],[-11,-3],clamp)}deg`,translate:`0 ${interpolate(t,[0,.7],[170,0],clamp)}px`,opacity:interpolate(t,[0,.3],[0,1],clamp)}}><div style={{background:C.white,color:C.ink,height:'100%',borderRadius:34,padding:42,boxSizing:'border-box',boxShadow:'0 20px 0 #131A17,0 30px 55px #00000044'}}><div style={{display:'flex',alignItems:'center',gap:20,color:C.red,fontSize:30}}><Icon name="calendar" size={46}/>Today · 1:00 PM</div><div style={{fontSize:57,fontWeight:700,lineHeight:1.1,letterSpacing:-2,marginTop:28}}>AppBuilders PH<br/>Hackathon</div><div style={{fontSize:32,color:C.muted,marginTop:25}}>Makati</div></div></div>
    <div style={{position:'absolute',left:110,top:848}}><Tag dark>Calendar connected</Tag></div>
    <Phone x={1300} width={368} angle={5}><UiTitle>Today’s context</UiTitle><UiCard><div style={{display:'flex',gap:10,alignItems:'center',fontSize:17}}><Icon name="calendar" size={27} color={C.red}/><b>Calendar connected</b></div></UiCard><UiCard><div style={{color:C.red,fontSize:16,marginBottom:15}}>Today · 1:00 PM</div><UiTitle>AppBuilders PH Hackathon</UiTitle><UiText>Makati</UiText></UiCard><UiButton>Refresh today’s suggestions</UiButton><UiText>Your saved essentials stay ready.</UiText></Phone>
  </Shot>
  <Shot at={4.5}>
    <Phone x={140} width={385} at={4.5} angle={4}><UiTitle>Before you go</UiTitle><UiText>Today’s suggestions</UiText><UiButton secondary>{t<6.5?'Updating today’s suggestions…':'Refresh today’s suggestions'}</UiButton>{t<6.5?<UiCard><Icon name="memory" size={42} color={C.red}/><UiText>Interpreting your event…</UiText><div style={{height:5,background:C.red,width:`${interpolate(t,[4.5,6.5],[8,100],clamp)}%`,borderRadius:5}}/></UiCard>:<><UiCard><UiRow name="ID" detail="For event check-in"/><UiText>Suggested by local AI · sample</UiText></UiCard><UiCard><UiRow name="Notebook" detail="Capture ideas and feedback"/><UiText>Suggested by local AI · sample</UiText></UiCard><UiText>Review suggestions before heading out.</UiText></>}</Phone>
    <Kinetic text="Context in." delay={4.5} size={129} style={{position:'absolute',left:710,top:225,width:1080}}/>
    <Kinetic text="Useful extras out." delay={5.1} size={114} style={{position:'absolute',left:710,top:385,width:1130}}/>
    <DrawLine at={6.5} width={900} color={C.pink} style={{position:'absolute',left:719,top:555}}/>
    <Copy style={{position:'absolute',left:719,top:645,width:1010,color:'#CBD0CE'}}>Local AI interprets the event.<br/>You review the reasons.</Copy><div style={{position:'absolute',left:719,top:840}}><Tag dark><Icon name="shield" size={30}/>Reasoned on your iPhone</Tag></div><Tap at={4.8} x={330} y={336}/>
  </Shot><EndWipe at={11.5}/>
</Scene>;};

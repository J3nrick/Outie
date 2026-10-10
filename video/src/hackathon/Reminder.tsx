import {interpolate} from 'remotion';
import {Kinetic,Tile} from '../promo/stage';
import {clamp} from '../promo/kit';
import {DrawLine} from './Details';
import {Scene,Phone,UiTitle,UiText,UiBoard,UiCard,UiRow,Shot,Copy,Tag,C,Laptop,Logo,EndWipe,useTime} from './shared';
export const ScriptReminder=()=>{const t=useTime();return <Scene chapter="Reminder preview → Reasons">
  <Shot until={7.2}>
    <Phone x={130} width={360} angle={-4}><UiTitle>Before you go</UiTitle><UiBoard/><UiCard><UiRow name="ID" detail="For event check-in"/><UiRow name="Notebook" detail="Capture ideas and feedback"/></UiCard><UiText>Suggested extras · review the reasons</UiText></Phone>
    <Kinetic text="One clear reminder." size={110} style={{position:'absolute',left:640,top:175,width:1200}}/>
    <div style={{position:'absolute',left:650,top:380,width:1105,background:C.ink,color:'white',borderRadius:45,padding:'37px 44px',boxSizing:'border-box',boxShadow:'0 25px 55px #20272623',translate:`0 ${interpolate(t,[.4,1],[95,0],clamp)}px`,opacity:interpolate(t,[.4,.8],[0,1],clamp)}}>
      <div style={{display:'flex',alignItems:'center',gap:18,fontSize:29,color:C.pink}}><Logo size={51}/>Outie <span style={{marginLeft:'auto',fontSize:23,color:'#ADB8B2'}}>Reminder preview</span></div>
      <div style={{fontSize:58,fontWeight:700,letterSpacing:-1.5,marginTop:22}}>Before you go</div><div style={{fontSize:36,lineHeight:1.35,marginTop:17}}>Keys, wallet, laptop, charger.<br/>For your hackathon: ID and notebook.</div>
    </div>
    <div style={{position:'absolute',left:660,top:810,opacity:interpolate(t,[2.7,3.1],[0,1],clamp)}}><Tag>Everyday essentials + relevant extras</Tag></div>
    <Shot at={3.2}><div style={{position:'absolute',left:650,top:785,width:1110,padding:'27px 0',background:C.paper}}><div style={{fontSize:30,fontWeight:700}}>Why a notebook?</div><div style={{fontSize:32,color:C.muted,marginTop:7}}>Capture hackathon ideas and feedback.</div></div></Shot>
  </Shot>
  <Shot at={7.2}><div style={{position:'absolute',left:104,top:225}}><Tag>Developer brain, explained.</Tag></div><Kinetic text="Code committed." delay={7.2} size={125} style={{position:'absolute',left:96,top:340,width:1150}}/><Kinetic text="Laptop… packed?" delay={8.65} size={125} style={{position:'absolute',left:96,top:515,width:1200}}/><DrawLine at={9.1} width={930} style={{position:'absolute',left:106,top:685}}/><Copy style={{position:'absolute',left:106,top:775,color:C.muted,width:990}}>Different checklist. Same importance.</Copy><Tile x={1350} y={360} width={380} height={380} delay={7.3} angle={-9} background={C.ink} color="white"><Laptop size={250}/></Tile></Shot><EndWipe at={11.5} color={C.ink}/>
</Scene>;};

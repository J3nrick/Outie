import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,C,Foot,Icon,Key,Rise,Shell,Wallet,clamp,ease} from './kit';
import {FlyPhone,Kinetic,PortalCut} from './stage';
export const Things = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <Shell><Brand/>
    <Kinetic text="Built around" size={142} style={{position:'absolute',left:100,top:210}}/>
    <Kinetic text="your life." size={148} delay={.15} style={{position:'absolute',left:100,top:365}}/>
    <Rise delay={.55} style={{position:'absolute',left:110,top:550,fontSize:43,color:C.muted}}>Start with the things that matter to you.</Rise>
    <Rise delay={1} style={{position:'absolute',left:100,top:675,width:800,display:'flex',gap:20}}>
      <div style={{display:'flex',alignItems:'center',gap:24,background:'white',padding:'24px 32px',borderRadius:28,fontSize:43}}><Key size={72}/>Keys</div>
      <div style={{display:'flex',alignItems:'center',gap:24,background:'white',padding:'24px 32px',borderRadius:28,fontSize:43}}><Wallet size={72}/>Wallet</div>
    </Rise>
    <Rise delay={2} style={{position:'absolute',left:100,top:850,display:'flex',gap:20,fontSize:36,color:C.red}}><Icon name="calendar" size={46}/><span>Your school and work routines, too.</span></Rise>
    <FlyPhone src="captures/my-things.png" x={1290} y={70} width={410} tilt={-3} drift={15}/>
    <svg width="340" height="300" style={{position:'absolute',left:965,top:580}}><path d="M10 160C140 160 90 70 300 70" fill="none" stroke={C.red} strokeWidth="4" pathLength={1} strokeDasharray={1} strokeDashoffset={1-interpolate(f,[2*fps,3.25*fps],[0,1],{...clamp,easing:ease})}/><circle cx="300" cy="70" r="9" fill={C.red} opacity={interpolate(f,[3*fps,3.2*fps],[0,1],clamp)}/></svg>
    <Foot>Actual app capture. Essentials and routines stay yours to edit.</Foot>
    <PortalCut at={6.98} color={C.ink}/>
  </Shell>;
};

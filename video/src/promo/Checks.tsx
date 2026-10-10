import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,C,CheckMark,Foot,Key,Rise,Shell,Wallet,clamp,ease} from './kit';
import {FlyPhone,Kinetic,PortalCut} from './stage';
export const Checks = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();const checked=f>=1.6*fps;
  return <Shell dark><Brand light/>
    <FlyPhone src="captures/acknowledged.png" x={160} y={155} width={365} tilt={-3} delay={.1} drift={8}/>
    <Kinetic text="One tap." size={151} style={{position:'absolute',left:740,top:220}}/>
    <Kinetic text="One less reminder." delay={.14} size={115} style={{position:'absolute',left:740,top:395}}/>
    <div style={{position:'absolute',left:755,top:625,width:850,display:'flex',gap:28,alignItems:'center',fontSize:48,color:'white',opacity:interpolate(f,[1.6*fps,2.15*fps],[1,.35],clamp),translate:interpolate(f,[2.2*fps,2.7*fps],['0px 0px','-45px 0px'],{...clamp,easing:ease})}}><Key size={80}/><span style={{flex:1}}>Keys</span><CheckMark checked={checked}/><div style={{position:'absolute',left:100,right:90,top:40,height:3,background:C.pink,scale:interpolate(f,[1.6*fps,2.1*fps],[0,1],{...clamp,easing:ease}),transformOrigin:'left'}}/></div>
    <div style={{position:'absolute',left:1530,top:631,width:76,height:76,border:'3px solid #F0B2AB',borderRadius:'50%',scale:interpolate(f,[1.5*fps,2.1*fps],[.8,2.4],clamp),opacity:interpolate(f,[1.5*fps,1.65*fps,2.1*fps],[0,.8,0],clamp)}}/>
    <Rise delay={.8} style={{position:'absolute',left:755,top:785,width:850,display:'flex',gap:28,alignItems:'center',fontSize:48}}><Wallet size={80}/><span style={{flex:1}}>Wallet</span><CheckMark/></Rise>
    <Foot dark>Actual app capture. Your confirmation is a choice, not proof an item is packed.</Foot>
    <PortalCut at={5.11} color={C.paper}/>
  </Shell>;
};

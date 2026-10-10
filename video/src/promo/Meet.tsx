import {CanvasImage,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Shell,clamp,ease} from './kit';
import {Kinetic,PortalCut} from './stage';
export const Meet = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <Shell red>
    <div style={{position:'absolute',left:130,top:270,width:380,height:380,perspective:1600,rotate:`${interpolate(f,[0,1.1*fps],[-18,-5],{...clamp,easing:ease})}deg`,scale:interpolate(f,[0,.8*fps],[.4,1],{...clamp,easing:ease})}}>
      <CanvasImage src={staticFile('outie-icon.png')} style={{width:380,height:380,borderRadius:98,boxShadow:'0 40px 70px #4B0F1835',transform:`rotateY(${interpolate(f,[0,fps],[70,0],{...clamp,easing:ease})}deg)`}}/>
    </div>
    <Kinetic text="Outie." delay={.15} size={310} style={{position:'absolute',left:650,top:215}}/>
    <div style={{position:'absolute',left:670,top:620,fontSize:62,lineHeight:1.1,clipPath:`inset(0 ${interpolate(f,[.6*fps,1.2*fps],[100,0],{...clamp,easing:ease})}% 0 0)`}}>Head out.<br/>Less left behind.</div>
    <PortalCut at={3.18} color={C.paper}/>
  </Shell>;
};

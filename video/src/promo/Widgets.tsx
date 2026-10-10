import {CanvasImage,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,C,Foot,Rise,Shell,clamp,ease} from './kit';
import {FlyPhone,Kinetic,PortalCut} from './stage';
export const Widgets = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <Shell><Brand/>
    <Kinetic text="One glance." size={136} style={{position:'absolute',left:100,top:200}}/>
    <Kinetic text="Before you go." size={123} delay={.15} style={{position:'absolute',left:100,top:350}}/>
    <Rise delay={.6} style={{position:'absolute',left:110,top:500,fontSize:38,color:C.muted,lineHeight:1.3}}>Home Screen. Lock Screen.<br/>Your remaining things, right there.</Rise>
    <FlyPhone src="captures/home-widget.png" x={1090} y={118} width={335} tilt={-6} delay={.1} drift={12}/>
    <FlyPhone src="captures/notification.png" x={1460} y={135} width={335} tilt={6} delay={.55} drift={16}/>
    <div style={{position:'absolute',left:105,top:615,width:790,height:370,borderRadius:42,overflow:'hidden',boxShadow:'0 24px 70px #20272620',opacity:interpolate(f,[2.7*fps,3.1*fps],[0,1],clamp),scale:interpolate(f,[2.7*fps,3.6*fps],[.84,1],{...clamp,easing:ease}),rotate:`${interpolate(f,[2.7*fps,3.6*fps],[-6,0],{...clamp,easing:ease})}deg`}}>
      <CanvasImage src={staticFile('captures/home-widget.png')} style={{position:'absolute',width:905,height:1968,left:-59,top:-203,objectFit:'fill'}}/>
    </div>
    <Foot>Actual simulator widgets. Lock Screen counts keep item names private. Guide in Settings.</Foot>
    <PortalCut at={6.98} color={C.ink}/>
  </Shell>;
};

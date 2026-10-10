import {CanvasImage,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Door,Rise,Shell,clamp,ease} from './kit';
import {Kinetic} from './stage';
export const Finale = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <Shell red>
    <div style={{position:'absolute',left:280,top:200,rotate:`${interpolate(f,[0,1.1*fps],[-14,-4],{...clamp,easing:ease})}deg`,scale:interpolate(f,[0,1.1*fps],[.7,1],{...clamp,easing:ease})}}>
      <Door color={C.paper} open={interpolate(f,[.2*fps,1.5*fps],[.9,.2],{...clamp,easing:ease})} style={{width:325,height:495}}/>
      <CanvasImage src={staticFile('outie-icon.png')} style={{position:'absolute',left:32,top:115,width:270,height:270,borderRadius:71,boxShadow:'0 20px 50px #4B0F1830',scale:interpolate(f,[1.1*fps,2*fps],[0,1],{...clamp,easing:ease}),rotate:`${interpolate(f,[1.1*fps,2*fps],[25,0],{...clamp,easing:ease})}deg`}}/>
    </div>
    <Kinetic text="Outie." delay={.1} size={240} style={{position:'absolute',left:780,top:225}}/>
    <Rise delay={.6} style={{position:'absolute',left:790,top:540,fontSize:69,lineHeight:1.15}}>Head out.<br/>Less left behind.</Rise>
    <Rise delay={2.2} style={{position:'absolute',left:790,top:820,fontSize:40,color:'#F8DCD7'}}>Make room for your day.</Rise>
    <div style={{position:'absolute',left:100,top:925,right:100,height:2,background:'#FFFFFF25',scale:interpolate(f,[2.8*fps,3.5*fps],[0,1],{...clamp,easing:ease}),transformOrigin:'left'}}/>
    <Rise delay={3.1} style={{position:'absolute',left:105,bottom:60,fontSize:27,color:'#F8DCD7'}}>Outie prototype for iPhone. Apple Intelligence requires compatible hardware.</Rise>
  </Shell>;
};

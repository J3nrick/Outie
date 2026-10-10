import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Icon,Shell,clamp,ease} from './kit';
import {Kinetic,PortalCut} from './stage';
export const Momentum = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;
  return <Shell dark>
    {t<1.65&&<>
      <div style={{position:'absolute',left:-45,top:365,color:'#FFFFFF13',fontSize:220,fontWeight:700,letterSpacing:-10,whiteSpace:'nowrap',translate:`${-t*110}px 0px`}}>Less backtracking. Less backtracking.</div>
      <Kinetic text="Less backtracking." size={174} style={{position:'absolute',left:160,top:400}}/>
      <div style={{position:'absolute',left:760,top:170,rotate:`${interpolate(f,[0,1.1*fps],[-40,0],{...clamp,easing:ease})}deg`,color:C.pink}}><Icon name="arrow" size={145}/></div>
    </>}
    {t>=1.65&&t<3.6&&<>
      <Kinetic text="More getting there." size={169} delay={1.65} style={{position:'absolute',left:158,top:370}}/>
      <div style={{position:'absolute',left:175,top:620,height:8,width:interpolate(f,[1.9*fps,3*fps],[0,1450],{...clamp,easing:ease}),background:C.pink,borderRadius:8}}/>
    </>}
    {t>=3.6&&<>
      <div style={{position:'absolute',inset:0,background:C.red,clipPath:`circle(${interpolate(f,[3.6*fps,4.2*fps],[0,1700],{...clamp,easing:ease})}px at 50% 50%)`}}/>
      <Kinetic text="Go." delay={3.3} size={390} style={{position:'absolute',left:665,top:290}}/>
    </>}
    <PortalCut at={5.11} color={C.red}/>
  </Shell>;
};

import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Door,Key,Shell,Wallet,clamp,ease} from './kit';
import {Kinetic,PortalCut,Tile} from './stage';
export const Hook = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;const switchAt=2.05;const second=t>=switchAt;
  return <Shell>
    <div style={{position:'absolute',left:88,top:190,translate:interpolate(f,[0,.4*fps],['-120px 0px','0px 0px'],{...clamp,easing:ease})}}>
      {!second?<><Kinetic text="Halfway" size={222}/><Kinetic text="out." delay={.18} size={260}/></>:<><Kinetic text="Keys" delay={switchAt} size={242}/><Kinetic text="still in." delay={switchAt+.14} size={220}/></>}
    </div>
    <div style={{position:'absolute',left:105,top:755,fontSize:46,color:C.muted,opacity:interpolate(f,[.5*fps,.9*fps],[0,1],clamp)}}>{second?'A tiny thing. A whole trip back.':'That “did I forget something?” feeling.'}</div>
    <div style={{position:'absolute',left:1240,top:210,rotate:`${interpolate(f,[0,2*fps,2.7*fps],[8,8,-8],{...clamp,easing:ease})}deg`}}><Door color={C.red} open={interpolate(f,[.25*fps,1.8*fps],[0,.8],{...clamp,easing:ease})} style={{width:350,height:540}}/></div>
    <Tile x={1180} y={380} delay={switchAt} width={230} height={230} background={C.ink} color={C.paper} angle={-12}><Key size={155}/></Tile>
    <Tile x={1550} y={670} delay={2.75} width={145} height={145} background={C.pink} angle={13}><Wallet size={96}/></Tile>
    <PortalCut at={5.08}/>
  </Shell>;
};

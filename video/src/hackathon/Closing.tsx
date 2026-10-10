import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Kinetic} from '../promo/stage';
import {clamp,ease} from '../promo/kit';
import {Scene,Phone,UiTitle,UiBoard,Shot,Copy,C,Logo,pop,useTime} from './shared';
export const ScriptClosing=()=>{const t=useTime(),f=useCurrentFrame(),{fps}=useVideoConfig();const p=pop(f,fps,1.9);return <Scene red chapter="" note="Outie · AppBuilders PH Hackathon">
  <Shot until={1.9}><Kinetic text="One less bug in my day." size={146} style={{position:'absolute',left:96,top:245,width:1070}}/><Phone angle={-4}><UiTitle>Before you go</UiTitle><UiBoard/></Phone></Shot>
  <Shot at={1.9}><div style={{position:"absolute",left:215,top:175,width:435,height:655,border:"10px solid #FFFFFF25",borderRadius:"100px 100px 15px 15px",opacity:interpolate(t,[2,3],[0,1],clamp),perspective:1400}}><div style={{position:"absolute",inset:6,borderRadius:"83px 83px 5px 5px",background:"#FFFFFF0B",transformOrigin:"left center",transform:`rotateY(${interpolate(t,[2,3.9],[0,-68],{...clamp,easing:ease})}deg)`}}/></div><div style={{position:'absolute',left:300,top:300,scale:p,rotate:`${(1-p)*-20}deg`}}><Logo size={285}/></div><Kinetic text="Outie." delay={1.9} size={235} style={{position:'absolute',left:670,top:260}}/><Copy style={{position:'absolute',left:685,top:570,fontSize:58,fontWeight:500,opacity:interpolate(t,[2.25,2.65],[0,1],clamp)}}>Head out. Less left behind.</Copy><div style={{position:'absolute',left:685,top:705,width:interpolate(t,[2.3,3.4],[0,575],{...clamp,easing:ease}),height:6,borderRadius:10,background:C.pink}}/></Shot>
</Scene>;};

import type {CSSProperties,ReactNode} from 'react';
import {CanvasImage,interpolate,spring,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,clamp,ease,Icon} from './kit';

export const Kinetic = ({text,delay=0,size=136,color,style}:{text:string;delay?:number;size?:number;color?:string;style?:CSSProperties}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <div style={{fontSize:size,fontWeight:700,lineHeight:1.06,letterSpacing:-size*.045,color,...style}}>{text.split(' ').map((word,i)=>{
    const p=spring({frame:f-(delay+i*.07)*fps,fps,config:{damping:19,stiffness:180,mass:.9}});
    return <span key={i} style={{display:'inline-block',overflow:'hidden',verticalAlign:'top',paddingBottom:12,marginRight:size*.23}}><span style={{display:'inline-block',translate:`0px ${(1-p)*size*1.2}px`,rotate:`${(1-p)*8}deg`,transformOrigin:'left bottom'}}>{word}</span></span>;
  })}</div>;
};
export const FlyPhone = ({src,x=1230,y=100,width=420,delay=.1,drift=18,tilt=-4,style}:{src:string;x?:number;y?:number;width?:number;delay?:number;drift?:number;tilt?:number;style?:CSSProperties}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;const p=spring({frame:f-delay*fps,fps,config:{damping:23,stiffness:105,mass:1.2}});
  return <div style={{position:'absolute',left:x,top:y,width,height:width*2622/1206,perspective:1700,translate:`${(1-p)*350}px ${(1-p)*170+Math.sin(t*1.1)*drift}px`,rotate:`${tilt+(1-p)*14+Math.sin(t*.65)*1.2}deg`,opacity:interpolate(f,[delay*fps,(delay+.2)*fps],[0,1],clamp),...style}}>
    <div style={{width:'100%',height:'100%',borderRadius:57,background:'#171D1B',padding:11,boxSizing:'border-box',boxShadow:'inset 0 0 0 2px #FFFFFF45, 0 35px 80px #00000035',transform:`rotateY(${(1-p)*-30}deg)`}}>
      <div style={{width:'100%',height:'100%',borderRadius:47,overflow:'hidden'}}><CanvasImage src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
    </div>
  </div>;
};
export const Tile = ({children,x,y,width=210,height=210,delay=0,angle=0,background=C.white,color=C.ink,style}:{children:ReactNode;x:number;y:number;width?:number;height?:number;delay?:number;angle?:number;background?:string;color?:string;style?:CSSProperties})=>{
  const f=useCurrentFrame();const {fps}=useVideoConfig();const p=spring({frame:f-delay*fps,fps,config:{damping:17,stiffness:120,mass:1.2}});
  return <div style={{position:'absolute',left:x,top:y,width,height,borderRadius:width*.2,background,color,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'inset 0 1px 1px #FFFFFF80, 0 24px 55px #20272622',scale:p,translate:`0px ${(1-p)*110+Math.sin(f/fps*1.15+delay)*7}px`,rotate:`${angle+(1-p)*-24}deg`,...style}}>{children}</div>;
};
export const PortalCut = ({at,color=C.red}:{at:number;color?:string}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <div style={{position:'absolute',inset:0,zIndex:50,pointerEvents:'none',background:color,clipPath:`circle(${interpolate(f,[at*fps,(at+.45)*fps],[0,2300],{...clamp,easing:ease})}px at 76% 51%)`}}/>;
};
export const Dot = ({x,y,pulse=1}:{x:number;y:number;pulse?:number}) => <div style={{position:'absolute',left:x-32,top:y-32,width:64,height:64,borderRadius:'50%',background:C.red,boxShadow:`0 0 0 ${20*pulse}px #BA372E18`,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="location" size={38} color="white"/></div>;

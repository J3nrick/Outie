import {CanvasImage,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,C,Door,Foot,Icon,Rise,Shell,clamp,ease} from './kit';
import {Dot,Kinetic,PortalCut} from './stage';
export const Departure = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();const progress=interpolate(f,[.7*fps,3.4*fps],[0,1],{...clamp,easing:ease});
  return <Shell><Brand/>
    <Kinetic text="When you head out," size={120} style={{position:'absolute',left:100,top:230}}/>
    <Kinetic text="Outie speaks up." delay={.12} size={133} style={{position:'absolute',left:100,top:370}}/>
    <Rise delay={.6} style={{position:'absolute',left:110,top:565,fontSize:43,lineHeight:1.3,color:C.muted}}>One reminder for the things<br/>you haven’t checked.</Rise>
    <div style={{position:'absolute',left:1250,top:170,width:560,height:560,borderRadius:'50%',border:'2px dashed #B1BDB5',background:'#DFE5E1'}}>
      <div style={{position:'absolute',inset:95,borderRadius:'50%',background:'#C9D5CC'}}/>
      <Door color={C.ink} open={progress*.85} style={{position:'absolute',left:204,top:185,width:150,height:228}}/>
      <Dot x={275+progress*287} y={274-progress*120} pulse={1+.15*Math.sin(f*.1)}/>
      <svg width="560" height="560" style={{position:'absolute',inset:0}}><path d="M280 280Q415 280 560 155" fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="5 9" pathLength={1} strokeDashoffset={1-progress}/></svg>
      <div style={{position:'absolute',left:162,top:468,fontSize:31,color:C.muted}}>Your saved area</div>
    </div>
    <Rise delay={3.75} style={{position:'absolute',left:935,top:675,width:770,padding:'30px 36px',borderRadius:38,background:'white',boxShadow:'0 35px 70px #20272622',rotate:`${interpolate(f,[3.75*fps,4.3*fps],[8,0],{...clamp,easing:ease})}deg`}}>
      <div style={{display:'flex',gap:16,alignItems:'center',fontSize:29,color:C.muted}}><CanvasImage src={staticFile('outie-icon.png')} style={{width:50,height:50,borderRadius:13}}/>Outie<span style={{marginLeft:'auto'}}>Example reminder</span></div>
      <div style={{fontSize:42,fontWeight:700,marginTop:22}}>Heading out? Check your things.</div>
      <div style={{fontSize:35,lineHeight:1.3,marginTop:14}}>Wallet. School ID. Umbrella.<br/>Rain is forecast near Home.</div>
    </Rise>
    <Rise delay={4.25} style={{position:'absolute',left:110,top:795,display:'flex',alignItems:'center',gap:22,fontSize:38,color:C.red}}><Icon name="bell" size={52}/>A timely little nudge.</Rise>
    <Foot>Illustrated departure with sample context. Requires background location and notification access.</Foot>
    <PortalCut at={6.98} color={C.ink}/>
  </Shell>;
};

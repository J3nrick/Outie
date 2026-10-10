import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,C,Foot,Icon,Rise,Shell,Umbrella,clamp,ease} from './kit';
import {FlyPhone,Kinetic,PortalCut,Tile} from './stage';
export const Context = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;const reveal=t>=4.1;
  return <Shell dark><Brand light/>
    {!reveal&&<>
      <Kinetic text="Today has context." size={118} style={{position:'absolute',left:380,top:160}}/>
      <div style={{position:'absolute',inset:0,opacity:interpolate(f,[3.7*fps,4.1*fps],[1,0],clamp),scale:interpolate(f,[3.7*fps,4.1*fps],[1,.8],{...clamp,easing:ease})}}>
        <svg width="1920" height="1080" style={{position:'absolute',inset:0}}><path d="M360 470C620 470 590 720 920 650M1550 485C1280 485 1240 690 1040 650M985 380V545" fill="none" stroke="#687D73" strokeWidth="4" strokeDasharray="9 14" strokeDashoffset={-f*2.4}/></svg>
        <Tile x={200} y={360} width={285} height={285} delay={.3} angle={-7} background="#35473E" color={C.pink}><div style={{textAlign:'center'}}><div style={{display:'flex',justifyContent:'center'}}><Icon name="calendar" size={116}/></div><div style={{fontSize:38,marginTop:28}}>Calendar</div></div></Tile>
        <Tile x={842} y={280} width={285} height={230} delay={.6} angle={4} background="#35473E"><div style={{textAlign:'center',color:C.paper}}><div style={{display:'flex',justifyContent:'center'}}><Icon name="bag" size={90}/></div><div style={{fontSize:36,marginTop:18}}>Your things</div></div></Tile>
        <Tile x={1410} y={375} width={285} height={285} delay={.9} angle={8} background="#35473E" color={C.yellow}><div style={{textAlign:'center'}}><div style={{display:'flex',justifyContent:'center'}}><Umbrella size={116}/></div><div style={{fontSize:38,marginTop:28}}>Weather</div></div></Tile>
        <Tile x={835} y={560} width={290} height={290} delay={1.15} background={C.red} color="white"><Icon name="doorBold" size={160}/></Tile>
        <div style={{position:'absolute',left:595,top:895,fontSize:44,color:'#C7D2CC',opacity:interpolate(f,[1.6*fps,2*fps],[0,1],clamp)}}>Apple Intelligence connects the dots.</div>
      </div>
    </>}
    {reveal&&<>
      <Kinetic text="Useful extras." delay={4.1} size={134} style={{position:'absolute',left:100,top:230}}/>
      <Kinetic text="Thought through." delay={4.25} size={119} style={{position:'absolute',left:100,top:382}}/>
      <Rise delay={4.5} style={{position:'absolute',left:110,top:565,fontSize:42,lineHeight:1.3,color:'#BCCBC2'}}>Calendar and forecast facts<br/>help shape your next reminder.</Rise>
      <Rise delay={5} style={{position:'absolute',left:105,top:770,display:'flex',gap:24,fontSize:38,color:C.pink,alignItems:'center'}}><Icon name="shield" size={66}/>AI reasoning stays on your iPhone.</Rise>
      <FlyPhone src={t<7?'captures/local-ai.png':'captures/contextual-reminder.png'} x={1320} y={100} width={392} delay={4.1} tilt={4} drift={10}/>
    </>}
    <Foot dark>{reveal?'Actual app captures with sample Calendar and weather. Requires compatible Apple Intelligence hardware.':'Illustrated context flow. Weather uses Open-Meteo; AI reasoning runs locally when available.'}</Foot>
    <PortalCut at={8.84} color={C.paper}/>
  </Shell>;
};

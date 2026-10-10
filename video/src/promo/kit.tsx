import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/fonts';
import solar from './solar.json';

void Promise.all([
  loadFont({family:'Satoshi',url:staticFile('fonts/Satoshi-Regular.ttf'),weight:'400'}),
  loadFont({family:'Satoshi',url:staticFile('fonts/Satoshi-Medium.ttf'),weight:'500'}),
  loadFont({family:'Satoshi',url:staticFile('fonts/Satoshi-Bold.ttf'),weight:'700'}),
]);
export const C = {paper:'#ECEDEC',white:'#FFFFFF',ink:'#202726',red:'#BA372E',pink:'#F0B2AB',muted:'#68716F',yellow:'#F0D392'};
export const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const ease = Easing.bezier(0.16,1,0.3,1);
export const Shell = ({children,dark=false,red=false}: {children:ReactNode;dark?:boolean;red?:boolean}) => <AbsoluteFill style={{fontFamily:'Satoshi',background:red?C.red:dark?C.ink:C.paper,color:dark||red?C.white:C.ink,overflow:'hidden'}}>{children}</AbsoluteFill>;
export const Icon = ({name,size=80,color='currentColor'}:{name:keyof typeof solar;size?:number;color?:string}) => <svg width={size} height={size} viewBox="0 0 24 24" style={{color,display:'block'}} dangerouslySetInnerHTML={{__html:solar[name]}}/>;
export const Key = ({size=150,color='currentColor'}:{size?:number;color?:string}) => <svg width={size} height={size} viewBox="0 0 180 180" fill="none" stroke={color} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"><circle cx="64" cy="57" r="33"/><path d="m87 80 62 62m-22-23-15 15m28-2-15 15"/><circle cx="57" cy="50" r="6" fill={color} stroke="none"/></svg>;
export const Umbrella = ({size=150,color='currentColor'}:{size?:number;color?:string}) => <svg width={size} height={size} viewBox="0 0 180 180" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"><path d="M24 86a66 66 0 0 1 132 0c-14-14-23-14-33 0-18-14-28-14-36 0-16-14-27-14-35 0-10-14-18-14-28 0ZM90 20v-8m0 75v60c0 26 30 26 30 5"/></svg>;
export const Wallet = ({size=150,color='currentColor'}:{size?:number;color?:string}) => <svg width={size} height={size} viewBox="0 0 180 180" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"><rect x="25" y="40" width="130" height="105" rx="22"/><path d="M25 62h115m15 26h-39a16 16 0 0 0 0 32h39"/><circle cx="118" cy="104" r="5" fill={color} stroke="none"/></svg>;
export const Brand = ({light=false}:{light?:boolean}) => <div style={{position:'absolute',left:88,top:60,display:'flex',alignItems:'center',gap:14,color:light?C.white:C.ink,fontSize:38,fontWeight:700,letterSpacing:-1}}><CanvasImage src={staticFile('outie-icon.png')} style={{width:52,height:52,borderRadius:14}}/>Outie</div>;
export const Foot = ({children,dark=false}:{children:ReactNode;dark?:boolean}) => <div style={{position:'absolute',left:96,bottom:52,right:96,fontSize:27,lineHeight:1.3,color:dark?'#B9C3C0':C.muted}}>{children}</div>;
export const Rise = ({children,delay=0,style}:{children:ReactNode;delay?:number;style?:CSSProperties}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  return <div style={{opacity:interpolate(f,[delay*fps,(delay+.35)*fps],[0,1],clamp),translate:interpolate(f,[delay*fps,(delay+.7)*fps],['0px 70px','0px 0px'],{...clamp,easing:ease}),...style}}>{children}</div>;
};
export const Door = ({open=0,style,color=C.ink}:{open?:number;style?:CSSProperties;color?:string}) => <div style={{position:'relative',width:260,height:390,perspective:1600,...style}}><div style={{position:'absolute',inset:0,border:`12px solid ${color}`,borderRadius:'34px 34px 8px 8px',boxSizing:'border-box'}}/><div style={{position:'absolute',inset:10,background:color,borderRadius:'23px 23px 3px 3px',transformOrigin:'left center',transform:`rotateY(${-open*78}deg)`,boxShadow:'12px 5px 35px #00000020'}}><div style={{position:'absolute',right:25,top:'49%',width:12,height:42,borderRadius:8,background:color===C.paper?C.red:C.paper}}/></div></div>;
export const CheckMark = ({checked=false,size=64}:{checked?:boolean;size?:number}) => <div style={{width:size,height:size,borderRadius:'50%',background:checked?C.red:'transparent',border:`3px solid ${checked?C.red:'#A6B1AC'}`,display:'flex',alignItems:'center',justifyContent:'center',boxSizing:'border-box'}}>{checked&&<Icon name="check" size={size*.64} color="white"/>}</div>;

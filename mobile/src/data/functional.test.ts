import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialState,reduce} from './model.ts';
import {decodeSnapshot} from './storage.ts';
test('snapshot round-trip preserves personal confirmations and demo separation',()=>{
  let state=reduce(initialState(),{type:'plan',title:'Pitch',destination:'Office'});
  state=reduce(state,{type:'add',id:'id',name:'Company ID'});
  state=reduce(state,{type:'toggle',id:'id',at:'2026-10-10T00:00:00Z'});
  const saved=decodeSnapshot(JSON.stringify({version:1,revision:2,state}));
  assert.equal(saved.state.personal?.items[0].status,'confirmed');
  assert.equal(saved.state.sample.id,'demo-presentation');
  assert.throws(()=>decodeSnapshot('{"version":2}'));
});
test('AI generation preserves user confirmations, exclusions, and removed suggestions',()=>{
  let s=reduce(initialState(),{type:'plan',title:'Pitch',destination:'Office'});
  s=reduce(s,{type:'add',id:'charger',name:'Charger'});
  s=reduce(s,{type:'toggle',id:'charger'});
  s=reduce(s,{type:'add',id:'notes',name:'Notes'});
  s=reduce(s,{type:'remove',id:'notes'});
  s=reduce(s,{type:'generated',planId:s.personal!.id,at:'now',items:[{name:'Charger',reason:'Power'},{name:'Notes',reason:'Talk'},{name:'Laptop',reason:'Slides'}]});
  assert.equal(s.personal!.items[0].status,'confirmed');
  assert.deepEqual(s.personal!.items.map(i=>i.name),['Charger','Laptop']);
  assert.equal(reduce(s,{type:'generated',planId:'obsolete',at:'later',items:[]}),s);
});
test('visual observations never imply packing or manual confirmation',()=>{
  let s=reduce(initialState(),{type:'demo',enabled:true});
  s=reduce(s,{type:'observe',id:'id',at:'now',detail:'Visible'});
  assert.equal(s.sample.items[0].status,'unchecked');
  assert.equal(s.sample.items[0].observedAt,'now');
});

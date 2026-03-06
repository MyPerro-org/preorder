(async ()=>{
  try{
    const res = await fetch('http://localhost:3001/api/subscribers/count');
    const text = await res.text();
    console.log('status', res.status, 'body', text);
  }catch(e){
    console.error('err', e);
  }
})();

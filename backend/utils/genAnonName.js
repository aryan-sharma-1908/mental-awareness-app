const adj = ['calm','gentle','bright','kind','brave','quiet','soft','warm','safe','steady'];
const noun = ['star','river','leaf','stone','cloud','spark','note','twig','echo','beam'];

function genAnonName(){
  const a = adj[Math.floor(Math.random()*adj.length)];
  const n = noun[Math.floor(Math.random()*noun.length)];
  const d = Math.floor(Math.random()*9000)+1000;
  return `${a}-${n}-${d}`;
}

module.exports = { genAnonName };

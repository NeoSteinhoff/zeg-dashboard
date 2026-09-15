// swarms: run all data extractors + build + deploy in one shot
import { spawn } from 'child_process'
import { chmod } from 'fs'

const log = (msg) => console.log(`[SWARM] ${msg}`)

async function run(cmd, args, label) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', cwd: '/Users/neosteinhoff/zegoro' })
    p.on('close', (code) => {
      log(`${label}: exit ${code}`)
      resolve(code === 0)
    })
    p.on('error', (e) => { log(`${label}: error ${e.message}`); resolve(false) })
  })
}

async function main() {
  log('=== ZEG SWARM: data refresh ===')
  const c1 = await run('npx', ['tsx', 'scripts/extract-circle.mjs'], 'circle')
  const c2 = await run('npx', ['tsx', 'scripts/extract-roster.mjs'], 'roster')
  const c3 = await run('npx', ['tsx', 'scripts/extract-gym.mjs'], 'gym')
  const c4 = await run('npx', ['tsx', 'scripts/extract-ceo.mjs'], 'ceo')
  
  if (!(c1 && c2 && c3 && c4)) {
    log('SWARM FAILED: data extraction errors')
    process.exit(1)
  }
  
  log('=== ZEG SWARM: build ===')
  const buildOk = await run('npm', ['run', 'build'], 'build')
  if (!buildOk) { log('SWARM FAILED: build error'); process.exit(1) }
  
  log('=== ZEG SWARM: deploy ===')
  const deployOk = await run('vercel', ['deploy', 'dist', '--prod', '--prebuilt'], 'deploy')
  if (!deployOk) { log('SWARM FAILED: deploy error'); process.exit(1) }
  
  log('SWARM COMPLETE: all data refreshed, built, deployed')
}

main().catch(e => { console.error(e); process.exit(1) })

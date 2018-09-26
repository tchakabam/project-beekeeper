#!/usr/bin/env node

const { spawn } = require('child_process');
const argv = require('yargs').argv

const agentChildProcs = new Map();

function forkNewAgentProc() {
    console.log('Forking new agent...')
    const agentProc = spawn('./node_modules/.bin/ts-node', ['./bin/node-agent.ts', ], {
        detached: false, // needed to kill all spawned procs however we exit
        shell: true,
        silent: false,
        stdio: 'inherit',
        env: process.env
    });

    agentChildProcs.set(agentProc.pid, agentProc);

    agentProc.on('message', onForkAgentMessage.bind(agentProc));
    agentProc.on('close', onForkAgentClose.bind(agentProc));
    agentProc.on('error', onForkAgentError.bind(agentProc));

    /*
    agentProc.stdout.on('data', (data) => {
        //console.log(`stdout: ${data}`);
      });

    agentProc.stderr.on('data', (data) => {
        //console.log(`stderr: ${data}`);
    });
    */
}

function onBeforeExit() {
    Array.from(agentChildProcs.values()).forEach(proc => proc.kill(0));
    process.exit(0);
}

function onForkAgentError(data) {
    console.log(`Forked agent proc error ${data}`);
}

function onForkAgentMessage(data) {
    console.log(`Forked agent proc message ${data}`);
}

function onForkAgentClose(code, signal) {
    console.log(`child process exited with code ${code}`);

    if (agentChildProcs.has(this.pid)) {
        throw new Error(`Forked agent crashed unexpectedly by signal ${signal} (code=${code})`);
        process.exit(0);
    }
}

if (typeof argv.instances === 'number') {
    for (let i = 0; i < argv.instances; i++) {
        forkNewAgentProc();
    }
}

#!/usr/bin/env node

const { spawn } = require('child_process');

const argv = require('yargs').argv

const WebSocketServer = require('websocket').server;
const http = require('http');

const WS_SERVER_PORT = 15555;
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

/*
function createWebsocketServer(): any {
    const httpServer = http.createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });
    httpServer.listen(WS_SERVER_PORT, function() {
        console.log((new Date()) + ' Server is listening on port 8080');
    });

    const wsServer = new WebSocketServer({
        httpServer,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });

    function originIsAllowed(origin) {
      // put logic here to detect whether the specified origin is allowed.
      return true;
    }

    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
          // Make sure we only accept requests from an allowed origin
          request.reject();
          console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
          return;
        }

        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendBytes(message.binaryData);
            }
        });
        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });

    return wsServer;
}
*/



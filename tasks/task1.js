import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

rl.setPrompt('Please insert string: \n');
rl.prompt();
rl.on('line', (s) => {
    console.log('Reversed string:');
    console.log(`${[...s].reverse().join("")} \n`);

    rl.prompt();
})

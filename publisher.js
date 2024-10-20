import { connect } from 'mqtt';
import readline from 'readline';
import { v4 as uuidv4 } from 'uuid';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Digite a mensagem para enviar: '
});

console.log('Escolha um Canal: jogos, filosofia, desenhos');
rl.question('Digite o Canal: ', (channel) => {
    if (!['jogos', 'filosofia', 'desenhos'].includes(channel)) {
        console.log('Canal inválido. Escolha entre jogos, filosofia ou desenhos');
        rl.close();
        return;
    }
    
    rl.question('Digite o seu nome de usuário: ', (name) => {

        const client = connect('mqtt://localhost:1883');
        const clientId = uuidv4(); 

        client.on('connect', () => {
            console.log(`Conectado ao broker MQTT no canal ${channel}`);
            console.log('Você pode começar a enviar mensagens...');

            client.subscribe(channel);

            client.on('message', (channel, message) => {
                const parsedMessage = JSON.parse(message.toString());
                if (parsedMessage.clientId !== clientId) {
                    console.log(`\n(${channel}) ${parsedMessage.name}: ${parsedMessage.message}`);
                    rl.prompt();
                }
            });

            rl.setPrompt('Digite a mensagem para enviar: ');
            rl.prompt();

            rl.on('line', (message) => {
                const fullMessage = JSON.stringify({ clientId, name, message });
                client.publish(channel, fullMessage, () => {
                    rl.prompt();
                });
            });
        });
    });
});
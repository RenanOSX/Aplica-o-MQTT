import { connect } from 'mqtt';

const client = connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    console.log('Aguardando mensagens de todos os canais...');

    const channels = ['jogos', 'filosofia', 'desenhos'];
    client.subscribe(channels, (err) => {
        if (!err) {
            console.log('Inscrito em todos os canais');
        }
    });
});

client.on('message', (channel, message) => {
    try {
        const parsedMessage = JSON.parse(message.toString());
        console.log(`\nCanal: ${channel} - Enviado por: ${parsedMessage.name} - Mensagem: ${parsedMessage.message}`);
    } catch (e) {
        console.error('Erro ao analisar a mensagem:', e);
    }
});
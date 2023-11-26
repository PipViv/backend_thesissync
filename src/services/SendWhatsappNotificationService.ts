//import twilio from 'twilio';

class SendWhatsappNotificationService {
    constructor() {

    }
    sendWhatsappNotification = async (body: string, recipientPhoneNumber: string) => {
        const accountSid = 'AC55c85cd76ab981af31c83480a8b837d1';
        const authToken = '7848cc34fe535367c4aac5ac2a9d0ee4';
        const client = require('twilio')(accountSid, authToken);
    
        try {
            const message = await client.messages.create({
                body: body,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:${recipientPhoneNumber}`,
            });
    
            console.log('Mensaje de WhatsApp enviado con éxito. SID:', message.sid);
        } catch (error) {
            console.error('Error al enviar el mensaje de WhatsApp:', error);
        }
    };
    


}

export default SendWhatsappNotificationService;
import nodemailer from 'nodemailer';

class SendEmailNotificationService{
    constructor(){}

    sendEmailNotification = async (subject: string, body: string, recipientEmail: string) => {
        // Configura el transporte de nodemailer
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'tu_correo@gmail.com', // Cambia esto con tu dirección de correo electrónico
            pass: 'tu_contraseña', // Cambia esto con tu contraseña
          },
        });
      
        // Configura el correo electrónico
        const mailOptions = {
          from: 'tu_correo@gmail.com', // Cambia esto con tu dirección de correo electrónico
          to: recipientEmail,
          subject,
          text: body,
        };
      
        try {
          // Envía el correo electrónico
          await transporter.sendMail(mailOptions);
          console.log('Correo electrónico enviado con éxito');
        } catch (error) {
          console.error('Error al enviar el correo electrónico:', error);
        }
      };

}

export default SendEmailNotificationService;
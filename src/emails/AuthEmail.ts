import { transport } from "../config/nodemailer"

interface IEmail {
  email: string
  name: string
  token: { token: string }
}

export class AuthEmail {
  static sendConfirmationEmail = async ({email, name, token}: IEmail) => {
    const info = await transport.sendMail({
      from: 'Auth User <auth@authservice.com>',
      to: email,
      subject: 'Account confirmation',
      text: 'Auth User - Confirm your account',
      html: `
        <p>Hello ${name}, please use this code to confirm your account <b>${token.token}</b>, this token expires on 10 minutes</p>
        <p>Click on this link: </p>
        <a href="#"> Confirm your Account </a>
        <p>Thank you for using Auth User</p>
      `
    })

    console.log("Message sent: %s", info.messageId);
    return;
  };

  static sendPasswordResetToken = async ( user : IEmail ) => {
    const info = await transport.sendMail({
        from: 'UpTask <admin@uptask.com>',
        to: user.email,
        subject: 'UpTask - Reestablece tu password',
        text: 'UpTask - Reestablece tu password',
        html: `<p>Hello: ${user.name}, you have requested to reset your password.</p>
            <p>Click on this link:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset Password</a>
            <p>and type the code: <b>${user.token.token}</b></p>
            <p>This token expires in 10 minutes</p>
        `
    })

    console.log('Message sent', info.messageId)
}
}
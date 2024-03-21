import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import QRCode from "qrcode";
import dotenv from "dotenv";
dotenv.config();

export const uiTicket = (qr: string, data: any) => {
  return `<div style="background-image:url('${data.background}');background-repeat: no-repeat;background-size:100% 100%;background-attachment: fixed;background-position: center;width:500px;height:250px;display:-webkit-flex;justify-content:center;flex-direction:column;border-radius:10px;border:solid 1px;border-color:black">
    <div style="width:25%;height:100%;display:-webkit-flex;;align-items:center;">
        <img src="${qr}" alt="qr-code" style="width:120px;height:120px;margin:auto;background-color:transparent">
    </div>
    <div class="content" style="width:75%;height:100%">
      <h1 style="color:white;text-align:center;cursor:pointer">${data.subject}</h1>
      <h2 style="color:white;text-align:center;cursor:pointer">${data.title}</h2>
      <div style="width:100%;display:flex">
        <div style="color:white;width:50%;cursor:pointer">Name: ${data.name}</div>
        <div style="color:white;width:50%;cursor:pointer">Time: ${data.frame}:00</div>
      </div>
      <div style="width:100%;display:flex">
        <div style="color:white;width:50%;cursor:pointer">Date:${data.date}</div>
        <div style="color:white;width:50%;cursor:pointer">Quantity:${data.count}</div>
      </div>
      <h3 style="color:white;cursor:pointer">Payment: Paypal</h3>
    </div>
  </div>`;
};

export const handleSendMail = (res: any, data: any,type:string) => {
  const toMail = data.toMail;
  const subject = data.subject;
  const GOOGLE_MAILER_CLIENT_ID = process.env.G_M_CLIENT_ID;
  const GOOGLE_MAILER_CLIENT_SECRET = process.env.G_M_SECRET_ID;
  const GOOGLE_MAILER_REFRESH_TOKEN = process.env.G_M_TOKEN;
  const ADMIN_EMAIL_ADDRESS = process.env.G_M_FROM;
  const myOAuth2Client = new OAuth2Client(
    GOOGLE_MAILER_CLIENT_ID,
    GOOGLE_MAILER_CLIENT_SECRET
  );
  // Set Refresh Token vào OAuth2Client Credentials
  myOAuth2Client.setCredentials({
    refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
  });
  const sendMail = async () => {
    let qr = type === 'qr' ? await QRCode.toDataURL(`${data.id}`) : '';
    try {
      // Lấy thông tin gửi lên từ client qua body
      const myAccessTokenObject = await myOAuth2Client.getAccessToken();
      // Access Token sẽ nằm trong property 'token' trong Object  vừa get được ở trên
      const myAccessToken = myAccessTokenObject?.token;
      // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: String(ADMIN_EMAIL_ADDRESS),
          clientId: GOOGLE_MAILER_CLIENT_ID,
          clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
          refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken,
        },
      } as nodemailer.TransportOptions);
      const mailOptions = {
        to: toMail, // người nhận
        subject: subject,
        attachDataUrls: true,
        html: type === 'qr' ? uiTicket(qr, data): ``,
      };
      await transport.sendMail(mailOptions);
      res
        .status(200)
        .json({ status: 200, message: "Email sent successfully." });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ err: error.message });
    }
  };
  sendMail();
};

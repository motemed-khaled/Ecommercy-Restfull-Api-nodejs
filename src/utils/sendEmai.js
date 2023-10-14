import nodemailer from "nodemailer";


export const sendEmail =async (options) => {
    
    const transpoter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,  // if secure false 587
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transpoter.sendMail({
        from: "E-commercy<motemed24@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    });
}
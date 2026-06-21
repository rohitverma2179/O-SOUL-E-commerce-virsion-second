import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"O'Soul Comfort" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    return await transporter.sendMail(mailOptions);
};

export const getVerificationEmailTemplate = (fullName, otpCode) => {
    return `
    <div style="font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; background-color: #fcfbf9; padding: 40px; color: #221c17; max-width: 600px; margin: 0 auto; border: 1px solid #e5e0da; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Fraunces', Georgia, serif; font-size: 28px; margin: 0; color: #221c17; letter-spacing: -0.02em;">O'Soul</h1>
            <p style="font-size: 11px; text-transform: uppercase; tracking: 0.1em; color: #736b63; margin-top: 5px;">Everyday Comfort Reimagined</p>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 6px; border: 1px solid #edebe7;">
            <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; font-weight: normal; margin-top: 0; margin-bottom: 20px; color: #221c17;">Verify your email address</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #453f3a; margin-bottom: 25px;">Hello ${fullName},<br><br>Thank you for starting your journey with O'Soul. To activate your account and access checkout, please use the 6-digit verification code below:</p>
            <div style="text-align: center; margin: 30px 0; background-color: #f7f5f0; padding: 20px; border-radius: 8px; border: 1px dashed #cdc2b3;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.25em; color: #707746; font-family: monospace;">${otpCode}</span>
            </div>
            <p style="font-size: 12px; color: #736b63; line-height: 1.5; margin-bottom: 0;">This verification code is valid for 15 minutes. If you did not request this code, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 35px; border-top: 1px solid #edebe7; padding-top: 25px;">
            <p style="font-size: 10px; text-transform: uppercase; tracking: 0.15em; color: #9c948c; margin: 0;">O'Soul Infrastructure · If it makes you adjust, it failed.</p>
        </div>
    </div>
    `;
};

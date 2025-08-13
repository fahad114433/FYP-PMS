import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

// Transporter: TLS with port 587 — Most stable for Gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS uses secure: false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Accept self-signed or fallback certs
    },
});

// Centralized email sender
const sendEmail = async (mailOptions) => {
    try {
        console.log("📤 Sending email to:", mailOptions.to);
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
};

// Email templates
const userRegister = async (name, email, password) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎉 Registration Successful",
        text: `Dear ${name},\n\nCongratulations! You have successfully registered with our company.\n\nLogin using:\nEmail: ${email}\nPassword: ${password}\n\nDashboard: http://localhost:5173/login\n\nBest,\nTeam`,
    };
    await sendEmail(mailOptions);
};

const userAssignedToModule = async (name, email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "📦 Module Assignment Notification",
        text: `Congratulations ${name}, You have been assigned to a module.\nCheck your dashboard for details. or \n Click on this link to go to the dashboard http://localhost:5173/user/dashboard \n\nRegards,\nTeam`,
    };
    await sendEmail(mailOptions);
};

const userAddedToTeam = async (name, email, teamName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "👥 Welcome to the Team!",
        text: `Hi ${name},\n\nYou've been added to "${teamName}". Looking forward to your contributions.\n\nTeam Coordinator`,
    };
    await sendEmail(mailOptions);
};

const taskAssigned = async (email, name, taskName, moduleName, projectName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "📝 Task Assignment",
        text: `Hi ${name},\n\nYou've been assigned a task:\nTask: ${taskName}\nModule: ${moduleName}\nProject: ${projectName}\n\nPlease check your dashboard.\n\nProject Manager`,
    };
    await sendEmail(mailOptions);
};

const contactMessageSender = async (name, email, phone, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "📧 New Contact Message",
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };
    await sendEmail(mailOptions);
};

export {
    userRegister,
    userAssignedToModule,
    userAddedToTeam,
    taskAssigned,
    contactMessageSender
};

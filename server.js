const express = require("express");
const sgMail = require("@sendgrid/mail");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS for Vercel frontend
app.use(cors({
    origin: "https://anurag-developers-backend.vercel.app"
}));

app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// CONTACT FORM API
app.post("/send", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const websiteURL = "https://anurag-developers-backend.vercel.app/";
        const logoURL = "https://github.com/Anurag666786/anurag-developers-backend/blob/main/public/logo.png";

        // ✅ Email to Admin
        const adminMsg = {
            to: "anuragdevelopers666786@gmail.com",
            from: "anuragdevelopers666786@gmail.com", // ✅ VERIFIED EMAIL
            subject: "🚀 New Contact Message",
            html: `
                <div style="font-family: Arial; padding:20px;">
                    <img src="${logoURL}" alt="Logo" width="120" style="margin-bottom:15px;" />
                    
                    <h2 style="color:#0084ff;">New Contact Form Submission</h2>
                    
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    
                    <p><strong>Message:</strong></p>
                    <div style="background:#f4f4f4;padding:15px;border-radius:8px;">
                        ${message}
                    </div>

                    <br/>
                    <a href="${websiteURL}" style="color:#0084ff;text-decoration:none;font-weight:bold;">
                        Visit Website
                    </a>

                    <br/><br/>
                    <small>This message was sent from your website contact form.</small>
                </div>
            `
        };

        // ✅ Auto Reply to User
        const userMsg = {
            to: email,
            from: "anuragdevelopers666786@gmail.com", // ✅ VERIFIED EMAIL
            subject: "✅ We Received Your Message",
            html: `
                
                    <h2 style="color:#0084ff;">Thank You, ${name}! 🙌</h2>
                    
                    <p>We have successfully received your message.</p>

                    <p><strong>Your Message:</strong></p>
                    <div style="background:#f4f4f4;padding:15px;border-radius:8px;">
                        ${message}
                    </div>

                    <br/>
                    <p>Our team will review it and get back to you as soon as possible.</p>

                    <hr/>
                    <p style="font-size:14px;color:gray;">
                        Anurag Developers<br/>
                        Building Smart Web Solutions<br/><br/>
                        <a href="${websiteURL}" style="color:#0084ff;text-decoration:none;">
                            ${websiteURL}
                        </a>
                    </p>
                </div>
            `
        };

        // Send both emails
        await sgMail.send(adminMsg);
        await sgMail.send(userMsg);

        res.json({ success: true });

    } catch (error) {
        console.error("Email Error:", error.response?.body || error.message);
        res.json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

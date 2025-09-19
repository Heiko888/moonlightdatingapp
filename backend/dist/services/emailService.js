"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class EmailService {
    constructor(config) {
        this.config = config;
    }
    async sendWelcomeEmail(userData) {
        try {
            if (this.config.provider === 'mailchimp') {
                return await this.sendMailchimpEmail(userData);
            }
            else if (this.config.provider === 'hubspot') {
                return await this.sendHubSpotEmail(userData);
            }
        }
        catch (error) {
            console.error('Fehler beim Senden der Willkommens-E-Mail:', error);
            throw error;
        }
    }
    async sendMailchimpEmail(userData) {
        const { email, name, username } = userData;
        const mailchimpData = {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: name,
                USERNAME: username,
                SIGNUP_DATE: new Date().toISOString().split('T')[0]
            },
            tags: ['welcome', 'new-user']
        };
        const response = await axios_1.default.post(`https://us1.api.mailchimp.com/3.0/lists/${this.config.listId}/members`, mailchimpData, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Mailchimp Willkommens-E-Mail gesendet an:', email);
        return response.data;
    }
    async sendHubSpotEmail(userData) {
        const { email, name, username } = userData;
        // HubSpot Contact erstellen
        const contactData = {
            properties: {
                email: email,
                firstname: name,
                username: username,
                signup_date: new Date().toISOString(),
                lifecycle_stage: 'lead'
            }
        };
        const contactResponse = await axios_1.default.post(`https://api.hubapi.com/crm/v3/objects/contacts`, contactData, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        // HubSpot Workflow für Willkommens-E-Mail auslösen
        const workflowData = {
            email: email,
            customProperties: {
                name: name,
                username: username
            }
        };
        const workflowResponse = await axios_1.default.post(`https://api.hubapi.com/automation/v2/workflows/${this.config.portalId}/enrollments/contacts/${contactResponse.data.id}`, workflowData, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ HubSpot Willkommens-E-Mail gesendet an:', email);
        return { contact: contactResponse.data, workflow: workflowResponse.data };
    }
    async sendTransactionalEmail(to, subject, htmlContent) {
        try {
            if (this.config.provider === 'mailchimp') {
                return await this.sendMailchimpTransactionalEmail(to, subject, htmlContent);
            }
            else if (this.config.provider === 'hubspot') {
                return await this.sendHubSpotTransactionalEmail(to, subject, htmlContent);
            }
        }
        catch (error) {
            console.error('Fehler beim Senden der Transaktions-E-Mail:', error);
            throw error;
        }
    }
    async sendMailchimpTransactionalEmail(to, subject, htmlContent) {
        const emailData = {
            message: {
                html: htmlContent,
                subject: subject,
                from_email: process.env.FROM_EMAIL || 'noreply@moonlight-app.com',
                from_name: 'Moonlight App',
                to: [{ email: to, type: 'to' }]
            }
        };
        const response = await axios_1.default.post('https://mandrillapp.com/api/1.0/messages/send', emailData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Mailchimp Transaktions-E-Mail gesendet an:', to);
        return response.data;
    }
    async sendHubSpotTransactionalEmail(to, subject, htmlContent) {
        const emailData = {
            to: to,
            subject: subject,
            html: htmlContent,
            from: process.env.FROM_EMAIL || 'noreply@moonlight-app.com'
        };
        const response = await axios_1.default.post(`https://api.hubapi.com/marketing/v3/transactional/single-email/send`, emailData, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ HubSpot Transaktions-E-Mail gesendet an:', to);
        return response.data;
    }
}
// E-Mail-Service Instanz erstellen
const emailService = new EmailService({
    provider: process.env.EMAIL_PROVIDER || 'mailchimp',
    apiKey: process.env.EMAIL_API_KEY || '',
    listId: process.env.MAILCHIMP_LIST_ID,
    portalId: process.env.HUBSPOT_PORTAL_ID
});
exports.default = emailService;

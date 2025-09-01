package com.invoice.mailing.service;

import com.invoice.mailing.config.MailingProperties;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnBean(JavaMailSender.class)
public class SmtpSender {
    private final JavaMailSender mailSender;
    private final MailingProperties props;

    public SmtpSender(JavaMailSender mailSender, MailingProperties props) {
        this.mailSender = mailSender;
        this.props = props;
    }

    public String sendHtml(String to, String subject, String html, byte[] pdf, String pdfName) throws Exception {
        MimeMessage msg = mailSender.createMimeMessage();
        boolean multipart = pdf != null && pdf.length > 0;
        MimeMessageHelper helper = new MimeMessageHelper(msg, multipart, "UTF-8");
        helper.setFrom(new InternetAddress(props.getFrom(), "InvoiceGlide"));
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        if (multipart) {
            helper.addAttachment(pdfName != null ? pdfName : "invoice.pdf", new ByteArrayResource(pdf));
        }
        try {
            mailSender.send(msg);
            return msg.getMessageID();
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            throw e;
        }
    }
}

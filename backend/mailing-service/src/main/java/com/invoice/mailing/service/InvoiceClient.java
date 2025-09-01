package com.invoice.mailing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.invoice.mailing.config.MailingProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class InvoiceClient {
    private static final Logger log = LoggerFactory.getLogger(InvoiceClient.class);
    private final RestClient http;
    private final MailingProperties props;

    public InvoiceClient(MailingProperties props) {
        this.props = props;
        this.http = RestClient.builder().build();
    }

    public JsonNode getInvoice(String id) {
        String url = props.getInvoiceApiBaseUrl() + "/invoices/" + id;
        log.info("[InvoiceClient] GET {}", url);
        return http.get().uri(url).retrieve().body(JsonNode.class);
    }

    public JsonNode getInvoice(String id, String authHeader) {
        String url = props.getInvoiceApiBaseUrl() + "/invoices/" + id;
        log.info("[InvoiceClient] GET {} with user token", url);
        return http.get().uri(url).header(HttpHeaders.AUTHORIZATION, authHeader).retrieve().body(JsonNode.class);
    }

    public JsonNode[] getInvoices() {
        String url = props.getInvoiceApiBaseUrl() + "/invoices";
        log.info("[InvoiceClient] GET {}", url);
        return http.get().uri(url).retrieve().body(JsonNode[].class);
    }

    public JsonNode[] getInvoices(String authHeader) {
        String url = props.getInvoiceApiBaseUrl() + "/invoices";
        log.info("[InvoiceClient] GET {} with user token", url);
        return http.get().uri(url).header(HttpHeaders.AUTHORIZATION, authHeader).retrieve().body(JsonNode[].class);
    }

    public JsonNode getClient(String id) {
        String url = props.getInvoiceApiBaseUrl() + "/clients/" + id;
        log.info("[InvoiceClient] GET {} (client)", url);
        return http.get().uri(url).retrieve().body(JsonNode.class);
    }

    public JsonNode getClient(String id, String authHeader) {
        String url = props.getInvoiceApiBaseUrl() + "/clients/" + id;
        log.info("[InvoiceClient] GET {} (client) with user token", url);
        return http.get().uri(url).header(HttpHeaders.AUTHORIZATION, authHeader).retrieve().body(JsonNode.class);
    }

    public byte[] downloadPdf(String id) {
        String url = props.getInvoiceApiBaseUrl() + "/invoices/" + id + "/pdf";
        log.info("[InvoiceClient] GET {} (pdf)", url);
        return http.get()
                .uri(url)
                .accept(MediaType.APPLICATION_PDF)
                .retrieve()
                .body(byte[].class);
    }

    public byte[] downloadPdf(String id, String authHeader) {
        String url = props.getInvoiceApiBaseUrl() + "/invoices/" + id + "/pdf";
        log.info("[InvoiceClient] GET {} (pdf) with user token", url);
        return http.get()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .accept(MediaType.APPLICATION_PDF)
                .retrieve()
                .body(byte[].class);
    }
}

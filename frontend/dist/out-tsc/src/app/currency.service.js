import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
export let CurrencyService = class CurrencyService {
    constructor(http) {
        this.http = http;
        this.BASE_URL = 'https://api.frankfurter.app/';
        // Cache for exchange rates to avoid excessive API calls
        this.exchangeRates = {};
    }
    getExchangeRates(baseCurrency) {
        if (this.exchangeRates[baseCurrency]) {
            return of(this.exchangeRates[baseCurrency]); // Return from cache if available
        }
        return this.http.get(`${this.BASE_URL}latest?from=${baseCurrency}`).pipe(map(response => {
            this.exchangeRates[baseCurrency] = response.rates;
            return response.rates;
        }), catchError(error => {
            console.error('Error fetching exchange rates:', error);
            // Fallback to default rates or handle error gracefully
            return of({}); // Return empty rates on error
        }));
    }
    // Converts an amount from one currency to another
    convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) {
            return of(amount);
        }
        return this.getExchangeRates(fromCurrency).pipe(map(rates => {
            if (rates[toCurrency]) {
                return amount * rates[toCurrency];
            }
            else {
                console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}. Returning 0.`);
                return 0; // Return 0 if rate not found
            }
        }), catchError(error => {
            console.error('Error during currency conversion:', error);
            return of(0); // Return 0 on error during conversion
        }));
    }
};
CurrencyService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CurrencyService);
//# sourceMappingURL=currency.service.js.map
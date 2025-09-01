import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private BASE_URL = 'https://api.frankfurter.app/';

  // Cache for exchange rates to avoid excessive API calls
  private exchangeRates: { [base: string]: { [target: string]: number } } = {};

  constructor(private http: HttpClient) { }

  getExchangeRates(baseCurrency: string): Observable<{ [target: string]: number }> {
    if (this.exchangeRates[baseCurrency]) {
      return of(this.exchangeRates[baseCurrency]); // Return from cache if available
    }

    return this.http.get<any>(`${this.BASE_URL}latest?from=${baseCurrency}`).pipe(
      map(response => {
        this.exchangeRates[baseCurrency] = response.rates;
        return response.rates;
      }),
      catchError(error => {
        console.error('Error fetching exchange rates:', error);
        // Fallback to default rates or handle error gracefully
        return of({}); // Return empty rates on error
      })
    );
  }

  // Converts an amount from one currency to another
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Observable<number> {
    if (fromCurrency === toCurrency) {
      return of(amount);
    }

    return this.getExchangeRates(fromCurrency).pipe(
      map(rates => {
        if (rates[toCurrency]) {
          return amount * rates[toCurrency];
        } else {
          console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}. Returning 0.`);
          return 0; // Return 0 if rate not found
        }
      }),
      catchError(error => {
        console.error('Error during currency conversion:', error);
        return of(0); // Return 0 on error during conversion
      })
    );
  }
}

import { Component, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor {
  open = false;
  value = '#111827';
  disabled = false;

  swatches: string[] = [
    '#111827', '#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af',
    '#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1',
    '#000000', '#ef4444', '#f59e0b', '#84cc16', '#10b981', '#06b6d4',
    '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e',
  ];

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private host: ElementRef) {}

  writeValue(val: string): void {
    if (val) this.value = val;
  }
  registerOnChange(fn: (val: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    this.onTouched();
  }

  pick(color: string) {
    this.value = color;
    this.onChange(this.value);
  }

  hexInput(val: string) {
    // normalize and basic validation
    let v = val.trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
      this.value = v;
      this.onChange(this.value);
    }
  }

  onHexInput(ev: Event) {
    const val = (ev.target as HTMLInputElement)?.value || '';
    this.hexInput(val);
  }

  @HostListener('document:keydown.escape') onEsc() { this.open = false; }
  @HostListener('document:click', ['$event']) onDocClick(ev: MouseEvent) {
    if (!this.host.nativeElement.contains(ev.target)) {
      this.open = false;
    }
  }
}

var ColorPickerComponent_1;
import { __decorate } from "tslib";
import { Component, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export let ColorPickerComponent = ColorPickerComponent_1 = class ColorPickerComponent {
    constructor(host) {
        this.host = host;
        this.open = false;
        this.value = '#111827';
        this.disabled = false;
        this.swatches = [
            '#111827', '#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af',
            '#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1',
            '#000000', '#ef4444', '#f59e0b', '#84cc16', '#10b981', '#06b6d4',
            '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e',
        ];
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    writeValue(val) {
        if (val)
            this.value = val;
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    toggle() {
        if (this.disabled)
            return;
        this.open = !this.open;
        this.onTouched();
    }
    pick(color) {
        this.value = color;
        this.onChange(this.value);
    }
    hexInput(val) {
        // normalize and basic validation
        let v = val.trim();
        if (!v.startsWith('#'))
            v = '#' + v;
        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
            this.value = v;
            this.onChange(this.value);
        }
    }
    onHexInput(ev) {
        const val = ev.target?.value || '';
        this.hexInput(val);
    }
    onEsc() { this.open = false; }
    onDocClick(ev) {
        if (!this.host.nativeElement.contains(ev.target)) {
            this.open = false;
        }
    }
};
__decorate([
    HostListener('document:keydown.escape')
], ColorPickerComponent.prototype, "onEsc", null);
__decorate([
    HostListener('document:click', ['$event'])
], ColorPickerComponent.prototype, "onDocClick", null);
ColorPickerComponent = ColorPickerComponent_1 = __decorate([
    Component({
        selector: 'app-color-picker',
        templateUrl: './color-picker.component.html',
        styleUrls: ['./color-picker.component.css'],
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ColorPickerComponent_1),
                multi: true,
            },
        ],
    })
], ColorPickerComponent);
//# sourceMappingURL=color-picker.component.js.map
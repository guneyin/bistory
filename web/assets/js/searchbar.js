function selectConfigs(symbols) {
    return {
        filter: '',
        show: false,
        selected: null,
        focusedOptionIndex: null,
        fuse: new Fuse(symbols.items, {
            minMatchCharLength: 3,
            keys: ["code", "name"],
        }),
        close() {
            this.show = false;
            this.filter = this.selectedName();
            this.focusedOptionIndex = this.selected ? this.focusedOptionIndex : null;
        },
        open() {
            this.show = true;
            this.filter = '';
        },
        isOpen() {
            return this.show === true
        },
        selectedName() {
            return this.selected ? this.selected.code : this.filter;
        },
        selectedCode() {
            return this.selected ? this.selected.code : this.filter;
        },
        classOption(id, index) {
            const isSelected = this.selected ? (id === this.selected.id) : false;
            const isFocused = (index === this.focusedOptionIndex);
            return {
                'cursor-pointer w-full border-gray-100 border-b hover:bg-blue-50': true,
                'bg-blue-100': isSelected,
                'bg-blue-50': isFocused
            };
        },
        filteredOptions() {
            return this.fuse.search(this.filter);
        },
        onOptionClick(index) {
            this.focusedOptionIndex = index;
            this.selectOption();
        },
        selectOption() {
            if (!this.isOpen()) {
                return;
            }
            this.focusedOptionIndex = this.focusedOptionIndex ?? 0;
            const selected = this.filteredOptions()[this.focusedOptionIndex].item;

            if (this.selected && this.selected.id === selected.id) {
                this.filter = '';
                this.selected = null;
            } else {
                this.selected = selected;
                this.filter = this.selectedName();
            }
            this.close();
        },
        focusPrevOption() {
            if (!this.isOpen()) {
                return;
            }
            const optionsNum = Object.keys(this.filteredOptions()).length - 1;
            if (this.focusedOptionIndex > 0 && this.focusedOptionIndex <= optionsNum) {
                this.focusedOptionIndex--;
            } else if (this.focusedOptionIndex === 0) {
                this.focusedOptionIndex = optionsNum;
            }
        },
        focusNextOption() {
            const optionsNum = Object.keys(this.filteredOptions()).length - 1;
            if (!this.isOpen()) {
                this.open();
            }
            if (this.focusedOptionIndex == null || this.focusedOptionIndex === optionsNum) {
                this.focusedOptionIndex = 0;
            } else if (this.focusedOptionIndex >= 0 && this.focusedOptionIndex < optionsNum) {
                this.focusedOptionIndex++;
            }
        }
    }
}

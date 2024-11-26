<template>
    <div class="custom-select">
        <select class="default-select" :name="selectName" :id="selectId" @change="selectHandler(this.$el.querySelector('.default-select'))">
            <option
                v-for="(option, key) in selectOptions"
                :key="key"
                :value="option.value"
            >{{ option.text }}</option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        selectName: {
            type: String,
            default: 'selectName'
        },
        selectId: {
            type: String,
            default: 'selectId'
        },
        selectHandler: {
            type: Function
        },
        selectOptions: {
            type: Array,
            default: () => [
                {
                    value: 'example1',
                    text: 'Example 1'
                },
                {
                    value: 'example2',
                    text: 'Example 2'
                },
            ]
        }
    },

    data() {
        return {
            elementOptions: {
                defaultSelectClass: '.default-select',
                showClass: 'show',
                selectedClass: 'selected',
            }
        }
    },

    methods: {
        createCustomSelect() {
            // get the select element with all it's options
            this.defaultSelect = this.$el.querySelector(this.elementOptions.defaultSelectClass);
            this.options = this.getFormattedOptions(this.defaultSelect.querySelectorAll('option'));
            this.selectedOption = this.options.find(option => option.selected);

            // create the new custom select element
            this.customEl = document.createElement('div');
            this.labelEl = document.createElement('span');
            this.optionsCustomEl = document.createElement('ul');

            this.customSelectSetup();

            // hide the default select and show new custom select
            this.defaultSelect.style.display = 'none';
            this.$el.append(this.customEl);
        },

        selectValue(value) {
            // get the newly selected value and the old selected value
            const newSelectedOption = this.options.find(option => option.value === value);
            const prevSelectedOption = this.selectedOption;

            // unselect the old value
            prevSelectedOption.selected = false;
            prevSelectedOption.element.selected = false;

            // select the new value
            newSelectedOption.selected = true;
            newSelectedOption.element.selected = true;

            // show new selected value in label wrapper and change selectedOption to new value
            this.labelEl.textContent = newSelectedOption.label;
            this.selectedOption = this.options.find(option => option.selected);
        },

        customSelectSetup() {
            // add custom select container
            this.customEl.classList.add('custom-select-container');
            this.customEl.tabIndex = 0;

            // add custom select label
            this.labelEl.classList.add('custom-select-value');
            this.labelEl.textContent = this.selectedOption.label;
            this.customEl.append(this.labelEl);

            // add custom select options
            this.optionsCustomEl.classList.add('custom-select-options');

            this.options.forEach(option => {
                // for each element in the array, create a new custom option element
                const optionEl = document.createElement('li');

                optionEl.classList.add('custom-select-option');
                optionEl.classList.toggle(this.elementOptions.selectedClass, option.selected);
                optionEl.textContent = option.label;
                optionEl.dataset.value = option.value;

                optionEl.addEventListener('click', () => {
                    // get the custom option element of the old selected value and also get the old selected value itself
                    const selectedCustomEl = this.$el.querySelector(`[data-value="${this.selectedOption.value}"]`);
                    const oldSelectValue = this.defaultSelect.value;

                    selectedCustomEl.classList.remove(this.elementOptions.selectedClass);
                    this.selectValue(option.value);
                    optionEl.classList.add(this.elementOptions.selectedClass);

                    // trigger change event
                    if (oldSelectValue !== this.defaultSelect.value) this.selectHandler(this.defaultSelect);

                    this.optionsCustomEl.classList.remove(this.elementOptions.showClass);
                });

                this.optionsCustomEl.append(optionEl);
            })

            this.customEl.append(this.optionsCustomEl);

            this.labelEl.addEventListener('click', () => this.optionsCustomEl.classList.toggle(this.elementOptions.showClass));
            this.customEl.addEventListener('blur', () => this.optionsCustomEl.classList.remove(this.elementOptions.showClass));
        },

        getFormattedOptions(optionEls) {
            return [...optionEls].map(optionEl => {
                return {
                    value: optionEl.value,
                    label: optionEl.label,
                    selected: optionEl.selected,
                    element: optionEl
                }
            });
        },
    },

    mounted() {
        this.createCustomSelect();
    }
}
</script>

<style lang="scss">
@import '@/scss/abstracts/variables.scss';

.custom-select-container,
.custom-select-value,
.custom-select-options,
.custom-select-option {
    box-sizing: border-box;
}

.custom-select-container {
    display: inline-block;
    position: relative;
    font-size: 12px;
    line-height: 16px;
    color: $color-black;
}

.custom-select-value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 200px;
    height: 48px;
    border-radius: 5px;
    padding: 0 20px 0 25px;
    background-color: $color-white;
    box-shadow: 0 2px 9px 0 rgba($color: $color-black, $alpha: 0.1532);
    cursor: pointer;
    user-select: none;

    &::after {
        font: var(--fa-font-solid);
        content: '\f107';
        display: inline-block;
    }
}

.custom-select-options {
    position: absolute;
    display: none;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    height: 0;
    margin: 4px 0 0;
    border-radius: 5px;
    padding: 18px 20px 18px 25px;
    background-color: $color-white;
    box-shadow: 0 2px 9px 0 rgba($color: $color-black, $alpha: 0.1532);
    list-style: none;
    transition: height 0.33s;
    z-index: 1000;

    &.show {
        display: flex;
        height: auto;
    }
}

.custom-select-option {
    cursor: pointer;
    font-weight: 400;
    transition: font-weight .2s;

    &:hover {
        font-weight: 700;
    }

    &.selected {
        display: none;
    }
}

.app--darkmode {
    .custom-select-container {
        color: $color-white;
    }

    .custom-select-value {
        background-color: $color-dark-secondary;
    }

    .custom-select-options {
        background-color: $color-dark-secondary;
    }
}
</style>

<template>
    <RouterLink
        :to="buttonHref"
        :class="['btn', ...classes]"
    >
        <i v-if="iconClass !== ''" :class="['icon', iconClass]"></i>
        <slot>Button Text</slot>
    </RouterLink>
</template>

<script>
export default {
    props: {
        buttonHref: {
            type: String,
            default: '/'
        },
        iconClass: {
            type: String,
            default: ''
        },
        theme: {
            type: String,
            default: 'primary',
            validator(value) {
                return ['primary', 'light'].includes(value);
            }
        },
        additionalClasses: {
            type: Array,
            default: () => []
        }
    },

    computed: {
        classes() {
            const classes = [];

            classes.push(`btn-${this.theme}`);

            if (this.additionalClasses.length > 0) {
                this.additionalClasses.forEach(additionalClass => classes.push(`btn-${additionalClass}`));
            }

            return classes;
        }
    }
}
</script>

<style lang="scss">
@import '@/scss/abstracts/variables.scss';

.btn {
    padding: 8px 22px;
    background-color: $color-white;
    border-radius: 2px;
    color: $color-black;
    text-align: center;
    font-weight: 300;
    transition: background-color .33s;
    overflow: hidden;

    .icon {
        margin-right: 8px;
        transition: transform .25s;
    }

    &:hover {
        background-color: hsl(0, 0%, 90%);

        .icon {
            transform: translateX(-8px);
        }
    }

    &-primary {
        font-size: 14px;
        line-height: 20px;
        box-shadow: 0 0 7px 0 rgba($color: $color-black, $alpha: 0.30);
    }

    &-light {
        font-size: 12px;
        line-height: 1;
        box-shadow: 0 0 4px 1px rgba($color: $color-black, $alpha: 0.15);
    }
}

.app--darkmode {
    .btn {
        background-color: $color-dark-secondary;
        color: $color-white;

        &:hover {
            background-color: hsl(208.8, 22.5%, 11.8%);
        }
    }
}
</style>

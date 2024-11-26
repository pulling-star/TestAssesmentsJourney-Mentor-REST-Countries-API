<script>
import ToggleDarkmode from '@/components/ToggleDarkmode.vue';

export default {
    components: {
        ToggleDarkmode,
    },

    data() {
        return {
            app: '',
            options: {
                prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)'),
                darkmodeClass: 'app--darkmode',
            }
        }
    },

    methods: {
        toggleDarkmodeSystemSettings() {
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

            if (!this.options.prefersDarkScheme.matches) return this.app.classList.remove(this.options.darkmodeClass);

            this.app.classList.add(this.options.darkmodeClass);
        },

        toggleDarkmodeOnTime() {
            fetch('https://worldtimeapi.org/api/ip')
                .then((response) => {
                    if (!response.ok) return alert('Current Location could not get fetched');

                    return response.json();
                })
                .then((data) => {
                    const currentDate = new Date(data.datetime);
                    const currentTime = currentDate.getHours();

                    if (currentTime > 23 || currentTime < 0)
                        return alert(`ERROR: currentHour with value ${currentTime} is not a valid time`);

                    if (currentTime > 5 && currentTime < 20)
                        return this.app.classList.remove(this.options.darkmodeClass);

                    this.app.classList.add(this.options.darkmodeClass);
                });
        },
    },

    mounted() {
        this.app = this.$el.parentElement;

        this.toggleDarkmodeSystemSettings();
        this.toggleDarkmodeOnTime();
    }
};
</script>

<template>
    <header class="header">
        <div class="header__left">
            <div class="nav-heading">Where in the World</div>
        </div>

        <div class="header__right">
            <ToggleDarkmode />
        </div>
    </header>

    <div class="container">
        <RouterView />
    </div>
</template>

<style lang="scss">
@import '@/scss/abstracts/variables.scss';

.header {
    position: fixed;
    top: 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    width: 100vw;
    height: 80px;
    padding: 0 16px;
    background-color: $color-white;
    color: $color-black;
    box-shadow: 0 2px 4px 0 rgba($color: $color-black, $alpha: 0.1562);
    z-index: 1000;

    .nav-heading {
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
    }
}

.container {
    padding: 105px 16px 50px;
}

.app--darkmode {
    .header {
        background-color: $color-dark-secondary;
        color: $color-white;
    }
}

@media (min-width: 1200px) {
    .header {
        padding: 0 80px;

        .page-heading {
            font-size: 24px;
            font-weight: 800;
            line-height: 1;
        }
    }

    .container {
        padding: 125px 80px;
    }
}
</style>

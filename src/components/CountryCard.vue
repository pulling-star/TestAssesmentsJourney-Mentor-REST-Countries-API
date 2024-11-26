<template>
    <div class="country card" :id="countryCode">
        <RouterLink
            :to="`/country/${countryCode}`"
            class="country-link"
        >
            <div class="card__image">
                <img class="country__flag" :src="countryFlag" :alt="`Flag of ${countryId}`" />
            </div>

            <div class="card__content">
                <div class="country__name">
                    <slot name="countryName"></slot>
                </div>

                <div class="country__population">
                    <span class="country__info-heading">Population: </span><slot name="countryPopulation"></slot>
                </div>

                <div class="country__region">
                    <span class="country__info-heading">Region: </span><slot name="countryRegion"></slot>
                </div>

                <div class="country__capital" v-for="capital in countryCapital" :key="capital">
                    <span class="country__info-heading">Capital: </span>{{ capital }}
                </div>
            </div>
        </RouterLink>
    </div>
</template>

<script>
export default {
    props: {
        country: {
            type: Array,
            default: () => []
        },
        countryId: {
            type: String,
            default: ''
        },
        countryCode: {
            type: String,
            default: ''
        },
        countryFlag: {
            type: String,
            default: ''
        },
        countryCapital: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="scss">
@import '@/scss/abstracts/variables.scss';

.card {
    margin: 0 40px;
    border-radius: 5px;
    background-color: $color-white;
    color: $color-black;
    box-shadow: 0 0 7px 2px rgba($color: $color-black, $alpha: 0.1295);
    overflow: hidden;

    .country-link {
        color: $color-black;
    }

    &__image {
        border-bottom: 1px solid $color-border;
        width: 100%;
        aspect-ratio: 33/20;

        img {
            width: 100%;
            object-fit: cover;
            aspect-ratio: 33/20;
        }
    }

    &__content {
        padding: 25px 22px 45px 22px;
    }

    .country {
        &__name {
            font-size: 18px;
            line-height: 26px;
            font-weight: 800;
            margin-bottom: 16px;
        }

        &__info-heading {
            font-weight: 600;
        }

        &__population,
        &__region {
            margin-bottom: 8px;
        }
    }
}

.app--darkmode {
    .card {
        background-color: $color-dark-secondary;
        color: $color-white;

        .country-link {
            color: $color-white;
        }
    }
}

@media (min-width: 1200px) {
    .card {
        margin: 0;
    }
}
</style>

<template>
    <main>
        <div class="search-filter">
            <div class="input-wrapper">
                <form class="form-search" @submit.prevent="onSubmitSearch">
                    <button type="submit" class="search__button">
                        <i class="fa fa-search"></i>
                    </button>
                    <input
                        class="search__input"
                        type="text"
                        placeholder="Search..."
                        name="search"
                        v-model="searchedCountry"
                    >
                </form>
            </div>

            <div class="input-wrapper">
                <CustomSelect
                    selectName="regionFilter"
                    selectId="regionSelect"
                    :selectHandler="selectHandler"
                    :selectOptions="selectOptions"
                />
            </div>
        </div>

        <div class="content-container">
            <div class="cards-wrapper" v-if="!searchFailed">
                <CountryCard
                    v-for="(country, key) in this.countries"
                    :key="key"
                    :countryId="country.name.common"
                    :countryCode="country.cca3"
                    :countryFlag="country.flags.png"
                    :countryCapital="country.capital"
                >
                    <template #countryName>
                        {{ country.name.common }}
                    </template>

                    <template #countryPopulation>
                        {{ internationalNumberFormat.format(country.population) }}
                    </template>

                    <template #countryRegion>
                        {{ country.region }}
                    </template>
                </CountryCard>
            </div>

            <div class="search-error" v-if="searchFailed">
                <p>Your search of {{ searchFailedWithSearchedCountry }} has failed</p>
            </div>
        </div>
    </main>
</template>

<script>
import CustomSelect from '@/components/CustomSelect.vue';
import CountryCard from '@/components/CountryCard.vue';

export default {
    data() {
        return {
            countries: () => [],
            searchedCountry: '',
            searchFailed: false,
            searchFailedWithSearchedCountry: '',
            internationalNumberFormat: new Intl.NumberFormat('en-US'),
            selectOptions: [
                {
                    value: 'none',
                    text: 'Filter by Region'
                },
                {
                    value: 'Africa',
                    text: 'Africa'
                },
                {
                    value: 'America',
                    text: 'America'
                },
                {
                    value: 'Asia',
                    text: 'Asia'
                },
                {
                    value: 'Europe',
                    text: 'Europe'
                },
                {
                    value: 'Oceania',
                    text: 'Oceania'
                }
            ],
        };
    },

    components: {
        CustomSelect,
        CountryCard
    },

    methods: {
        fetchCountries() {
            fetch('https://restcountries.com/v3.1/all')
                .then((response) => {
                    if (!response.ok) return alert('Countries could not get fetched');

                    return response.json();
                })
                .then((data) => {
                    this.countries = data;
                    this.countries.sort(this.compareObjectValues);
                });
        },

        onSubmitSearch() {
            if (this.searchedCountry === '') {
                this.fetchCountries();
                this.searchFailed = false;
                return;
            };

            fetch(`https://restcountries.com/v3.1/name/${this.searchedCountry}`)
                .then((response) => {
                    if (!response.ok) return alert('Country was not found and therefore could not get fetched');

                    return response.json();
                })
                .then((searchResult) => {
                    this.countries = searchResult;

                    if (this.countries.length === 0) {
                        this.searchFailedWithSearchedCountry = this.searchedCountry;
                        this.searchFailed = true;
                        return;
                    }

                    this.searchFailed = false;
                    this.countries.sort(this.compareObjectValues);
                });
        },

        selectHandler(target) {
            const selectedValue = target.value;

            this.showCountriesByRegion(selectedValue);
        },

        showCountriesByRegion(selectedValue) {
            if (selectedValue === '' || selectedValue === 'none') {
                this.fetchCountries();
                return;
            };

            fetch(`https://restcountries.com/v3.1/region/${selectedValue}`)
                .then((response) => {
                    if (!response.ok) return alert('Countries of region could not get fetched');

                    return response.json();
                })
                .then((region) => {
                    this.countries = region;
                    this.countries.sort(this.compareObjectValues);
                });
        },

        compareObjectValues(value1, value2) {
            if (value1.name.common > value2.name.common) return 1;
            if (value1.name.common < value2.name.common) return -1;
            return 0;
        },
    },

    mounted() {
        this.fetchCountries();
    }
};
</script>

<style lang="scss">
@import '@/scss/abstracts/variables.scss';

.search-filter {
    margin-bottom: 30px;

    .form-search {
        position: relative;
        margin-bottom: 40px;
        box-shadow: 0 2px 9px 0 rgba($color: $color-black, $alpha: 0.1532);
    }

    .search {
        &__button {
            position: absolute;
            top: 1px;
            height: 46px;
            width: 64px;
            background-color: transparent;
            border: 0;
            border-radius: 5px 0 0 5px;
            color: $color-black;
            cursor: pointer;
            z-index: 101;
            transform: translateX(1px);
        }

        &__input {
            height: 48px;
            width: 100%;
            padding: 10px 10px 10px 75px;
            background-color: $color-white;
            border: 0;
            border-radius: 0 5px 5px 0;
            color: $color-black;
            z-index: 100;
        }
    }
}

.cards-wrapper {
    display: grid;
    gap: 40px;
}

.app--darkmode {
    .search-filter {
        .search {

            &__button,
            &__input {
                color: $color-white;
            }

            &__input {
                background-color: $color-dark-secondary;
            }
        }
    }
}

@media (min-width: 1200px) {
    .search-filter {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 0;

        .form-search {
            width: 480px;
        }
    }

    .cards-wrapper {
        grid-template-columns: repeat(4, 1fr);
        gap: 75px
    }
}
</style>

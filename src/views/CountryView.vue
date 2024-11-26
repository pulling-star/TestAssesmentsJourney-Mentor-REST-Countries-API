<template>
    <main v-for="(country, key) in countryData" :key="key" class="country-detailpage">
        <div class="go-back">
            <Button
                buttonHref="/"
                iconClass="fa-solid fa-arrow-left-long"
                theme="primary"
                :additionalClasses="['go-back']"
            >Back</Button>
        </div>

        <div class="page-content country">
            <div class="country__flag">
                <img class="country__flag" :src="country.flags.png" :alt="`Flag of ${country.name.common}`" />
            </div>

            <div class="country__information">
                <div class="page-title country__name">
                    <h1>{{ country.name.common }}</h1>
                </div>

                <div class="information-wrapper">
                    <div class="information-left">
                        <div class="country__native-name">
                            <p>
                                <span class="information__title">Native Name:</span>
                                {{ Object.values(country.name.nativeName)[0].common }}
                            </p>
                        </div>

                        <div class="country__population">
                            <p>
                                <span class="information__title">Population:</span>
                                {{ internationalNumberFormat.format(country.population) }}
                            </p>
                        </div>

                        <div class="country__region">
                            <p>
                                <span class="information__title">Region:</span>
                                {{ country.region }}
                            </p>
                        </div>

                        <div class="country__subregion">
                            <p>
                                <span class="information__title">Sub Region:</span>
                                {{ country.subregion }}
                            </p>
                        </div>

                        <div class="country__capital">
                            <p>
                                <span class="information__title">Capital:</span>
                                {{ country.capital[0] }}
                            </p>
                        </div>
                    </div>

                    <div class="information-right">
                        <div class="country__tld">
                            <p>
                                <span class="information__title">Top Level Domain:</span>
                                {{ country.tld[0] }}
                            </p>
                        </div>

                        <div class="currencies">
                            <p>
                                <span class="information__title">Currencies: </span>
                                <span
                                    v-for="(currency, key) in Object.values(country.currencies)"
                                    :key="currency"
                                    class="currency"
                                >
                                    {{ currency.name }}<span v-if="key < (Object.keys(country.currencies).length - 1)">, </span>
                                </span>
                            </p>
                        </div>

                        <div class="languages">
                            <p>
                                <span class="information__title">Languages: </span>
                                <span
                                    v-for="(language, key) in Object.values(country.languages)"
                                    :key="language"
                                    class="currency"
                                >
                                    {{ language }}<span v-if="key < (Object.keys(country.languages).length - 1)">, </span>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="country.borders" class="country__border-countries">
                    <h2 class="border-countries-heading">Border Countries:</h2>

                    <Button
                        v-for="(borderCountry, key) in borderCountries"
                        :key="key"
                        :buttonHref="`/country/${borderCountry.code}`"
                        theme="light"
                        :additionalClasses="['border-country']"
                    >{{ borderCountry.name }}</Button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import Button from '@/components/Button.vue';

export default{
    data() {
        return {
            borderCountries: [],
            countryData: () => [],
            internationalNumberFormat: new Intl.NumberFormat('en-US'),
        }
    },

    components: {
        Button
    },

    methods: {
        fetchCountryData(country) {
            fetch(`https://restcountries.com/v3.1/alpha/${country}`)
                .then((response) => {
                    if (!response.ok) return alert('Country was not found and therefore could not get fetched')

                    return response.json()
                })
                .then((countryData) => {
                    this.countryData = countryData;

                    this.borderCountries = [];
                    this.getBorderCountries();
                });
        },

        getBorderCountries() {
            if (!this.countryData[0].borders) return;

            this.countryData[0].borders.forEach(borderCountry => {
                fetch(`https://restcountries.com/v3.1/alpha/${borderCountry}`)
                    .then(response => {
                        if (!response.ok) return alert('Border Country was not found and therefore could not get fetched')

                        return response.json()
                    })
                    .then((borderCountryData) => {
                        return this.borderCountries.push({
                            name: borderCountryData[0].name.common,
                            code: borderCountryData[0].cca3
                        });
                    });
            })
        },

        getCountryDetailsData() {
            const country = this.$route.params.code;
            this.fetchCountryData(country);
        }
    },

    created() {
        this.$watch(
            () => this.$route.params,
            (params) => {
                if (this.$route.path === '/') return;

                this.getCountryDetailsData();
            }
        );

        this.getCountryDetailsData();
    }
}
</script>

<style lang="scss">
.country-detailpage {
    padding: 0 16px;

    .country {
        margin-top: 65px;

        &__flag {
            margin-bottom: 45px;
            aspect-ratio: 320/229;
            border-radius: 5.72px;
            overflow: hidden;

            img {
                width: 100%;
                object-fit: cover;
            }
        }

        &__name {
            margin-bottom: 16px;

            h1 {
                font-size: 22px;
                font-weight: 800;
                line-height: 1;
            }
        }

        &__border-countries {
            display: grid;
            gap: 10px;
            grid-template-columns: repeat(3, 1fr);
            margin-top: 32px;

            .border-countries-heading {
                grid-column: span 3;
                margin-top: 0;
                margin-bottom: 16px;
                font-size: 16px;
                font-weight: 600;
                line-height: 24px;
            }
        }

        .information {
            &__title {
                font-weight: 700;
            }

            &-left {
                margin-bottom: 32px;
            }
        }
    }
}

@media (min-width: 768px) {
    .country-detailpage {
        .country {
            .information {
                &-wrapper {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                }

                &-left {
                    padding-right: 20px;
                }
            }
        }
    }
}

@media (min-width: 1200px) {
    .country-detailpage {
        padding: 0;

        .country {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 144px;

            &__name {
                margin-bottom: 23px;

                h1 {
                    font-size: 32px;
                }
            }

            &__border-countries {
                grid-template-columns: repeat(5, 1fr);
                align-items: center;
                margin-top: 68px;

                .border-countries-heading {
                    grid-column: span 1;
                    margin-bottom: 0;
                    line-height: 1;
                }
            }
        }
    }
}
</style>

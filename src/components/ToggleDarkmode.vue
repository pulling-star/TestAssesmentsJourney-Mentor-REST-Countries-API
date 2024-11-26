<template>
    <div class="toggle-darkmode" @click="onClickToggleDarkmode">
        <MoonIcon />
        Dark Mode
    </div>
</template>

<script>
import MoonIcon from '@/components/icons/MoonIcon.vue';

export default {
  components: {
    MoonIcon,
  },

  methods: {
    onClickToggleDarkmode() {
        const app = document.querySelector('#app');

        app.classList.toggle('app--darkmode');
    }
  }
}
</script>

<style lang="scss">
@import '@/scss/abstracts/variables.scss';

.toggle-darkmode {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
    color: $color-black;
    cursor: pointer;
    font-weight: 600;
}

.app--darkmode {
    .toggle-darkmode {
        color: $color-white;
    }
}
</style>

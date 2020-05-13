<script>
  import { link } from "svelte-spa-router";
</script>

<style lang="sass">
  .logo-link
    text-decoration: none

  .logo-text
    font-family: 'Raleway', sans-serif
    font-size: 34px
    color: white
</style>

<a class="logo-link" href="/" use:link>
  <span class="logo-text">devlog</span>
</a>

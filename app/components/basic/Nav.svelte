<script>
  import NavLogo from "./NavLogo.svelte";
</script>

<style lang="sass">
  .nav-container
    height: 60px
    background-color: #FFC85F
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16)
    z-index: 1000

  .nav-container-inner
    display: flex
    flex-direction: row
    align-items: center
    justify-content: start
    margin-left: auto
    margin-right: auto
    padding-right: 10px
    max-width: 860px
    height: 100%

  .nav-logo-spacer
    margin-right: auto
</style>

<nav class="nav-container">
  <div class="nav-container-inner">
    <span class="nav-logo-spacer"></span>
    <NavLogo />
  </div>
</nav>

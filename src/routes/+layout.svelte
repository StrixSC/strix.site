<script>
    import "../app.css";
    import Nav from "../lib/components/nav.svelte";
    import Footer from "../lib/components/footer.svelte";
</script>

<header>
    <Nav />
</header>

<main class="main">
  <slot />
</main>

<footer>
    <Footer />
</footer>
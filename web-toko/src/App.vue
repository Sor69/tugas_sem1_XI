<template>
  <nav class="nav">
    <RouterLink to="/" class="nav-link">Dashboard</RouterLink>
    <RouterLink to="/inventaris" class="nav-link">Inventaris</RouterLink>
  </nav>
  <RouterView />
</template>

<style>
.nav { display: flex; gap: 8px; max-width: 1120px; margin: 0 auto; padding: 20px 24px 0; }
.nav-link { padding: 8px 14px; border-radius: 8px; color: var(--muted); text-decoration: none; font-weight: 600; font-size: 0.92rem; }
.nav-link:hover { background: #e6f4f2; }
.nav-link.router-link-exact-active { background: var(--accent); color: #fff; }
</style>
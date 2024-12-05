<template>
    <template>
  <div class="min-h-screen flex flex-col">
    <header class="flex justify-center py-2 h-28">
      <nuxt-link to="/" class="flex gap-2 items-center">
        <img src="/img/logo.webp" alt="Logo" class="size-24" />
        <div class="font-bold text-3xl -ml-4">Characreate</div>
      </nuxt-link>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer>
    </footer>
  </div>
</template>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'

const API = 'http://localhost:3000/api/data_toko'
const barang = ref([])
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(API)
    if (!res.ok) throw new Error()
    barang.value = await res.json()
  } catch {
    error.value = 'Data gagal dimuat. Pastikan server berjalan.'
  } finally {
    loading.value = false
  }
})

const rupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID')

const totalJenis = computed(() => barang.value.length)
const totalStok = computed(() => barang.value.reduce((a, b) => a + Number(b.jumlah_stok), 0))
const nilaiStok = computed(() =>
  barang.value.reduce((a, b) => a + Number(b.harga_barang) * Number(b.jumlah_stok), 0)
)
const jumlahHabis = computed(() => barang.value.filter((b) => b.jumlah_stok <= 0).length)

const stokMenipis = computed(() =>
  barang.value
    .filter((b) => b.jumlah_stok > 0 && b.jumlah_stok <= 5)
    .sort((a, b) => a.jumlah_stok - b.jumlah_stok)
)
const perluRestok = computed(() => barang.value.filter((b) => b.jumlah_stok <= 0))
</script>

<template>
  <div class="container">
    <header>
      <h1>Dashboard</h1>
      <p>Ringkasan inventaris toko</p>
    </header>

    <p v-if="error" class="server-error" role="alert">{{ error }}</p>
    <p v-else-if="loading" class="muted">Memuat data…</p>

    <template v-else>
      <div class="stats">
        <div class="panel stat"><span>Jenis barang</span><strong>{{ totalJenis }}</strong></div>
        <div class="panel stat"><span>Total stok</span><strong>{{ totalStok.toLocaleString('id-ID') }}</strong></div>
        <div class="panel stat"><span>Nilai stok</span><strong>{{ rupiah(nilaiStok) }}</strong></div>
        <div class="panel stat warn"><span>Barang habis</span><strong>{{ jumlahHabis }}</strong></div>
      </div>

      <div class="grid2">
        <section class="panel box">
          <h2>Stok menipis (≤ 5)</h2>
          <p v-if="!stokMenipis.length" class="muted">Tidak ada.</p>
          <ul v-else>
            <li v-for="b in stokMenipis" :key="b.id">
              <span>{{ b.nama_barang }}</span><strong>{{ b.jumlah_stok }}</strong>
            </li>
          </ul>
        </section>

        <section class="panel box">
          <h2>Perlu restok</h2>
          <p v-if="!perluRestok.length" class="muted">Semua barang ada stok.</p>
          <ul v-else>
            <li v-for="b in perluRestok" :key="b.id">
              <span>{{ b.nama_barang }}</span><em>{{ b.status_barang }}</em>
            </li>
          </ul>
        </section>
      </div>

      <RouterLink to="/inventaris" class="btn btn-primary go">Kelola inventaris →</RouterLink>
    </template>
  </div>
</template>

<style scoped>
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat { padding: 18px 20px; display: flex; flex-direction: column; gap: 4px; }
.stat span { color: var(--muted); font-size: 0.85rem; }
.stat strong { font-size: 1.5rem; font-variant-numeric: tabular-nums; }
.stat.warn strong { color: var(--danger); }
.grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 24px; }
.box { padding: 20px 22px; }
.box ul { list-style: none; margin: 12px 0 0; padding: 0; }
.box li { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--line); font-size: 0.93rem; }
.box li:last-child { border-bottom: none; }
.box em { color: var(--muted); font-style: normal; font-size: 0.85rem; }
.muted { color: var(--muted); }
.go { display: inline-block; text-decoration: none; flex: none; }
</style>
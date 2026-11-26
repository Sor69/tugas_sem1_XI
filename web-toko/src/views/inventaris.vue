<script setup>
import { ref, onMounted } from 'vue'

const API = 'http://localhost:3000/api/data_toko'
const barang = ref([])
const errors = ref({})
const pesanServer = ref('')
const pesanTabel = ref('')
const menyimpan = ref(false)
const kataCari = ref('') // isi kotak pencarian
const filterAktif = ref('') // kata yang sedang dipakai memfilter tabel

// Harus sama persis dengan statusValid di server.js
const statusList = [
  { value: 'tersedia', label: 'Tersedia' },
  { value: 'habis', label: 'Habis' },
  { value: 'tidak di stok', label: 'Tidak di stok' }
]

const kosong = () => ({ id: null, nama_barang: '', harga_barang: '', status_barang: '', jumlah_stok: '' })
const form = ref(kosong())

async function ambilData() {
  pesanTabel.value = ''
  try {
    const kata = filterAktif.value
    const res = await fetch(kata ? `${API}?cari=${encodeURIComponent(kata)}` : API)
    if (!res.ok) throw new Error()
    barang.value = await res.json()
  } catch {
    pesanTabel.value = 'Data barang gagal dimuat. Pastikan server berjalan.'
  }
}

function validasi() {
  const f = form.value
  const e = {}
  const angkaKosong = (v) => v === '' || v === null || v === undefined

  if (!String(f.nama_barang ?? '').trim()) e.nama_barang = 'Nama barang wajib diisi'

  if (angkaKosong(f.harga_barang)) e.harga_barang = 'Harga wajib diisi'
  else if (Number(f.harga_barang) <= 0) e.harga_barang = 'Harga harus lebih dari 0'

  if (!statusList.some((s) => s.value === f.status_barang)) e.status_barang = 'Pilih status'

  if (angkaKosong(f.jumlah_stok)) e.jumlah_stok = 'Stok wajib diisi'
  else if (!Number.isInteger(Number(f.jumlah_stok)) || Number(f.jumlah_stok) < 0)
    e.jumlah_stok = 'Stok harus angka bulat 0 atau lebih'

  errors.value = e
  return Object.keys(e).length === 0
}

async function simpan() {
  pesanServer.value = ''
  if (!validasi()) return

  const { id, nama_barang, harga_barang, status_barang, jumlah_stok } = form.value
  menyimpan.value = true
  try {
    const res = await fetch(id ? `${API}/${id}` : API, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_barang: nama_barang.trim(),
        harga_barang: Number(harga_barang),
        status_barang,
        jumlah_stok: Number(jumlah_stok)
      })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      pesanServer.value = data.pesan || 'Gagal menyimpan data'
      return
    }
    resetForm()
    ambilData()
  } catch {
    pesanServer.value = 'Tidak bisa terhubung ke server'
  } finally {
    menyimpan.value = false
  }
}

// Ambil data terbaru dari GET /api/data_toko/:id sebelum diedit
async function edit(b) {
  errors.value = {}
  pesanServer.value = ''
  try {
    const res = await fetch(`${API}/${b.id}`)
    if (res.status === 404) {
      pesanTabel.value = 'Barang ini sudah tidak ada. Daftar diperbarui.'
      await ambilData()
      pesanTabel.value = 'Barang ini sudah tidak ada. Daftar diperbarui.'
      return
    }
    if (!res.ok) throw new Error()
    form.value = { ...(await res.json()) }
  } catch {
    form.value = { ...b }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function hapus(id) {
  if (!confirm('Yakin hapus data ini?')) return
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error()
    if (form.value.id === id) resetForm()
    ambilData()
  } catch {
    pesanTabel.value = 'Barang gagal dihapus.'
  }
}

function resetForm() {
  form.value = kosong()
  errors.value = {}
  pesanServer.value = ''
}

// Dijalankan saat tombol Cari ditekan atau Enter
function cari() {
  filterAktif.value = kataCari.value.trim()
  ambilData()
}

function resetCari() {
  kataCari.value = ''
  filterAktif.value = ''
  ambilData()
}

onMounted(ambilData)
</script>

<template>
  <div class="container">
    <header>
      <h1>Inventaris Toko</h1>
      <p>Kelola data barang dengan mudah</p>
    </header>

    <div class="layout">
      <form class="panel form" :class="{ editing: form.id }" novalidate @submit.prevent="simpan">
        <h2>{{ form.id ? `Edit barang #${form.id}` : 'Tambah barang' }}</h2>

        <div class="field">
          <label for="nama">Nama barang</label>
          <input id="nama" v-model="form.nama_barang" :class="{ invalid: errors.nama_barang }" />
          <small v-if="errors.nama_barang">{{ errors.nama_barang }}</small>
        </div>

        <div class="field">
          <label for="harga">Harga (Rp)</label>
          <input id="harga" v-model="form.harga_barang" :class="{ invalid: errors.harga_barang }" type="number" min="1" />
          <small v-if="errors.harga_barang">{{ errors.harga_barang }}</small>
        </div>

        <div class="field">
          <label for="status">Status</label>
          <select id="status" v-model="form.status_barang" :class="{ invalid: errors.status_barang }">
            <option value="" disabled>Pilih status</option>
            <option v-for="s in statusList" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <small v-if="errors.status_barang">{{ errors.status_barang }}</small>
        </div>

        <div class="field">
          <label for="stok">Jumlah stok</label>
          <input id="stok" v-model="form.jumlah_stok" :class="{ invalid: errors.jumlah_stok }" type="number" min="0" />
          <small v-if="errors.jumlah_stok">{{ errors.jumlah_stok }}</small>
        </div>

        <p v-if="pesanServer" class="server-error" role="alert">{{ pesanServer }}</p>

        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="menyimpan">
            {{ form.id ? 'Update' : 'Tambah' }}
          </button>
          <button v-if="form.id" type="button" class="btn btn-ghost" @click="resetForm">Batal</button>
        </div>
      </form>

      <section class="panel list">
        <div class="list-head">
          <h2>Daftar barang</h2>
          <span class="count">{{ barang.length }} barang</span>
        </div>

        <form class="search" role="search" @submit.prevent="cari">
          <input
            v-model="kataCari"
            type="search"
            placeholder="Cari nama barang atau ID"
            aria-label="Cari barang"
            @keydown.esc="resetCari"
          />
          <button type="submit" class="btn btn-primary">Cari</button>
          <button v-if="kataCari || filterAktif" type="button" class="btn btn-ghost" @click="resetCari">Reset</button>
        </form>

        <p v-if="pesanTabel" class="table-note" role="status">{{ pesanTabel }}</p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th class="right">Harga</th>
                <th>Status</th>
                <th>Stok</th>
                <th><span class="sr">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="barang.length === 0">
                <td colspan="6" class="empty">
                  {{ filterAktif ? `Tidak ada barang yang cocok dengan "${filterAktif}".` : 'Belum ada barang. Tambahkan lewat form di samping.' }}
                </td>
              </tr>
              <tr v-for="b in barang" :key="b.id">
                <td class="id">{{ b.id }}</td>
                <td class="nama">{{ b.nama_barang }}</td>
                <td class="right harga">Rp {{ Number(b.harga_barang).toLocaleString('id-ID') }}</td>
                <td>
                  <span class="status">
                    <i :class="['dot', b.jumlah_stok > 0 ? 'ada' : 'habis']"></i>
                    {{ b.status_barang }}
                  </span>
                </td>
                <td>
                  <span v-if="b.jumlah_stok > 0" class="stok">{{ b.jumlah_stok }}</span>
                  <span v-else class="stok-habis">Habis atau tidak di stok</span>
                </td>
                <td class="aksi">
                  <button class="link link-edit" @click="edit(b)">Edit</button>
                  <button class="link link-hapus" @click="hapus(b.id)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
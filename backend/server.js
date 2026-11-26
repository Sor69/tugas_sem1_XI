const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dtb-toko'
})

db.connect(err => {
  if (err) return console.log('Gagal terhubung:', err.message)
  console.log('Terhubung ke MySQL')
})

const statusValid = ['tersedia', 'habis', 'tidak di stok']

// Validasi input untuk POST dan PUT: tolak data kosong atau tidak valid
function validasiBarang(req, res, next) {
  const { nama_barang, harga_barang, status_barang, jumlah_stok } = req.body || {}
  const errors = []
  const kosong = (v) => v === undefined || v === null || String(v).trim() === ''

  if (typeof nama_barang !== 'string' || !nama_barang.trim()) {
    errors.push('Nama barang wajib diisi')
  }

  const harga = Number(harga_barang)
  if (kosong(harga_barang) || !Number.isFinite(harga) || harga <= 0) {
    errors.push('Harga wajib diisi dan harus lebih dari 0')
  }

  if (!statusValid.includes(status_barang)) {
    errors.push('Status ketersediaan tidak valid')
  }

  const stok = Number(jumlah_stok)
  if (kosong(jumlah_stok) || !Number.isInteger(stok) || stok < 0) {
    errors.push('Stok wajib diisi dan harus angka bulat 0 atau lebih')
  }

  if (errors.length > 0) {
    return res.status(400).json({ pesan: errors.join(', '), errors })
  }

  // Simpan versi yang sudah dibersihkan
  req.body = {
    nama_barang: nama_barang.trim(),
    harga_barang: harga,
    status_barang,
    jumlah_stok: stok
  }
  next()
}

// DAFTAR BARANG, bisa dicari: GET /api/data_toko?cari=kata
// Cocok jika kata ada di nama barang, atau sama persis dengan ID
app.get('/api/data_toko', (req, res) => {
  const cari = String(req.query.cari || '').trim()

  if (!cari) {
    db.query('SELECT * FROM data_toko', (err, hasil) => {
      if (err) return res.status(500).json(err)
      res.json(hasil)
    })
    return
  }

  const kataAman = cari.replace(/[\\%_]/g, '\\$&') // supaya % dan _ dianggap huruf biasa
  const angka = Number(cari)
  const id = Number.isInteger(angka) ? angka : 0

  db.query(
    'SELECT * FROM data_toko WHERE nama_barang LIKE ? OR id = ?',
    [`%${kataAman}%`, id],
    (err, hasil) => {
      if (err) return res.status(500).json(err)
      res.json(hasil)
    }
  )
})

// AMBIL SATU BARANG
app.get('/api/data_toko/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ pesan: 'ID tidak valid' })
  }

  db.query('SELECT * FROM data_toko WHERE id = ?', [id], (err, hasil) => {
    if (err) return res.status(500).json(err)
    if (hasil.length === 0) {
      return res.status(404).json({ pesan: 'Data tidak ditemukan' })
    }
    res.json(hasil[0])
  })
})

// TAMBAH
app.post('/api/data_toko', validasiBarang, (req, res) => {
  const { nama_barang, harga_barang, status_barang, jumlah_stok } = req.body
  db.query(
    'INSERT INTO data_toko (nama_barang, harga_barang, status_barang, jumlah_stok) VALUES (?, ?, ?, ?)',
    [nama_barang, harga_barang, status_barang, jumlah_stok],
    (err, hasil) => {
      if (err) return res.status(500).json(err)
      res.json({ id: hasil.insertId, nama_barang, harga_barang, status_barang, jumlah_stok })
    }
  )
})

// UBAH
app.put('/api/data_toko/:id', validasiBarang, (req, res) => {
  const { nama_barang, harga_barang, status_barang, jumlah_stok } = req.body
  db.query(
    'UPDATE data_toko SET nama_barang=?, harga_barang=?, status_barang=?, jumlah_stok=? WHERE id=?',
    [nama_barang, harga_barang, status_barang, jumlah_stok, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err)
      res.json({ pesan: 'Data diubah' })
    }
  )
})

// HAPUS
app.delete('/api/data_toko/:id', (req, res) => {
  db.query('DELETE FROM data_toko WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ pesan: 'Data dihapus' })
  })
})

app.listen(3000, () => console.log('Server jalan di http://localhost:3000'))
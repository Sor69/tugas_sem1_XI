-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Nov 2026 pada 01.43
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dtb-toko`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_toko`
--

CREATE TABLE `data_toko` (
  `id` int(11) NOT NULL,
  `nama_barang` varchar(100) NOT NULL,
  `harga_barang` int(11) NOT NULL,
  `status_barang` enum('tersedia','habis','tidak di stok') DEFAULT 'tersedia',
  `jumlah_stok` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `data_toko`
--

INSERT INTO `data_toko` (`id`, `nama_barang`, `harga_barang`, `status_barang`, `jumlah_stok`) VALUES
(1, 'Paving Block Bata', 85000, 'tersedia', 45),
(2, 'Paving Block Hexagon', 95000, 'tersedia', 30),
(3, 'Batako Press', 3500, 'tersedia', 500),
(4, 'Roster Beton 20×20', 12000, 'tersedia', 120),
(5, 'Roster Beton 30×30', 25000, 'habis', 0),
(6, 'Kanstin Beton', 35000, 'tersedia', 75),
(7, 'Buis Beton Ø30 cm', 55000, 'tersedia', 40),
(8, 'Buis Beton Ø40 cm', 85000, 'tersedia', 25),
(9, 'Buis Beton Ø60 cm', 175000, 'tidak di stok', 0),
(10, 'Tutup Gorong-gorong Beton', 150000, 'tersedia', 12),
(11, 'U-Ditch 30×30', 250000, 'tersedia', 15),
(12, 'U-Ditch 40×40', 350000, 'habis', 0),
(13, 'Tutup U-Ditch Beton', 125000, 'tersedia', 20),
(14, 'Genteng Beton Flat', 5500, 'tersedia', 300),
(15, 'Genteng Beton Gelombang', 6000, 'habis', 0),
(16, 'Loster Beton Angin', 15000, 'tidak di stok', 0),
(17, 'Bak Kontrol Beton', 200000, 'tidak di stok', 0),
(71, 'Bata merah', 10000, 'tersedia', 600),
(73, 'bbbbc', 22222, 'tidak di stok', 0);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `data_toko`
--
ALTER TABLE `data_toko`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `data_toko`
--
ALTER TABLE `data_toko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

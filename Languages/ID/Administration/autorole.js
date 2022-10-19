module.exports = {

    enabled         : "Penetapan role otomatis telah diaktifkan!",
    notEnabled      : "Penetapan role otomatis belum diaktifkan",
    currentRoles    : ( currentRoles ) => `Roles ${ currentRoles.map( ( x ) => `<@&${x}>` ).join( ", ") } akan ditambahkan otomatis ke anggota baru.`,
    disabled        : "Penetapan role otomatis telah dinonaktifkan!",
    cantAdd         : ( roles ) => `Roles ${ roles.join( ", " ) } tidak dapat ditambah. Level mereka lebih tinggi dari level saya!`,
    noRole          : "Anda harus memilih setidaknya satu role atau lebih untuk ditambah/dihapus",
    noChanges       : ( operation ) => `Tidak ada perubahan, penerapan role otomatis sudah di${ operation ? "aktifkan" : "nonaktifkan" } `,
    nothingToAdd    : "Tidak ada role yang dapat ditambah ...",
    error           : "Error muncul! Panggil komandan ...",
    missPerms       : "Roles berikut tidak dapat ditambah!",
    assigned        : ( length ) => length ? "Roles yang tersedia" : "Tidak ada role yang dapat diterapkan ;(",

};
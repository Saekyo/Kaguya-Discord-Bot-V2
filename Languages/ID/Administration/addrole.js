module.exports = {

    noTarget    : "Anda harus memilih member",
    noRole      : "Anda harus memilih setidaknya satu role atau lebih",
    added       : ( added ) => added.length > 1 ? `Roles ${ added.join( ", " ) } telah ditambah` : `Role ${ added.join( ", " ) } telah ditambah`,
    nothing     : "Tidak ada yang ditambah..."

};
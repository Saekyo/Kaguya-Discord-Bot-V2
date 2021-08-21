const Kaguya = require("./Structures/Kaguya");

const client = new Kaguya();

client.start();

process.on("rejectionHandled"   , ( err ) => console.error( err ) );

process.on("unhandledRejection" , ( err ) => console.error( err ) );

process.on("uncaughtException"  , ( err ) => console.error( err ) );
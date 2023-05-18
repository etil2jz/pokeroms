const fs = require('fs');
const sodium = require('sodium-native');

// Fonction de chiffrement XChaCha20
function encryptFile(filePath, key) {
  return new Promise((resolve, reject) => {
    try {
      // Lire le contenu du fichier
      const fileData = fs.readFileSync(filePath);
      
      // Générer une clé de chiffrement à partir de la clé secrète
      const encryptionKey = Buffer.alloc(sodium.crypto_stream_xchacha20_KEYBYTES);
      sodium.crypto_kdf_keygen(encryptionKey);
      
      // Générer un nonce unique
      const nonce = Buffer.alloc(sodium.crypto_stream_xchacha20_NONCEBYTES);
      sodium.randombytes_buf(nonce);
      
      // Créer un flux de chiffrement
      const encryptedData = Buffer.alloc(fileData.length);
      sodium.crypto_stream_xchacha20_xor(encryptedData, fileData, nonce, encryptionKey);
      
      // Concaténer la clé et le nonce au début des données chiffrées
      const encryptedBuffer = Buffer.concat([encryptionKey, nonce, encryptedData]);
      
      // Convertir les données chiffrées en Base64
      const encryptedBase64 = encryptedBuffer.toString('base64');
      
      fs.writeFileSync(outputFilePath, encryptedBase64);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Exemple d'utilisation
const filePath = './fichier_a_chiffrer.pkm'; // Chemin vers le fichier à chiffrer
const outputFilePath = './fichier_chiffre.locked'; // Chemin vers le fichier de sortie pour la chaîne Base64 chiffrée
const encryptionKey = Buffer.from('ieTyB9mo%7B9W5HO#sVpc5VC0tzhoX^708KIdSckt*0m@IOadQ'); // Clé de chiffrement

encryptFile(filePath, encryptionKey);

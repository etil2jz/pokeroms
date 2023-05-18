const fs = require('fs');
const sodium = require('sodium-native');

// Fonction de déchiffrement XChaCha20
function decryptFile(encryptedFilePath, outputFilePath, encryptionKey) {
  return new Promise((resolve, reject) => {
    try {
      // Lire le contenu chiffré depuis le fichier
      const encryptedData = fs.readFileSync(encryptedFilePath, 'utf8');
  
      // Convertir la chaîne Base64 en tampon de données
      const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  
      // Extraire la clé et le nonce des données chiffrées
      const key = encryptedBuffer.slice(0, sodium.crypto_stream_xchacha20_KEYBYTES);
      const nonce = encryptedBuffer.slice(
        sodium.crypto_stream_xchacha20_KEYBYTES,
        sodium.crypto_stream_xchacha20_KEYBYTES + sodium.crypto_stream_xchacha20_NONCEBYTES
      );
  
      // Décrypter le contenu chiffré
      const decryptedData = Buffer.alloc(encryptedBuffer.length - sodium.crypto_stream_xchacha20_KEYBYTES - sodium.crypto_stream_xchacha20_NONCEBYTES);
      sodium.crypto_stream_xchacha20_xor(decryptedData, encryptedBuffer.slice(sodium.crypto_stream_xchacha20_KEYBYTES + sodium.crypto_stream_xchacha20_NONCEBYTES), nonce, key);
  
      // Écrire les données déchiffrées dans un fichier
      fs.writeFileSync(outputFilePath, decryptedData);
  
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Exemple d'utilisation
const encryptedFilePath = './fichier_chiffre.locked'; // Chemin vers le fichier chiffré
const outputFilePath = './fichier_dechiffre.unlocked'; // Chemin vers le fichier de sortie pour les données déchiffrées
const encryptionKey = Buffer.from('ieTyB9mo%7B9W5HO#sVpc5VC0tzhoX^708KIdSckt*0m@IOadQ'); // Clé de chiffrement

decryptFile(encryptedFilePath, outputFilePath, encryptionKey);
